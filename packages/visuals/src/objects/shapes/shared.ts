/**
 * Shared style constants for math shapes (wireframe / isometric).
 * Separate from drawings/shared.ts which is for object illustrations.
 * Override via CSS custom properties.
 */

/** Stroke colour. */
export const ST = 'var(--sp-stroke, #1f2937)';

/** Stroke width for shape outlines. */
export const SW = 'var(--sp-shape-stroke-width, 0.05)';

/** Light fill for 2D shapes (e.g. square filled). */
export const F_SHAPE = 'var(--sp-shape-fill, #e5e7eb)';

/** Fill for liquid / fill-to-height regions (e.g. cylinder, cuboid). */
export const F_LIQUID = 'var(--sp-fill-liquid, #93c5fd)';

/** Dotted stroke dasharray for hidden edges. */
export const DASH_HIDDEN = '0.1,0.2';

/** Flat-shading palette for container mode (outside faces). */
export const F_FACE_FRONT = 'var(--sp-face-front, #d1d5db)';
export const F_FACE_SIDE = 'var(--sp-face-side, #9ca3af)';
/** Flat-shading palette for container mode (inside faces). */
export const F_FACE_INSIDE = 'var(--sp-face-inside, #e5e7eb)';
export const F_FACE_BASE = 'var(--sp-face-base, #f3f4f6)';

/** Font size as fraction of max dimension — 2D shapes. */
export const LBL_FS_2D = 0.13;

/** Font size as fraction of max dimension — 3D shapes. */
export const LBL_FS_3D = 0.20;

/** Padding as fraction of font size (gap between edge and text). */
export const LBL_PAD = 0.4;

/** Common SVG props for shape labels. */
export function labelProps(fs: number) {
  return { fill: ST, fontSize: fs, fontStyle: 'italic' as const, textAnchor: 'middle' as const } as const;
}
