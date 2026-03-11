/**
 * Isometric projection: map 3D world (x, y, z) to 2D screen (sx, sy).
 * Convention: x right, y depth (into screen), z up. Isometric angle 20°.
 * A square in the xy plane (z=0) projects to a rhombus on screen.
 */

const ANGLE_DEG = 20;
const COS = Math.cos((ANGLE_DEG * Math.PI) / 180);
const SIN = Math.sin((ANGLE_DEG * Math.PI) / 180);

/** Cosine of the isometric angle — re-exported for bounding-box calculations. */
export const ISO_COS = COS;
/** Sine of the isometric angle — re-exported for bounding-box calculations. */
export const ISO_SIN = SIN;

/**
 * Project a point from flat/world space (x, y, z) to isometric screen coordinates (sx, sy).
 * - x, y: horizontal plane (e.g. square in the "ground" has z=0)
 * - z: vertical (up)
 * Result: sx increases rightward, sy increases downward on screen.
 */
export function projectIsometric(x: number, y: number, z: number): { sx: number; sy: number } {
  return {
    sx: (x -y) * COS,
    sy: -z + (x + y) * SIN,
  };
}

/**
 * Project multiple points and return an SVG path "d" string (M and L commands, no Z).
 * Points are (x, y, z) tuples. Caller can append Z to close.
 */
export function projectPathIsometric(points: [number, number, number][]): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points.map(([x, y, z]) => projectIsometric(x, y, z));
  let d = `M ${first.sx} ${first.sy}`;
  for (const p of rest) {
    d += ` L ${p.sx} ${p.sy}`;
  }
  return d;
}
