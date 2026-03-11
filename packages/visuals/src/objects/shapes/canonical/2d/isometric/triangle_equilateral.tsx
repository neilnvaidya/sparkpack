import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { TriangleEquilateralParams } from '../../../params';

const SQRT3 = Math.sqrt(3);

function resolveSide(params: TriangleEquilateralParams): number {
  if (params.side != null) return params.side;
  if (params.radius != null) return params.radius * SQRT3;
  return 1;
}

/**
 * Equilateral triangle in the xy-plane (z=0), projected isometrically.
 * World-space vertices: centroid at origin, base along the x-axis.
 */
export function renderTriangleEquilateralIsometric(params: TriangleEquilateralParams, options: ShapeRenderOptions): ReactNode {
  const s = resolveSide(params);
  const h = (s * SQRT3) / 2;
  const filled = options.filled === true;
  const cy = h / 3;
  const points: [number, number, number][] = [
    [-s / 2, cy, 0],
    [s / 2, cy, 0],
    [0, cy - h, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';
  const baseMid = projectIsometric(0, cy, 0);
  const apex = projectIsometric(0, cy - h, 0);
  const heightLine = `M ${baseMid.sx} ${baseMid.sy} L ${apex.sx} ${apex.sy}`;
  const fs = s * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  const hMidX = (baseMid.sx + apex.sx) / 2;
  const hMidY = (baseMid.sy + apex.sy) / 2;
  return (
    <g>
      <path
        d={d}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <path d={heightLine} fill="none" stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN} />
      <text x={baseMid.sx} y={baseMid.sy + pad + fs * 0.7} {...lp}>b</text>
      <text x={hMidX + pad} y={hMidY + fs * 0.35} {...lp} textAnchor="start">h</text>
    </g>
  );
}

export function getTriangleEquilateralIsometricBbox(params: TriangleEquilateralParams): BBox {
  const s = resolveSide(params);
  const h = (s * SQRT3) / 2;
  const cy = h / 3;
  const pts: [number, number, number][] = [
    [-s / 2, cy, 0],
    [s / 2, cy, 0],
    [0, cy - h, 0],
  ];
  const projected = pts.map(([x, y, z]) => projectIsometric(x, y, z));
  const xs = projected.map((p) => p.sx);
  const ys = projected.map((p) => p.sy);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
