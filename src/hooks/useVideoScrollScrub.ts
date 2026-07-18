"use client";

import { type RefObject, useEffect } from "react";
import { ensureGsap, ScrollTrigger } from "@/lib/gsap";
import { captionOpacity } from "@/lib/crossfade";

interface ScrubPhase {
  startFrame: number;
  endFrame: number;
}

interface UseVideoScrollScrubParams {
  sectionRef: RefObject<HTMLElement | null>;
  videoRef: RefObject<HTMLVideoElement | null>;
  mobileVideoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  phaseRefs: RefObject<Array<HTMLElement | null>>;
  videoSrc: string;
  videoSrcMobile: string;
  totalFrames: number;
  fps: number;
  scrollVh: number;
  phases: ScrubPhase[];
  fadeFrames: number;
  onActivePhase: (index: number) => void;
  onFrameUpdate?: (frame: number) => void;
}

/**
 * Pins a section for the length of a video and maps scroll progress directly onto
 * `video.currentTime`. Never calls `.play()` for the visible playback — the video is
 * scrubbed exclusively by the user's scroll position, forwards and backwards alike.
 * Shared by the hero installation story and the electrical-journey section, which both
 * need frame-accurate scroll-scrubbing plus crossfading phase captions.
 */
export function useVideoScrollScrub({
  sectionRef,
  videoRef,
  mobileVideoRef,
  canvasRef,
  phaseRefs,
  videoSrc,
  videoSrcMobile,
  totalFrames,
  fps,
  scrollVh,
  phases,
  fadeFrames,
  onActivePhase,
  onFrameUpdate,
}: UseVideoScrollScrubParams) {
  useEffect(() => {
    const gsap = ensureGsap();
    const section = sectionRef.current;
    if (!section) return;

    // Read the media query directly instead of depending on a reactive isMobile value:
    // that state starts false during SSR and flips true just after mount on real mobile
    // devices, which would otherwise tear down and recreate this trigger. Killing and
    // rebuilding a pin makes the section's height collapse to its natural, unpinned size
    // for an instant — and GSAP measures the *next* pinned section's start position off
    // of that same instant, permanently baking in a start value that's short by this
    // section's entire scroll distance. Reading the query fresh here means the pin is
    // built once, correctly, and never needs to be torn down.
    const isMobileNow = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
    const supportsRVFC =
      typeof HTMLVideoElement !== "undefined" && "requestVideoFrameCallback" in HTMLVideoElement.prototype;
    const useCanvas = isMobileNow || !supportsRVFC;
    const sourceVideo = useCanvas ? mobileVideoRef.current : videoRef.current;
    const canvas = canvasRef.current;
    const ctx2d = useCanvas ? (canvas?.getContext("2d") ?? null) : null;

    if (!sourceVideo) return;

    // Only the element actually driving the scrub gets a `src`, so the browser never
    // fetches both the desktop and mobile renditions at once.
    sourceVideo.src = useCanvas ? videoSrcMobile : videoSrc;

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
      displayedFrame = Math.round(sourceVideo.currentTime * fps);
      draw();
      if (targetFrame !== displayedFrame) advance();
    };

    const advance = () => {
      if (seeking || !metadataReady) return;
      const time = Math.min(sourceVideo.duration || totalFrames / fps, Math.max(0, targetFrame / fps));
      // A no-op seek (target time already current, e.g. sitting at frame 0) never fires
      // a 'seeked' or video-frame callback, which would otherwise leave `seeking` stuck
      // true forever and freeze all future scrubbing.
      if (Math.abs(sourceVideo.currentTime - time) < 1 / (fps * 2)) {
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

    // On many mobile browsers, seeking a video that has never played never actually
    // decodes a paintable frame — drawImage() silently produces nothing, so the canvas
    // stays blank. Priming with a muted play()/pause() the moment metadata is ready
    // forces the decoder to actually start producing frames for later seeks to use.
    let primed = false;
    const primeDecoder = () => {
      if (primed || !useCanvas) return;
      primed = true;
      Promise.resolve(sourceVideo.play())
        .then(() => {
          sourceVideo.pause();
          draw();
        })
        .catch(() => {});
    };

    const onLoadedMetadata = () => {
      metadataReady = true;
      primeDecoder();
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
      phases.forEach((phase, i) => {
        const el = phaseRefs.current[i];
        if (!el) return;
        const opacity = captionOpacity(frame, phase.startFrame, phase.endFrame, fadeFrames, {
          fadeIn: i > 0,
          fadeOut: i < phases.length - 1,
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
      end: () => `+=${window.innerHeight * scrollVh}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        targetFrame = Math.round(self.progress * (totalFrames - 1));
        updatePhaseOverlays(targetFrame);
        onFrameUpdate?.(targetFrame);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onActivePhase]);
}
