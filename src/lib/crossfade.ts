export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/**
 * Opacity for a caption that crossfades in over [start-margin/2, start+margin/2] and out
 * over [end-margin/2, end+margin/2]. Centering each ramp on the boundary (rather than
 * bleeding the full margin outward past start/end) keeps it from overlapping the
 * neighboring phase's plateau, so two adjacent captions never sit at full opacity at once.
 */
export function captionOpacity(value: number, start: number, end: number, margin: number): number {
  const half = margin / 2;
  if (value <= start - half || value >= end + half) return 0;
  if (value < start + half) return clamp01((value - (start - half)) / margin);
  if (value <= end - half) return 1;
  return clamp01(1 - (value - (end - half)) / margin);
}
