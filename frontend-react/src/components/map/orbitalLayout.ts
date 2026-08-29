import type { Result } from '../../api/types';

export interface NodeLayout {
  result: Result;
  x: number;
  y: number;
  size: number;
  angleDeg: number;
  dist: number;
  showName: boolean;
  nameFontSize: number;
  scoreFontSize: number;
}

const SPACING = 1.35;
const MIN_RADIUS = 170;
// Wedge reserved at the top so no bubble sits under the ruler label.
const EXCLUDE_HALF = 0.6;

/**
 * Ported from frontend/frontend/map.html's renderMap() (lines ~594-675).
 * Rescaled for confidenceTotal in [1,5] instead of the old relevance_score
 * in [0,100]: `size = (65 + score*0.6) * sizeScale` becomes
 * `size = (65 + confidenceTotal*12) * sizeScale` (×12 instead of ×0.6,
 * i.e. score/5 mapped onto the same 0-100 range before applying ×0.6).
 * Pure function — no DOM access — so it's testable in isolation.
 */
export function computeOrbitalLayout(results: Result[], cx: number, cy: number): NodeLayout[] {
  const n = results.length;
  if (n === 0) return [];

  const sizeScale = n <= 6 ? 1 : Math.max(0.75, 6 / n);
  let sizes = results.map((r) => (65 + r.confidenceTotal * 12) * sizeScale);

  const totalDiameter = sizes.reduce((a, b) => a + b, 0);
  let radius = Math.max(MIN_RADIUS, (totalDiameter * SPACING) / (2 * Math.PI));
  const maxRadius = Math.min(cx, cy) * 0.78;
  if (radius > maxRadius) {
    const shrink = maxRadius / radius;
    sizes = sizes.map((s) => s * shrink);
    radius = maxRadius;
  }

  const startAngle = -Math.PI / 2 + EXCLUDE_HALF;
  const totalArc = 2 * Math.PI - 2 * EXCLUDE_HALF;

  return results.map((r, i) => {
    const angle = startAngle + ((i + 0.5) / n) * totalArc;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    const size = sizes[i];
    const showName = size >= 46;
    const nameFontSize = showName
      ? Math.max(7, Math.min(12, (size * 0.85) / Math.max(6, r.name.length * 0.42)))
      : 0;
    const scoreFontSize = showName ? Math.max(8, nameFontSize * 0.85) : Math.max(9, size * 0.22);

    return {
      result: r,
      x,
      y,
      size,
      angleDeg: Math.atan2(y, x) * (180 / Math.PI),
      dist: Math.sqrt(x * x + y * y),
      showName,
      nameFontSize,
      scoreFontSize,
    };
  });
}
