import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { TriangleIsoscelesParams } from '../../../params';

function resolveHeight(params: TriangleIsoscelesParams): number {
  if (params.height != null) return params.height;
  if (params.legLength != null) {
    return Math.sqrt(params.legLength ** 2 - (params.base / 2) ** 2);
  }
  if (params.apexAngleDeg != null) {
    const halfApex = (params.apexAngleDeg / 2) * (Math.PI / 180);
    return (params.base / 2) / Math.tan(halfApex);
  }
  return params.base;
}

/**
 * Isosceles triangle, centroid at origin, base horizontal at bottom.
 * Defined by base and height; two equal legs, apex centered above the base.
 */
export function renderTriangleIsosceles(params: TriangleIsoscelesParams, options: ShapeRenderOptions): ReactNode {
  const b = params.base;
  const h = resolveHeight(params);
  const filled = options.filled === true;
  const cy = h / 3;
  const d = `M ${-b / 2} ${cy} L ${b / 2} ${cy} L 0 ${cy - h} Z`;
  const dim = Math.max(b, h);
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
      <line x1={0} y1={cy} x2={0} y2={cy - h} stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN} />
      <text x={0} y={cy + pad + fs * 0.7} {...lp}>b</text>
      <text x={pad} y={fs * 0.35} {...lp} textAnchor="start">h</text>
    </g>
  );
}

export function getTriangleIsoscelesBbox(params: TriangleIsoscelesParams): BBox {
  const h = resolveHeight(params);
  return { width: params.base, height: h };
}
