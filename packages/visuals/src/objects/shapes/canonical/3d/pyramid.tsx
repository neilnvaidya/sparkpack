import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { RegularPyramidParams } from '../../params';

function resolveRadius(params: RegularPyramidParams): number {
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
 * Determine if the lateral face (v1 → v2 → apex) is front-facing in isometric view.
 * View direction (scene to camera) is (1, 1, 1). Face is visible if outward normal · (1,1,1) > 0.
 */
function isFaceVisible(v1: [number, number, number], v2: [number, number, number], h: number): boolean {
  const nx = h * (v2[1] - v1[1]);
  const ny = -h * (v2[0] - v1[0]);
  const nz = v1[0] * v2[1] - v1[1] * v2[0];
  return (nx + ny + nz) > 0;
}

export function renderPyramid(params: RegularPyramidParams, options: ShapeRenderOptions): ReactNode {
  const n = params.n;
  const r = resolveRadius(params);
  const h = params.height;
  const base = baseVertices(n, r);
  const apex: [number, number, number] = [0, 0, h];
  const wire = options.wireframe !== false;
  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;
  const s = cutH != null ? (h - cutH) / h : 0;
  const cutVerts: [number, number, number][] = cutH != null
    ? base.map(([x, y]) => [x * s, y * s, cutH])
    : [];

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  const faceVis: boolean[] = [];
  for (let i = 0; i < n; i++) {
    faceVis.push(isFaceVisible(base[i], base[(i + 1) % n], h));
  }

  const fills: ReactNode[] = [];
  const baseEdges: ReactNode[] = [];
  const lateralEdges: ReactNode[] = [];

  for (let i = 0; i < n; i++) {
    const next = (i + 1) % n;
    const edgePath = projectPathIsometric([base[i], base[next]]);
    if (faceVis[i]) {
      baseEdges.push(<path key={`b${i}`} d={edgePath} {...strokeProps} />);
      if (cutH != null) {
        const trapPath = projectPathIsometric([base[i], base[next], cutVerts[next], cutVerts[i]]) + ' Z';
        fills.push(<path key={`f${i}`} d={trapPath} fill={F_LIQUID} stroke="none" />);
      }
    } else if (wire) {
      baseEdges.push(<path key={`b${i}`} d={edgePath} {...dottedProps} />);
    }
  }

  if (cutH != null) {
    const cutPath = projectPathIsometric(cutVerts) + ' Z';
    fills.push(<path key="cut-top" d={cutPath} fill={F_LIQUID} stroke="none" />);
  }

  for (let i = 0; i < n; i++) {
    const prev = (i - 1 + n) % n;
    const edgePath = projectPathIsometric([base[i], apex]);
    const visible = faceVis[prev] || faceVis[i];
    if (visible) {
      lateralEdges.push(<path key={`l${i}`} d={edgePath} {...strokeProps} />);
    } else if (wire) {
      lateralEdges.push(<path key={`l${i}`} d={edgePath} {...dottedProps} />);
    }
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

  const bc = projectIsometric(0, 0, 0);
  const ac = projectIsometric(0, 0, h);
  const hMidX = (bc.sx + ac.sx) / 2;
  const hMidY = (bc.sy + ac.sy) / 2;

  return (
    <g>
      {fills}
      {cutH != null && (() => {
        const cutEdgeNodes: ReactNode[] = [];
        for (let i = 0; i < n; i++) {
          const next = (i + 1) % n;
          cutEdgeNodes.push(
            <path key={`c${i}`} d={projectPathIsometric([cutVerts[i], cutVerts[next]])} {...strokeProps} />
          );
        }
        return cutEdgeNodes;
      })()}
      {baseEdges}
      {lateralEdges}
      {wire && (
        <line
          x1={bc.sx} y1={bc.sy} x2={ac.sx} y2={ac.sy}
          stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN}
        />
      )}
      <text x={eMidX} y={eMidY + pad + fs * 0.7} {...lp}>s</text>
      {wire && <text x={hMidX + pad * 0.5} y={hMidY + fs * 0.8} {...lp} textAnchor="start">h</text>}
    </g>
  );
}

export function getPyramidBbox(params: RegularPyramidParams): BBox {
  const n = params.n;
  const r = resolveRadius(params);
  const h = params.height;
  const base = baseVertices(n, r);
  const apex: [number, number, number] = [0, 0, h];
  const all = [...base, apex];
  const projected = all.map(([x, y, z]) => projectIsometric(x, y, z));
  const xs = projected.map((p) => p.sx);
  const ys = projected.map((p) => p.sy);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}
