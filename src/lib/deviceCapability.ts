/**
 * Frame-accurate scroll-scrubbing seeks a fresh video frame on every scroll tick, which
 * needs hardware fast enough to decode 1080p on demand. Two classes of device can't keep
 * up:
 *  - Old, low-core-count machines (e.g. a 2013 MacBook Air) that are simply too slow to
 *    decode that often.
 *  - iOS/iPadOS Safari, which has long-standing jank seeking video rapidly regardless of
 *    chip generation — even a recent, otherwise-fast iPad struggles with it.
 * Both get the exact same scroll-scrubbing behavior, just fed the lighter 720p rendition
 * instead of 1080p, which is cheap enough for them to decode on every seek.
 */
export function prefersReducedVideoQuality(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  const lowCoreCount = (navigator.hardwareConcurrency ?? 8) <= 4;
  return isIOS || lowCoreCount;
}
