import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { TriangleRightParams } from '../../../params';

function resolveLegs(params: TriangleRightParams): { a: number; b: number } {
  if (params.legA != null && params.legB != null) return { a: params.legA, b: params.legB };
  if (params.base != null && params.height != null) return { a: params.base, b: params.height };
  if (params.oneAngleDeg != null && params.base != null) {
    const rad = (params.oneAngleDeg * Math.PI) / 180;
    return { a: params.base, b: params.base * Math.tan(rad) };
  }
  if (params.oneAngleDeg != null && params.height != null) {
    const rad = (params.oneAngleDeg * Math.PI) / 180;
    return { a: params.height / Math.tan(rad), b: params.height };
  }
  const fallback = params.base ?? params.legA ?? params.height ?? params.legB ?? 1;
  return { a: fallback, b: fallback };
}

/**
 * Right-angle triangle, centroid at origin.
 * Right angle at bottom-left; base (leg a) along the bottom, height (leg b) along the left.
 */
export function renderTriangleRight(params: TriangleRightParams, options: ShapeRenderOptions): ReactNode {
  const { a, b } = resolveLegs(params);
  const filled = options.filled === true;
  const cx = a / 3;
  const cy = b / 3;
  const d = `M ${-cx} ${cy} L ${a - cx} ${cy} L ${-cx} ${cy - b} Z`;
  const dim = Math.max(a, b);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <path
        d={d}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <text x={a / 2 - cx} y={cy + pad + fs * 0.7} {...lp}>b</text>
      <text x={-cx - pad} y={fs * 0.35} {...lp} textAnchor="end">h</text>
    </g>
  );
}

export function getTriangleRightBbox(params: TriangleRightParams): BBox {
  const { a, b } = resolveLegs(params);
  return { width: a, height: b };
}
