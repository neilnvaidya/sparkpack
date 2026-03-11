import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { TriangularPrismParams } from '../../params';

const SQRT3 = Math.sqrt(3);

function edge(a: [number, number, number], b: [number, number, number]): string {
  return projectPathIsometric([a, b]);
}

function quadPath(
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
  d: [number, number, number],
): string {
  return projectPathIsometric([a, b, c, d]) + ' Z';
}

function triPath(
  a: [number, number, number],
  b: [number, number, number],
  c: [number, number, number],
): string {
  return projectPathIsometric([a, b, c]) + ' Z';
}

function resolveBase(params: TriangularPrismParams): { bw: number; bh: number } {
  const s = params.side ?? 1;
  return {
    bw: params.baseWidth ?? s,
    bh: params.baseHeight ?? (params.baseWidth != null ? params.baseWidth * SQRT3 / 2 : s * SQRT3 / 2),
  };
}

/**
 * Triangular prism: equilateral (or custom) triangle base at z=0, top at z=h.
 * Base triangle: front edge at bottom (positive y), apex at back (negative y).
 */
export function renderTriangularPrism(params: TriangularPrismParams, options: ShapeRenderOptions): ReactNode {
  const { bw, bh } = resolveBase(params);
  const h = params.height;
  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;
  const wire = options.wireframe !== false;

  const frontOff = bh / 3;
  const bL: [number, number, number] = [-bw / 2, frontOff, 0];
  const bR: [number, number, number] = [bw / 2, frontOff, 0];
  const bA: [number, number, number] = [0, frontOff - bh, 0];
  const tL: [number, number, number] = [-bw / 2, frontOff, h];
  const tR: [number, number, number] = [bw / 2, frontOff, h];
  const tA: [number, number, number] = [0, frontOff - bh, h];

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  return (
    <g>
      {/* --- Fills first (below all lines) --- */}
      {cutH != null && (() => {
        const cL: [number, number, number] = [-bw / 2, frontOff, cutH];
        const cR: [number, number, number] = [bw / 2, frontOff, cutH];
        const cA: [number, number, number] = [0, frontOff - bh, cutH];
        return (
          <>
            {/* Front face fill */}
            <path d={quadPath(bL, bR, cR, cL)} fill={F_LIQUID} stroke="none" />
            {/* Right face fill */}
            <path d={quadPath(bR, bA, cA, cR)} fill={F_LIQUID} stroke="none" />
            {/* Cutting triangle fill */}
            <path d={triPath(cL, cR, cA)} fill={F_LIQUID} stroke="none" />
          </>
        );
      })()}
      {/* --- All edges on top --- */}
      {/* Base triangle (z=0): all solid */}
      <path d={edge(bL, bR)} {...strokeProps} />
      <path d={edge(bR, bA)} {...strokeProps} />
      {wire && <path d={edge(bA, bL)} {...dottedProps} />}
      {/* Cutting triangle at fill height */}
      {cutH != null && (() => {
        const cL: [number, number, number] = [-bw / 2, frontOff, cutH];
        const cR: [number, number, number] = [bw / 2, frontOff, cutH];
        const cA: [number, number, number] = [0, frontOff - bh, cutH];
        return (
          <>
            <path d={edge(cL, cR)} {...strokeProps} />
            <path d={edge(cR, cA)} {...strokeProps} />
            <path d={edge(cA, cL)} {...strokeProps} />
          </>
        );
      })()}
      {/* Top triangle (z=h): all solid */}
      <path d={edge(tL, tR)} {...strokeProps} />
      <path d={edge(tR, tA)} {...strokeProps} />
      <path d={edge(tA, tL)} {...strokeProps} />
      {/* Vertical edges: all solid */}
      <path d={edge(bL, tL)} {...strokeProps} />
      <path d={edge(bR, tR)} {...strokeProps} />
      <path d={edge(bA, tA)} {...strokeProps} />
      {/* Dimension labels */}
      {(() => {
        const dim = Math.max(bw, bh, h);
        const fs = dim * LBL_FS_3D;
        const subFs = fs * 0.7;
        const pad = fs * LBL_PAD;
        const sMid = projectIsometric(0, frontOff, 0);
        const apexX = 0;
        const apexY = frontOff - bh;
        const hMid = projectIsometric(apexX, apexY, h / 2);
        const lp = labelProps(fs);
        return (
          <>
            <text x={sMid.sx} y={sMid.sy + pad + fs * 0.7} {...lp}>s</text>
            <text x={hMid.sx + pad} y={hMid.sy + fs * 0.35} {...lp} textAnchor="start">h</text>
            {cutH != null && (() => {
              const tickLen = dim * 0.06;
              const leftX = -bw / 2;
              const leftY = frontOff;
              const tickBase = projectIsometric(leftX, leftY, 0);
              const tickCut = projectIsometric(leftX, leftY, cutH);
              const tickTop = projectIsometric(leftX, leftY, h);
              const fillMidY = (tickBase.sy + tickCut.sy) / 2;
              const unfilledMidY = (tickCut.sy + tickTop.sy) / 2;
              const tickProps = { stroke: ST, strokeWidth: SW, fill: 'none' as const };
              return (
                <>
                  <line x1={tickBase.sx} y1={tickBase.sy} x2={tickBase.sx - tickLen} y2={tickBase.sy} {...tickProps} />
                  <line x1={tickCut.sx} y1={tickCut.sy} x2={tickCut.sx - tickLen} y2={tickCut.sy} {...tickProps} />
                  <line x1={tickTop.sx} y1={tickTop.sy} x2={tickTop.sx - tickLen} y2={tickTop.sy} {...tickProps} />
                  <text x={tickBase.sx - tickLen - pad} y={fillMidY + fs * 0.35} {...lp} textAnchor="end">
                    h<tspan dy={subFs * 0.35} fontSize={subFs}>f</tspan>
                  </text>
                  <text x={tickBase.sx - tickLen - pad} y={unfilledMidY + fs * 0.35} {...lp} textAnchor="end">
                    h<tspan dy={subFs * 0.35} fontSize={subFs}>u</tspan>
                  </text>
                </>
              );
            })()}
          </>
        );
      })()}
    </g>
  );
}

export function getTriangularPrismBbox(params: TriangularPrismParams): BBox {
  const { bw, bh } = resolveBase(params);
  return {
    width: (bw + bh) * ISO_COS,
    height: (bw + bh) * ISO_SIN + params.height,
  };
}
