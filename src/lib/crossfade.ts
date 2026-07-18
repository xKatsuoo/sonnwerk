export function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

/** Opacity for a caption that should crossfade in over [start-margin, start] and out over [end, end+margin]. */
export function captionOpacity(value: number, start: number, end: number, margin: number): number {
  if (value < start - margin || value > end + margin) return 0;
  if (value < start) return clamp01((value - (start - margin)) / margin);
  if (value > end) return clamp01(1 - (value - end) / margin);
  return 1;
}
