import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { TriangleEquilateralParams } from '../../../params';

const SQRT3 = Math.sqrt(3);

function resolveSide(params: TriangleEquilateralParams): number {
  if (params.side != null) return params.side;
  if (params.radius != null) return params.radius * SQRT3;
  return 1;
}

/**
 * Equilateral triangle, centroid at origin, base horizontal at bottom.
 * Vertices: bottom-left, bottom-right, top-center.
 */
export function renderTriangleEquilateral(params: TriangleEquilateralParams, options: ShapeRenderOptions): ReactNode {
  const s = resolveSide(params);
  const h = (s * SQRT3) / 2;
  const filled = options.filled === true;
  const cy = h / 3;
  const d = `M ${-s / 2} ${cy} L ${s / 2} ${cy} L 0 ${cy - h} Z`;
  const fs = s * LBL_FS_2D;
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

export function getTriangleEquilateralBbox(params: TriangleEquilateralParams): BBox {
  const s = resolveSide(params);
  const h = (s * SQRT3) / 2;
  return { width: s, height: h };
}
