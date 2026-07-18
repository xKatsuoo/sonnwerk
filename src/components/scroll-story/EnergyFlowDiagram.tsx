"use client";

import { useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useVideoScrollScrub } from "@/hooks/useVideoScrollScrub";
import { Button } from "@/components/ui/Button";
import {
  DIAGRAM_FPS,
  DIAGRAM_POSTER,
  DIAGRAM_SCROLL_VH,
  DIAGRAM_SRC,
  DIAGRAM_SRC_MOBILE,
  DIAGRAM_TOTAL_FRAMES,
  diagramStoryPhases,
} from "@/data/storyPhases";
import { clamp01 } from "@/lib/crossfade";
import { cn } from "@/lib/cn";

/** Width, in frames, of the crossfade window between two adjacent phase captions. */
const FADE_FRAMES = 26;

interface EnergyFlowDiagramProps {
  onActivePhase: (index: number) => void;
}

/**
 * The second half of the pinned story: the electrical journey from panel to storage to
 * house, scroll-scrubbed exactly like the hero video above it. See useVideoScrollScrub.
 */
export function EnergyFlowDiagram({ onActivePhase }: EnergyFlowDiagramProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const lastPhase = diagramStoryPhases[diagramStoryPhases.length - 1];
  const badgeSpan = Math.max(1, (lastPhase.endFrame - lastPhase.startFrame) * 0.7);

  useVideoScrollScrub({
    sectionRef,
    videoRef,
    mobileVideoRef,
    canvasRef,
    phaseRefs,
    videoSrc: DIAGRAM_SRC,
    videoSrcMobile: DIAGRAM_SRC_MOBILE,
    totalFrames: DIAGRAM_TOTAL_FRAMES,
    fps: DIAGRAM_FPS,
    scrollVh: DIAGRAM_SCROLL_VH,
    phases: diagramStoryPhases,
    fadeFrames: FADE_FRAMES,
    onActivePhase,
    onFrameUpdate: (frame) => {
      if (badgeRef.current) {
        const t = clamp01((frame - lastPhase.startFrame) / badgeSpan);
        badgeRef.current.style.opacity = String(t);
        badgeRef.current.style.transform = `translateY(${(1 - t) * 20}px)`;
      }
    },
  });

  return (
    <section
      ref={sectionRef}
      className="bg-anthracite relative h-screen w-full overflow-hidden"
      aria-label="Wie die Solarenergie durch Ihr Zuhause fließt"
    >
      <video
        ref={videoRef}
        className={cn("absolute inset-0 h-full w-full object-cover", isMobile && "hidden")}
        poster={DIAGRAM_POSTER}
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

      <div className="from-anthracite/80 to-anthracite/20 absolute inset-0 bg-gradient-to-t via-transparent" />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-28 sm:px-8 lg:px-12">
        <div className="relative mx-auto h-40 w-full max-w-[1400px]">
          {diagramStoryPhases.map((phase, i) => (
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
            </div>
          ))}
        </div>
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
