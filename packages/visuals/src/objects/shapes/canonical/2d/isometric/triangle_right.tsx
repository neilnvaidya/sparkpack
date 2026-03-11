import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric } from '../../isometric';
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
 * Right-angle triangle in the xy-plane (z=0), projected isometrically.
 * World-space: centroid at origin, right angle at bottom-left.
 */
export function renderTriangleRightIsometric(params: TriangleRightParams, options: ShapeRenderOptions): ReactNode {
  const { a, b } = resolveLegs(params);
  const filled = options.filled === true;
  const cx = a / 3;
  const cy = b / 3;
  const points: [number, number, number][] = [
    [-cx, cy, 0],
    [a - cx, cy, 0],
    [-cx, cy - b, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';
  const baseLeft = projectIsometric(-cx, cy, 0);
  const baseRight = projectIsometric(a - cx, cy, 0);
  const top = projectIsometric(-cx, cy - b, 0);
  const bMidX = (baseLeft.sx + baseRight.sx) / 2;
  const bMidY = (baseLeft.sy + baseRight.sy) / 2;
  const hMidX = (baseLeft.sx + top.sx) / 2;
  const hMidY = (baseLeft.sy + top.sy) / 2;
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
      <text x={bMidX} y={bMidY + pad + fs * 0.7} {...lp}>b</text>
      <text x={hMidX - pad} y={hMidY + fs * 0.35} {...lp} textAnchor="end">h</text>
    </g>
  );
}

export function getTriangleRightIsometricBbox(params: TriangleRightParams): BBox {
  const { a, b } = resolveLegs(params);
  const cx = a / 3;
  const cy = b / 3;
  const pts: [number, number, number][] = [
    [-cx, cy, 0],
    [a - cx, cy, 0],
    [-cx, cy - b, 0],
  ];
  const projected = pts.map(([x, y, z]) => projectIsometric(x, y, z));
  const xs = projected.map((p) => p.sx);
  const ys = projected.map((p) => p.sy);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
