import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps, F_FACE_FRONT, F_FACE_SIDE, F_FACE_INSIDE, F_FACE_BASE } from '../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { CuboidParams } from '../../params';

function edge(a: [number, number, number], b: [number, number, number]): string {
  return projectPathIsometric([a, b]);
}

function quadPath(a: [number, number, number], b: [number, number, number], c: [number, number, number], d: [number, number, number]): string {
  return projectPathIsometric([a, b, c, d]) + ' Z';
}

function resolveDims(params: CuboidParams): { w: number; l: number; h: number } {
  const fallback = params.side ?? 1;
  return {
    w: params.width ?? fallback,
    l: params.length ?? fallback,
    h: params.height ?? fallback,
  };
}

/**
 * Container mode: open-top cuboid with flat-shaded faces.
 * Each face is a filled+stroked path drawn back-to-front so
 * nearer faces naturally occlude farther edges/faces.
 */
function renderCuboidContainer(hw: number, hl: number, h: number, cutH: number | null): ReactNode {
  const backLeft: [number, number, number] = [-hw, -hl, 0];
  const backRight: [number, number, number] = [hw, -hl, 0];
  const frontRight: [number, number, number] = [hw, hl, 0];
  const frontLeft: [number, number, number] = [-hw, hl, 0];
  const backLeftTop: [number, number, number] = [-hw, -hl, h];
  const backRightTop: [number, number, number] = [hw, -hl, h];
  const frontRightTop: [number, number, number] = [hw, hl, h];
  const frontLeftTop: [number, number, number] = [-hw, hl, h];

  const sp = { stroke: ST, strokeWidth: SW, strokeLinejoin: 'round' as const };

  return (
    <g>
      {/* Back-to-front: back wall, left wall, base, liquid surface, right wall, front wall */}
      <path d={quadPath(backLeft, backRight, backRightTop, backLeftTop)} fill={F_FACE_INSIDE} {...sp} />
      <path d={quadPath(backLeft, frontLeft, frontLeftTop, backLeftTop)} fill={F_FACE_INSIDE} {...sp} />
      <path d={quadPath(backLeft, backRight, frontRight, frontLeft)} fill={F_FACE_BASE} {...sp} />
      {cutH != null && (
        <path
          d={quadPath([-hw, -hl, cutH], [hw, -hl, cutH], [hw, hl, cutH], [-hw, hl, cutH])}
          fill={F_LIQUID} stroke="none"
        />
      )}
      <path d={quadPath(frontRight, backRight, backRightTop, frontRightTop)} fill={F_FACE_SIDE} {...sp} />
      <path d={quadPath(frontLeft, frontRight, frontRightTop, frontLeftTop)} fill={F_FACE_FRONT} {...sp} />
    </g>
  );
}

export function renderCuboid(params: CuboidParams, options: ShapeRenderOptions): ReactNode {
  const { w, l, h } = resolveDims(params);
  const hw = w / 2;
  const hl = l / 2;

  if (options.container) {
    const cH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;
    return renderCuboidContainer(hw, hl, h, cH);
  }

  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;
  const wire = options.wireframe !== false;

  const backLeft: [number, number, number] = [-hw, -hl, 0];
  const backRight: [number, number, number] = [hw, -hl, 0];
  const frontRight: [number, number, number] = [hw, hl, 0];
  const frontLeft: [number, number, number] = [-hw, hl, 0];
  const backLeftTop: [number, number, number] = [-hw, -hl, h];
  const backRightTop: [number, number, number] = [hw, -hl, h];
  const frontRightTop: [number, number, number] = [hw, hl, h];
  const frontLeftTop: [number, number, number] = [-hw, hl, h];

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  return (
    <g>
      {cutH != null && (
        <>
          <path d={quadPath(frontLeft, frontRight, [hw, hl, cutH], [-hw, hl, cutH])} fill={F_LIQUID} stroke="none" />
          <path d={quadPath(frontRight, backRight, [hw, -hl, cutH], [hw, hl, cutH])} fill={F_LIQUID} stroke="none" />
          <path d={quadPath([-hw, hl, cutH], [hw, hl, cutH], [hw, -hl, cutH], [-hw, -hl, cutH])} fill={F_LIQUID} stroke="none" />
        </>
      )}
      <path d={edge(frontLeft, frontRight)} {...strokeProps} />
      <path d={edge(frontRight, backRight)} {...strokeProps} />
      {wire && <path d={edge(backRight, backLeft)} {...dottedProps} />}
      {wire && <path d={edge(backLeft, frontLeft)} {...dottedProps} />}
      {cutH != null && (
        <>
          <path d={edge([-hw, hl, cutH], [hw, hl, cutH])} {...strokeProps} />
          <path d={edge([hw, hl, cutH], [hw, -hl, cutH])} {...strokeProps} />
          <path d={edge([hw, -hl, cutH], [-hw, -hl, cutH])} {...strokeProps} />
          <path d={edge([-hw, -hl, cutH], [-hw, hl, cutH])} {...strokeProps} />
        </>
      )}
      <path d={edge(frontLeftTop, frontRightTop)} {...strokeProps} />
      <path d={edge(frontRightTop, backRightTop)} {...strokeProps} />
      <path d={edge(backRightTop, backLeftTop)} {...strokeProps} />
      <path d={edge(backLeftTop, frontLeftTop)} {...strokeProps} />
      <path d={edge(frontLeft, frontLeftTop)} {...strokeProps} />
      <path d={edge(frontRight, frontRightTop)} {...strokeProps} />
      {wire && <path d={edge(backLeft, backLeftTop)} {...dottedProps} />}
      <path d={edge(backRight, backRightTop)} {...strokeProps} />
      {(() => {
        const dim = Math.max(w, l, h);
        const fs = dim * LBL_FS_3D;
        const subFs = fs * 0.7;
        const pad = fs * LBL_PAD;
        const wMid = projectIsometric(0, hl, 0);
        const lMid = projectIsometric(hw, 0, 0);
        const hMid = projectIsometric(hw, -hl, h / 2);
        const lp = labelProps(fs);
        return (
          <>
            <text x={wMid.sx} y={wMid.sy + pad + fs * 0.7} {...lp}>w</text>
            <text x={lMid.sx + pad} y={lMid.sy + fs * 0.35} {...lp} textAnchor="start">l</text>
            <text x={hMid.sx + pad} y={hMid.sy + fs * 0.35} {...lp} textAnchor="start">h</text>
            {cutH != null && (() => {
              const tickLen = dim * 0.06;
              const fillMid = projectIsometric(-hw, hl, cutH / 2);
              const unfilledMid = projectIsometric(-hw, hl, (cutH + h) / 2);
              const tickBase = projectIsometric(-hw, hl, 0);
              const tickCut = projectIsometric(-hw, hl, cutH);
              const tickTop = projectIsometric(-hw, hl, h);
              const tickProps = { stroke: ST, strokeWidth: SW, fill: 'none' as const };
              return (
                <>
                  <line x1={tickBase.sx} y1={tickBase.sy} x2={tickBase.sx - tickLen} y2={tickBase.sy} {...tickProps} />
                  <line x1={tickCut.sx} y1={tickCut.sy} x2={tickCut.sx - tickLen} y2={tickCut.sy} {...tickProps} />
                  <line x1={tickTop.sx} y1={tickTop.sy} x2={tickTop.sx - tickLen} y2={tickTop.sy} {...tickProps} />
                  <text x={fillMid.sx - pad} y={fillMid.sy + fs * 0.35} {...lp} textAnchor="end">
                    h<tspan dy={subFs * 0.35} fontSize={subFs}>f</tspan>
                  </text>
                  <text x={unfilledMid.sx - pad} y={unfilledMid.sy + fs * 0.35} {...lp} textAnchor="end">
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

export function getCuboidBbox(params: CuboidParams): BBox {
  const { w, l, h } = resolveDims(params);
  return {
    width: (w + l) * ISO_COS,
    height: (w + l) * ISO_SIN + h,
  };
}
