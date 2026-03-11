/**
 * Shared palette and oblique projection helpers for object drawings.
 * Override via CSS custom properties: --sp-stroke, --sp-fill-0, --sp-fill-1, --sp-fill-2.
 */
export const ST = 'var(--sp-stroke,  #1f2937)';   // outline
export const F0 = 'var(--sp-fill-0,  #f9fafb)';   // lightest — front face, highlights
/** Fill for math shapes when filled=true. Visible on white; override via --sp-shape-fill. */
export const F_SHAPE = 'var(--sp-shape-fill, #e5e7eb)';
export const F1 = 'var(--sp-fill-1,  #d1d5db)';   // mid      — top face, label bands
export const F2 = 'var(--sp-fill-2,  #9ca3af)';   // dark     — side face, shadows
/** Fill for "liquid" / fill-to-height (e.g. cylinder, prism). Override via --sp-fill-liquid. */
export const F_LIQUID = 'var(--sp-fill-liquid, #93c5fd)';
export const SW = 1.5;                             // stroke-width (object drawings)
/** Thinner stroke for math shapes (outlines). Override via --sp-shape-stroke-width. */
export const SW_SHAPE = 'var(--sp-shape-stroke-width, 0.02)';

/** Oblique projection: offset for 3D box family. Light source upper-left. */
export const OX = 7;
export const OY = -5;

/** Painter-order: side → top → front so nearer faces cover farther. */
export const mkFront = (hw: number, hh: number) =>
  `M${-hw},${hh} L${-hw},${-hh} L${hw},${-hh} L${hw},${hh} Z`;

export const mkTop = (hw: number, hh: number) =>
  `M${-hw},${-hh} L${hw},${-hh} L${hw + OX},${-hh + OY} L${-hw + OX},${-hh + OY} Z`;

export const mkSide = (hw: number, hh: number) =>
  `M${hw},${-hh} L${hw},${hh} L${hw + OX},${hh + OY} L${hw + OX},${-hh + OY} Z`;

/** Centre a box drawn with oblique offset so it doesn't drift upper-right. */
export const centreBox = (hw: number, hh: number) =>
  `translate(${-(OX / 2)}, ${-(OY / 2)})`;
