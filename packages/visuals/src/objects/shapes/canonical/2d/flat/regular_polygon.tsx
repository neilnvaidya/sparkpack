import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { RegularPolygonParams } from '../../../params';

function resolveRadius(params: RegularPolygonParams): number {
  if (params.radius != null) return params.radius;
  if (params.sideLength != null) return params.sideLength / (2 * Math.sin(Math.PI / params.n));
  return 1;
}

function vertices(n: number, r: number): [number, number][] {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    pts.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }
  return pts;
}

export function renderRegularPolygon(params: RegularPolygonParams, options: ShapeRenderOptions): ReactNode {
  const r = resolveRadius(params);
  const n = params.n;
  const filled = options.filled === true;
  const pts = vertices(n, r);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ') + ' Z';

  const dim = 2 * r;
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const bottomIdx = pts.reduce((bi, p, i) => (p[1] > pts[bi][1] ? i : bi), 0);
  const nextIdx = (bottomIdx + 1) % n;
  const eMidX = (pts[bottomIdx][0] + pts[nextIdx][0]) / 2;
  const eMidY = (pts[bottomIdx][1] + pts[nextIdx][1]) / 2;

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line x1={0} y1={0} x2={eMidX} y2={eMidY} stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN} />
      <text x={eMidX} y={eMidY + pad + fs * 0.7} {...lp}>s</text>
      <text x={eMidX / 2 + pad} y={eMidY / 2 + fs * 0.35} {...lp} textAnchor="start">a</text>
    </g>
  );
}

export function getRegularPolygonBbox(params: RegularPolygonParams): BBox {
  const r = resolveRadius(params);
  const pts = vertices(params.n, r);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
