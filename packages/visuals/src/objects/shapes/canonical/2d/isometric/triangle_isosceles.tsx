import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric } from '../../isometric';
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
 * Isosceles triangle in the xy-plane (z=0), projected isometrically.
 * World-space: centroid at origin, base along x-axis.
 */
export function renderTriangleIsoscelesIsometric(params: TriangleIsoscelesParams, options: ShapeRenderOptions): ReactNode {
  const b = params.base;
  const h = resolveHeight(params);
  const filled = options.filled === true;
  const cy = h / 3;
  const points: [number, number, number][] = [
    [-b / 2, cy, 0],
    [b / 2, cy, 0],
    [0, cy - h, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';
  const baseMid = projectIsometric(0, cy, 0);
  const apex = projectIsometric(0, cy - h, 0);
  const heightLine = `M ${baseMid.sx} ${baseMid.sy} L ${apex.sx} ${apex.sy}`;
  const dim = Math.max(b, h);
  const fs = dim * LBL_FS_2D;
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

export function getTriangleIsoscelesIsometricBbox(params: TriangleIsoscelesParams): BBox {
  const b = params.base;
  const h = resolveHeight(params);
  const cy = h / 3;
  const pts: [number, number, number][] = [
    [-b / 2, cy, 0],
    [b / 2, cy, 0],
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
