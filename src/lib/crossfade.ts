export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/**
 * Opacity for a caption that crossfades in over [start-margin/2, start+margin/2] and out
 * over [end-margin/2, end+margin/2]. Centering each ramp on the boundary (rather than
 * bleeding the full margin outward past start/end) keeps it from overlapping the
 * neighboring phase's plateau, so two adjacent captions never sit at full opacity at once.
 *
 * Pass `fadeIn: false` for the first phase in a sequence and `fadeOut: false` for the
 * last one — there's no neighbor to crossfade with at either end, so without this the
 * first caption would load at 50% opacity (it starts exactly at its own fade-in
 * midpoint) until the user scrolls it the rest of the way in.
 */
export function captionOpacity(
  value: number,
  start: number,
  end: number,
  margin: number,
  { fadeIn = true, fadeOut = true }: { fadeIn?: boolean; fadeOut?: boolean } = {},
): number {
  const half = margin / 2;
  if (fadeIn) {
    if (value <= start - half) return 0;
    if (value < start + half) return clamp01((value - (start - half)) / margin);
  }
  if (fadeOut) {
    if (value >= end + half) return 0;
    if (value > end - half) return clamp01(1 - (value - (end - half)) / margin);
  }
  return 1;
}
