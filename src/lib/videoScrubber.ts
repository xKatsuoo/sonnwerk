export interface VideoScrubberConfig {
  videoEl: HTMLVideoElement | null;
  mobileVideoEl: HTMLVideoElement | null;
  canvasEl: HTMLCanvasElement | null;
  videoSrc: string;
  videoSrcMobile: string;
  totalFrames: number;
  fps: number;
}

/**
 * Common interface for both the frame-accurate scrubber and its lightweight fallback
 * (see createLightweightPlayer), so a shared scroll-driven trigger can call either
 * uniformly without caring which one a given device ended up with.
 */
export interface StoryVideoEngine {
  /** Scrub to an exact frame, forwards or backwards. Safe to call every scroll tick. */
  seekTo(frame: number): void;
  /** Whether this video is the one currently in view. Drives the lightweight player's
   * play/pause; a no-op for the frame-accurate scrubber. */
  setActive(active: boolean): void;
  dispose(): void;
}

export type VideoScrubber = StoryVideoEngine;

/**
 * Wires up one video (or its canvas fallback) for frame-accurate scroll-scrubbing.
 * Never calls `.play()` for visible playback — the video is scrubbed exclusively by
 * whatever frame numbers `seekTo` is called with. Framework-agnostic (no ScrollTrigger,
 * no React) so a single scroll-driven trigger can own several of these at once, e.g. one
 * per video in a multi-video continuous scroll story.
 */
export function createVideoScrubber({
  videoEl,
  mobileVideoEl,
  canvasEl,
  videoSrc,
  videoSrcMobile,
  totalFrames,
  fps,
}: VideoScrubberConfig): StoryVideoEngine | null {
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
  const sourceVideo = useCanvas ? mobileVideoEl : videoEl;
  const ctx2d = useCanvas ? (canvasEl?.getContext("2d") ?? null) : null;

  if (!sourceVideo) return null;

  // Only the element actually driving the scrub gets a `src`, so the browser never
  // fetches both the desktop and mobile renditions at once.
  sourceVideo.src = useCanvas ? videoSrcMobile : videoSrc;

  let metadataReady = sourceVideo.readyState >= 1;
  let seeking = false;
  let displayedFrame = -1;
  let targetFrame = 0;
  let disposed = false;
  let watchdog: ReturnType<typeof setTimeout> | undefined;

  const draw = () => {
    if (useCanvas && canvasEl && ctx2d) {
      ctx2d.drawImage(sourceVideo, 0, 0, canvasEl.width, canvasEl.height);
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

  return {
    seekTo(frame: number) {
      targetFrame = frame;
      advance();
    },
    setActive() {
      // Visibility is opacity-driven for the scrubbed layers; every frame is seeked
      // regardless of which one is currently on top, so there's nothing to do here.
    },
    dispose() {
      disposed = true;
      clearTimeout(watchdog);
      sourceVideo.removeEventListener("seeked", settle);
      sourceVideo.removeEventListener("loadeddata", draw);
      sourceVideo.removeEventListener("loadedmetadata", onLoadedMetadata);
    },
  };
}

export interface LightweightPlayerConfig {
  videoEl: HTMLVideoElement | null;
  /** Always the smaller/mobile rendition — the point of this path is to be cheap. */
  src: string;
}

/**
 * The fallback for devices where frame-accurate seeking is too heavy (see
 * prefersLightweightVideo): the video just plays forward on a loop, which every
 * browser's video pipeline handles far more cheaply than repeated fresh seeks.
 * `seekTo` is a no-op — captions stay in sync with scroll on their own; only which
 * video is currently playing needs to track scroll position, via `setActive`.
 */
export function createLightweightPlayer({ videoEl, src }: LightweightPlayerConfig): StoryVideoEngine | null {
  if (!videoEl) return null;

  videoEl.src = src;
  videoEl.loop = true;
  let disposed = false;
  let active = false;

  return {
    seekTo() {
      // Intentionally a no-op — see doc comment above.
    },
    setActive(next: boolean) {
      if (disposed || next === active) return;
      active = next;
      if (active) {
        Promise.resolve(videoEl.play()).catch(() => {});
      } else {
        videoEl.pause();
      }
    },
    dispose() {
      disposed = true;
      videoEl.pause();
    },
  };
}
