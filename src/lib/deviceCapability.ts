/**
 * Frame-accurate scroll-scrubbing seeks a fresh video frame on every scroll tick, which
 * is only smooth on hardware that can decode 1080p on demand fast enough. Two classes of
 * device can't keep up:
 *  - Old, low-core-count machines (e.g. a 2013 MacBook Air) that are simply too slow to
 *    decode that often.
 *  - iOS/iPadOS Safari, which has long-standing jank seeking video rapidly regardless of
 *    chip generation — even a recent, otherwise-fast iPad struggles with it.
 * Both fall back to a much cheaper experience: the video just plays normally on a loop
 * (no seeking) while captions keep crossfading on scroll, since continuous playback is
 * something every browser's video pipeline is heavily optimized for, unlike rapid seeks.
 */
export function prefersLightweightVideo(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const lowCoreCount = (navigator.hardwareConcurrency ?? 8) <= 4;
  return isIOS || lowCoreCount;
}
