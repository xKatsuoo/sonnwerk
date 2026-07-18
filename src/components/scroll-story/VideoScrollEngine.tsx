"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/Button";
import {
  VIDEO_FPS,
  VIDEO_POSTER,
  VIDEO_SRC,
  VIDEO_SRC_MOBILE,
  VIDEO_TOTAL_FRAMES,
  videoStoryPhases,
} from "@/data/storyPhases";
import { captionOpacity, clamp01 } from "@/lib/crossfade";
import { cn } from "@/lib/cn";

/** Scroll distance dedicated to the video story, in viewport-heights. Tune for scrub granularity. */
const SCROLL_VH = 5;
/** Width, in frames, of the crossfade window between two adjacent phase captions. */
const FADE_FRAMES = 26;

interface VideoScrollEngineProps {
  onActivePhase: (index: number) => void;
}

/**
 * Pins the hero section for the length of the installation video and maps scroll
 * progress directly onto `video.currentTime`. Never calls `.play()` — the video is
 * scrubbed exclusively by the user's scroll position, forwards and backwards alike.
 */
export function VideoScrollEngine({ onActivePhase }: VideoScrollEngineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const supportsRVFC =
      typeof HTMLVideoElement !== "undefined" && "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const useCanvas = isMobile || !supportsRVFC;
    const sourceVideo = useCanvas ? mobileVideoRef.current : videoRef.current;
    const canvas = canvasRef.current;
    const ctx2d = useCanvas ? (canvas?.getContext("2d") ?? null) : null;

    if (!sourceVideo) return;

    // Only the element actually driving the scrub gets a `src`, so the browser never
    // fetches both the desktop and mobile renditions at once.
    sourceVideo.src = useCanvas ? VIDEO_SRC_MOBILE : VIDEO_SRC;

    let metadataReady = sourceVideo.readyState >= 1;
    let seeking = false;
    let displayedFrame = -1;
    let targetFrame = 0;
    let lastActivePhase = -1;
    let disposed = false;
    let watchdog: ReturnType<typeof setTimeout> | undefined;

    const draw = () => {
      if (useCanvas && canvas && ctx2d) {
        ctx2d.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
      }
    };

    const settle = () => {
      if (disposed) return;
      clearTimeout(watchdog);
      seeking = false;
      displayedFrame = Math.round(sourceVideo.currentTime * VIDEO_FPS);
      draw();
      if (targetFrame !== displayedFrame) advance();
    };

    const advance = () => {
      if (seeking || !metadataReady) return;
      const time = Math.min(
        sourceVideo.duration || VIDEO_TOTAL_FRAMES / VIDEO_FPS,
        Math.max(0, targetFrame / VIDEO_FPS),
      );
      // A no-op seek (target time already current, e.g. sitting at frame 0) never fires
      // a 'seeked' or video-frame callback, which would otherwise leave `seeking` stuck
      // true forever and freeze all future scrubbing.
      if (Math.abs(sourceVideo.currentTime - time) < 1 / (VIDEO_FPS * 2)) {
        displayedFrame = targetFrame;
        draw();
        return;
      }
      seeking = true;
      sourceVideo.currentTime = time;
      // Safety net: if the browser never reports this seek as complete, unstick scrubbing anyway.
      clearTimeout(watchdog);
      watchdog = setTimeout(settle, 400);
    };

    const onLoadedMetadata = () => {
      metadataReady = true;
      draw();
      advance();
    };

    if (useCanvas) {
      sourceVideo.addEventListener("seeked", settle);
      // 'loadedmetadata' fires before pixel data is guaranteed; 'loadeddata' is the
      // first point a frame is actually decodable, which is what the canvas needs.
      sourceVideo.addEventListener("loadeddata", draw);
    } else if (sourceVideo.requestVideoFrameCallback) {
      const loop = () => {
        if (disposed) return;
        settle();
        sourceVideo.requestVideoFrameCallback(loop);
      };
      sourceVideo.requestVideoFrameCallback(loop);
    }
    sourceVideo.addEventListener("loadedmetadata", onLoadedMetadata);
    if (sourceVideo.readyState >= 1) onLoadedMetadata();
    if (sourceVideo.readyState >= 2) draw();

    const updatePhaseOverlays = (frame: number) => {
      let activeIndex = -1;
      videoStoryPhases.forEach((phase, i) => {
        const el = phaseRefs.current[i];
        if (!el) return;
        const opacity = captionOpacity(frame, phase.startFrame, phase.endFrame, FADE_FRAMES);
        if (opacity > 0.5) activeIndex = i;
        gsap.set(el, { opacity, y: (1 - opacity) * 14 });
      });
      if (activeIndex !== -1 && activeIndex !== lastActivePhase) {
        lastActivePhase = activeIndex;
        onActivePhase(activeIndex);
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${window.innerHeight * SCROLL_VH}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        targetFrame = Math.round(self.progress * (VIDEO_TOTAL_FRAMES - 1));
        updatePhaseOverlays(targetFrame);
        if (scrollHintRef.current) {
          gsap.set(scrollHintRef.current, { opacity: clamp01(1 - targetFrame / 40) });
        }
        advance();
      },
    });

    return () => {
      disposed = true;
      clearTimeout(watchdog);
      trigger.kill();
      sourceVideo.removeEventListener("seeked", settle);
      sourceVideo.removeEventListener("loadeddata", draw);
      sourceVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [isMobile, onActivePhase]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="bg-ink relative h-screen w-full overflow-hidden"
      aria-label="Vom Hausdach zur fertigen Photovoltaikanlage"
    >
      <video
        ref={videoRef}
        className={cn("absolute inset-0 h-full w-full object-cover", isMobile && "hidden")}
        poster={VIDEO_POSTER}
        muted
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
      />
      {/* display:none would pause frame decoding in most browsers, so this stays laid out but invisible — it's only ever read into the canvas below. */}
      <video
        ref={mobileVideoRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
        muted
        playsInline
        preload="auto"
        aria-hidden
        tabIndex={-1}
      />
      <canvas
        ref={canvasRef}
        width={854}
        height={480}
        className={cn("absolute inset-0 h-full w-full object-cover", !isMobile && "hidden")}
        aria-hidden
      />

      <div className="from-ink/70 to-ink/20 absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 sm:px-8 lg:px-12">
        <div className="relative mx-auto h-40 w-full max-w-[1400px]">
          {videoStoryPhases.map((phase, i) => (
            <div
              key={phase.id}
              ref={(el) => {
                phaseRefs.current[i] = el;
              }}
              className="absolute bottom-0 left-0 max-w-xl opacity-0"
              aria-hidden={i !== 0}
            >
              <span className="text-solar-blue-light mb-4 inline-block text-sm font-medium tracking-wide uppercase">
                {phase.kicker}
              </span>
              <h2 className="balance text-4xl leading-[1.08] font-semibold tracking-tight text-white sm:text-6xl">
                {phase.title}
              </h2>
              <p className="pretty mt-5 max-w-md text-lg leading-relaxed text-gray-300">
                {phase.description}
              </p>
              {i === 0 && (
                <div className="mt-8">
                  <Button href="#kontakt" variant="ghost">
                    Kostenlose Beratung
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        ref={scrollHintRef}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-gray-300"
        aria-hidden
      >
        <span className="text-xs font-medium tracking-wide uppercase">Scrollen</span>
        <span className="h-8 w-px bg-gradient-to-b from-gray-300 to-transparent" />
      </div>
    </section>
  );
}
