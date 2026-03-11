import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { RegularPolygonParams } from '../../../params';

function resolveRadius(params: RegularPolygonParams): number {
  if (params.radius != null) return params.radius;
  if (params.sideLength != null) return params.sideLength / (2 * Math.sin(Math.PI / params.n));
  return 1;
}

function vertices3d(n: number, r: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    pts.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }
  return pts;
}

export function renderRegularPolygonIsometric(params: RegularPolygonParams, options: ShapeRenderOptions): ReactNode {
  const r = resolveRadius(params);
  const n = params.n;
  const filled = options.filled === true;
  const pts = vertices3d(n, r);
  const d = projectPathIsometric(pts) + ' Z';

  const dim = 2 * r;
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const projected = pts.map(([x, y, z]) => projectIsometric(x, y, z));
  const bottomIdx = projected.reduce((bi, p, i) => (p.sy > projected[bi].sy ? i : bi), 0);
  const nextIdx = (bottomIdx + 1) % n;
  const eMidX = (projected[bottomIdx].sx + projected[nextIdx].sx) / 2;
  const eMidY = (projected[bottomIdx].sy + projected[nextIdx].sy) / 2;

  const edgeMid3d: [number, number, number] = [
    (pts[bottomIdx][0] + pts[nextIdx][0]) / 2,
    (pts[bottomIdx][1] + pts[nextIdx][1]) / 2,
    0,
  ];
  const center = projectIsometric(0, 0, 0);
  const eMidProj = projectIsometric(...edgeMid3d);

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line x1={center.sx} y1={center.sy} x2={eMidProj.sx} y2={eMidProj.sy} stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN} />
      <text x={eMidX} y={eMidY + pad + fs * 0.7} {...lp}>s</text>
      <text
        x={(center.sx + eMidProj.sx) / 2 + pad}
        y={(center.sy + eMidProj.sy) / 2 + fs * 0.35}
        {...lp}
        textAnchor="start"
      >a</text>
    </g>
  );
}

export function getRegularPolygonIsometricBbox(params: RegularPolygonParams): BBox {
  const r = resolveRadius(params);
  const pts = vertices3d(params.n, r);
  const projected = pts.map(([x, y, z]) => projectIsometric(x, y, z));
  const xs = projected.map((p) => p.sx);
  const ys = projected.map((p) => p.sy);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
