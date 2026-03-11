import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { RegularPrismParams } from '../../params';

function resolveRadius(params: RegularPrismParams): number {
  if (params.radius != null) return params.radius;
  if (params.sideLength != null) return params.sideLength / (2 * Math.sin(Math.PI / params.n));
  return 1;
}

function baseVertices(n: number, r: number): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    pts.push([r * Math.cos(angle), r * Math.sin(angle), 0]);
  }
  return pts;
}

/**
 * A vertical prism face is visible when its outward normal (in the xy-plane)
 * dotted with the isometric view direction (1,1,1) is positive.
 * For a regular polygon centered at origin, the outward normal of edge i→i+1
 * points in the direction of the midpoint of that edge.
 */
function isFaceVisible(v1: [number, number, number], v2: [number, number, number]): boolean {
  const mx = (v1[0] + v2[0]) / 2;
  const my = (v1[1] + v2[1]) / 2;
  return (mx + my) > 0;
}

export function renderRegularPrism(params: RegularPrismParams, options: ShapeRenderOptions): ReactNode {
  const n = params.n;
  const r = resolveRadius(params);
  const h = params.height;
  const base = baseVertices(n, r);
  const top = base.map(([x, y]) => [x, y, h] as [number, number, number]);
  const wire = options.wireframe !== false;
  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  const faceVis: boolean[] = [];
  for (let i = 0; i < n; i++) {
    faceVis.push(isFaceVisible(base[i], base[(i + 1) % n]));
  }

  const fills: ReactNode[] = [];
  const baseEdges: ReactNode[] = [];
  const topEdges: ReactNode[] = [];
  const vertEdges: ReactNode[] = [];

  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const bPath = projectPathIsometric([base[i], base[next]]);

    topEdges.push(<path key={`t${i}`} d={projectPathIsometric([top[i], top[next]])} {...strokeProps} />);

    if (faceVis[i]) {
      baseEdges.push(<path key={`b${i}`} d={bPath} {...strokeProps} />);

      if (cutH != null) {
        const cI: [number, number, number] = [base[i][0], base[i][1], cutH];
        const cN: [number, number, number] = [base[next][0], base[next][1], cutH];
        const facePath = projectPathIsometric([base[i], base[next], cN, cI]) + ' Z';
        fills.push(<path key={`f${i}`} d={facePath} fill={F_LIQUID} stroke="none" />);
      }
    } else if (wire) {
      baseEdges.push(<path key={`b${i}`} d={bPath} {...dottedProps} />);
    }
  }

  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const edgePath = projectPathIsometric([base[i], top[i]]);
    const visible = faceVis[prev] || faceVis[i];
    if (visible) {
      vertEdges.push(<path key={`v${i}`} d={edgePath} {...strokeProps} />);
    } else if (wire) {
      vertEdges.push(<path key={`v${i}`} d={edgePath} {...dottedProps} />);
    }
  }

  if (cutH != null) {
    const cutVerts = base.map(([x, y]) => [x, y, cutH] as [number, number, number]);
    const cutPath = projectPathIsometric(cutVerts) + ' Z';
    fills.push(<path key="cut-top" d={cutPath} fill={F_LIQUID} stroke="none" />);
  }

  const dim = Math.max(2 * r, h);
  const fs = dim * LBL_FS_3D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const projected = base.map(([x, y, z]) => projectIsometric(x, y, z));
  const bottomIdx = projected.reduce((bi, p, i) => (p.sy > projected[bi].sy ? i : bi), 0);
  const nextIdx = (bottomIdx + 1) % n;
  const eMidX = (projected[bottomIdx].sx + projected[nextIdx].sx) / 2;
  const eMidY = (projected[bottomIdx].sy + projected[nextIdx].sy) / 2;

  const rightIdx = projected.reduce((bi, p, i) => (p.sx > projected[bi].sx ? i : bi), 0);
  const hBottom = projectIsometric(base[rightIdx][0], base[rightIdx][1], 0);
  const hTop = projectIsometric(base[rightIdx][0], base[rightIdx][1], h);
  const hMidY = (hBottom.sy + hTop.sy) / 2;

  return (
    <g>
      {fills}
      {cutH != null && (() => {
        const cutEdges: ReactNode[] = [];
        for (let i = 0; i < n; i++) {
          const next = (i + 1) % n;
          const cI: [number, number, number] = [base[i][0], base[i][1], cutH];
          const cN: [number, number, number] = [base[next][0], base[next][1], cutH];
          cutEdges.push(<path key={`c${i}`} d={projectPathIsometric([cI, cN])} {...strokeProps} />);
        }
        return cutEdges;
      })()}
      {baseEdges}
      {topEdges}
      {vertEdges}
      <text x={eMidX} y={eMidY + pad + fs * 0.7} {...lp}>s</text>
      <text x={hBottom.sx + pad} y={hMidY + fs * 0.35} {...lp} textAnchor="start">h</text>
    </g>
  );
}

export function getRegularPrismBbox(params: RegularPrismParams): BBox {
  const n = params.n;
  const r = resolveRadius(params);
  const h = params.height;
  const base = baseVertices(n, r);
  const top = base.map(([x, y]) => [x, y, h] as [number, number, number]);
  const all = [...base, ...top];
  const projected = all.map(([x, y, z]) => projectIsometric(x, y, z));
  const xs = projected.map((p) => p.sx);
  const ys = projected.map((p) => p.sy);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
