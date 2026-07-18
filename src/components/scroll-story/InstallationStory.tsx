"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { captionOpacity, clamp01 } from "@/lib/crossfade";
import { createVideoScrubber } from "@/lib/videoScrubber";
import { Button } from "@/components/ui/Button";
import {
  DIAGRAM_FPS,
  DIAGRAM_POSTER,
  DIAGRAM_SRC,
  DIAGRAM_SRC_MOBILE,
  DIAGRAM_TOTAL_FRAMES,
  TOTAL_SCROLL_VH,
  TOTAL_STORY_FRAMES,
  VIDEO_FPS,
  VIDEO_POSTER,
  VIDEO_SRC,
  VIDEO_SRC_MOBILE,
  VIDEO_TOTAL_FRAMES,
  combinedStoryPhases,
} from "@/data/storyPhases";
import { cn } from "@/lib/cn";

/** Width, in frames, of the crossfade window between two adjacent phase captions. */
const FADE_FRAMES = 26;

interface InstallationStoryProps {
  onActivePhase: (index: number) => void;
}

/**
 * One continuous pinned scroll: the installation story (real drone footage) flows
 * directly into the electrical-journey story (also real footage) with no unpin in
 * between — the two videos are layered in the same section and crossfade at the
 * frame where one ends and the other begins, driven by a single ScrollTrigger.
 */
export function InstallationStory({ onActivePhase }: InstallationStoryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroMobileVideoRef = useRef<HTMLVideoElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);

  const diagramVideoRef = useRef<HTMLVideoElement>(null);
  const diagramMobileVideoRef = useRef<HTMLVideoElement>(null);
  const diagramCanvasRef = useRef<HTMLCanvasElement>(null);
  const diagramLayerRef = useRef<HTMLDivElement>(null);

  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    const heroScrubber = createVideoScrubber({
      videoEl: heroVideoRef.current,
      mobileVideoEl: heroMobileVideoRef.current,
      canvasEl: heroCanvasRef.current,
      videoSrc: VIDEO_SRC,
      videoSrcMobile: VIDEO_SRC_MOBILE,
      totalFrames: VIDEO_TOTAL_FRAMES,
      fps: VIDEO_FPS,
    });
    const diagramScrubber = createVideoScrubber({
      videoEl: diagramVideoRef.current,
      mobileVideoEl: diagramMobileVideoRef.current,
      canvasEl: diagramCanvasRef.current,
      videoSrc: DIAGRAM_SRC,
      videoSrcMobile: DIAGRAM_SRC_MOBILE,
      totalFrames: DIAGRAM_TOTAL_FRAMES,
      fps: DIAGRAM_FPS,
    });
    if (!heroScrubber || !diagramScrubber) return;

    let lastActivePhase = -1;
    const lastPhase = combinedStoryPhases[combinedStoryPhases.length - 1];
    const badgeSpan = Math.max(1, (lastPhase.endFrame - lastPhase.startFrame) * 0.7);

    const updatePhaseOverlays = (globalFrame: number) => {
      let activeIndex = -1;
      combinedStoryPhases.forEach((phase, i) => {
        const el = phaseRefs.current[i];
        if (!el) return;
        const opacity = captionOpacity(globalFrame, phase.startFrame, phase.endFrame, FADE_FRAMES, {
          fadeIn: i > 0,
          fadeOut: i < combinedStoryPhases.length - 1,
        });
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
      end: () => `+=${window.innerHeight * TOTAL_SCROLL_VH}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const globalFrame = Math.round(self.progress * (TOTAL_STORY_FRAMES - 1));
        updatePhaseOverlays(globalFrame);

        if (globalFrame < VIDEO_TOTAL_FRAMES) {
          if (heroLayerRef.current) heroLayerRef.current.style.opacity = "1";
          if (diagramLayerRef.current) diagramLayerRef.current.style.opacity = "0";
          heroScrubber.seekTo(globalFrame);
        } else {
          if (heroLayerRef.current) heroLayerRef.current.style.opacity = "0";
          if (diagramLayerRef.current) diagramLayerRef.current.style.opacity = "1";
          diagramScrubber.seekTo(globalFrame - VIDEO_TOTAL_FRAMES);
        }

        if (scrollHintRef.current) {
          scrollHintRef.current.style.opacity = String(clamp01(1 - globalFrame / 40));
        }
        if (badgeRef.current) {
          const t = clamp01((globalFrame - lastPhase.startFrame) / badgeSpan);
          badgeRef.current.style.opacity = String(t);
          badgeRef.current.style.transform = `translateY(${(1 - t) * 20}px)`;
        }
      },
    });

    return () => {
      trigger.kill();
      heroScrubber.dispose();
      diagramScrubber.dispose();
    };
  }, [onActivePhase]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="bg-ink relative h-screen w-full overflow-hidden"
      aria-label="Vom Hausdach bis zur vollständigen Energieversorgung"
    >
      <div ref={heroLayerRef} className="absolute inset-0">
        <video
          ref={heroVideoRef}
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
          ref={heroMobileVideoRef}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />
        <canvas
          ref={heroCanvasRef}
          width={854}
          height={480}
          className={cn("absolute inset-0 h-full w-full object-cover", !isMobile && "hidden")}
          aria-hidden
        />
      </div>

      <div ref={diagramLayerRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <video
          ref={diagramVideoRef}
          className={cn("absolute inset-0 h-full w-full object-cover", isMobile && "hidden")}
          poster={DIAGRAM_POSTER}
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />
        <video
          ref={diagramMobileVideoRef}
          className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
          muted
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
        />
        <canvas
          ref={diagramCanvasRef}
          width={854}
          height={480}
          className={cn("absolute inset-0 h-full w-full object-cover", !isMobile && "hidden")}
          aria-hidden
        />
      </div>

      <div className="from-ink/70 to-ink/20 absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 sm:px-8 lg:px-12">
        <div className="relative mx-auto h-40 w-full max-w-[1400px]">
          {combinedStoryPhases.map((phase, i) => (
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

      <div
        ref={badgeRef}
        className="absolute inset-x-0 bottom-16 z-10 flex flex-col items-center gap-6 px-6 opacity-0"
      >
        <Button href="#kontakt" variant="primary">
          Jetzt unverbindlich planen lassen
        </Button>
      </div>
    </section>
  );
}
