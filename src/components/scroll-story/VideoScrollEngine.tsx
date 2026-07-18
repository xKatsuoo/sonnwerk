"use client";

import { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useVideoScrollScrub } from "@/hooks/useVideoScrollScrub";
import { Button } from "@/components/ui/Button";
import {
  VIDEO_FPS,
  VIDEO_POSTER,
  VIDEO_SCROLL_VH,
  VIDEO_SRC,
  VIDEO_SRC_MOBILE,
  VIDEO_TOTAL_FRAMES,
  videoStoryPhases,
} from "@/data/storyPhases";
import { clamp01 } from "@/lib/crossfade";
import { cn } from "@/lib/cn";

/** Width, in frames, of the crossfade window between two adjacent phase captions. */
const FADE_FRAMES = 26;

interface VideoScrollEngineProps {
  onActivePhase: (index: number) => void;
}

/**
 * Pins the hero section for the length of the installation video. See
 * useVideoScrollScrub for how scroll position maps onto the video frame.
 */
export function VideoScrollEngine({ onActivePhase }: VideoScrollEngineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useVideoScrollScrub({
    sectionRef,
    videoRef,
    mobileVideoRef,
    canvasRef,
    phaseRefs,
    videoSrc: VIDEO_SRC,
    videoSrcMobile: VIDEO_SRC_MOBILE,
    totalFrames: VIDEO_TOTAL_FRAMES,
    fps: VIDEO_FPS,
    scrollVh: VIDEO_SCROLL_VH,
    phases: videoStoryPhases,
    fadeFrames: FADE_FRAMES,
    onActivePhase,
    onFrameUpdate: (frame) => {
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(clamp01(1 - frame / 40));
      }
    },
  });

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
