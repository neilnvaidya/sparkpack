import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { projectIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { CylinderParams } from '../../params';

const ISO_RX = Math.SQRT2 * ISO_COS;
const ISO_RY = Math.SQRT2 * ISO_SIN;

/**
 * SVG arc helpers for isometric ellipses.
 * In SVG (y-down), sweep=1 from left→right goes through the TOP (back in iso).
 * sweep=0 from left→right goes through the BOTTOM (front in iso).
 */
function isoArcFront(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;
}
function isoArcBack(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
}
function isoEllipseFull(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
}

export function renderCylinder(params: CylinderParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const h = params.height;
  const rx = r * ISO_RX;
  const ry = r * ISO_RY;
  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;
  const wire = options.wireframe !== false;

  const bc = projectIsometric(0, 0, 0);
  const tc = projectIsometric(0, 0, h);

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  return (
    <g>
      {cutH != null && (() => {
        const cc = projectIsometric(0, 0, cutH);
        const bodyFill =
          `M ${bc.sx - rx} ${bc.sy} A ${rx} ${ry} 0 0 0 ${bc.sx + rx} ${bc.sy}` +
          ` L ${cc.sx + rx} ${cc.sy} A ${rx} ${ry} 0 0 1 ${cc.sx - rx} ${cc.sy} Z`;
        return (
          <>
            <path d={bodyFill} fill={F_LIQUID} stroke="none" />
            <ellipse cx={cc.sx} cy={cc.sy} rx={rx} ry={ry} fill={F_LIQUID} stroke="none" />
          </>
        );
      })()}
      {wire && <path d={isoArcBack(bc.sx, bc.sy, rx, ry)} {...dottedProps} />}
      <path d={isoArcFront(bc.sx, bc.sy, rx, ry)} {...strokeProps} />
      {cutH != null && (() => {
        const cc = projectIsometric(0, 0, cutH);
        return <path d={isoEllipseFull(cc.sx, cc.sy, rx, ry)} {...strokeProps} />;
      })()}
      <line x1={bc.sx - rx} y1={bc.sy} x2={tc.sx - rx} y2={tc.sy} {...strokeProps} />
      <line x1={bc.sx + rx} y1={bc.sy} x2={tc.sx + rx} y2={tc.sy} {...strokeProps} />
      <path d={isoEllipseFull(tc.sx, tc.sy, rx, ry)} {...strokeProps} />
      {(() => {
        const dim = Math.max(r * 2, h);
        const fs = dim * LBL_FS_3D;
        const subFs = fs * 0.7;
        const pad = fs * LBL_PAD;
        const lp = labelProps(fs);
        return (
          <>
            <line x1={bc.sx} y1={bc.sy} x2={bc.sx + rx} y2={bc.sy} stroke={ST} strokeWidth={SW} fill="none" />
            <text x={bc.sx + rx / 2} y={bc.sy - pad} {...lp}>r</text>
            <text x={bc.sx + rx + pad} y={(bc.sy + tc.sy) / 2 + fs * 0.35} {...lp} textAnchor="start">h</text>
            {cutH != null && (() => {
              const tickLen = dim * 0.06;
              const tickBase = { sx: bc.sx - rx, sy: bc.sy };
              const tickCut = { sx: bc.sx - rx, sy: projectIsometric(0, 0, cutH).sy };
              const tickTop = { sx: tc.sx - rx, sy: tc.sy };
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

export function getCylinderBbox(params: CylinderParams): BBox {
  const r = params.radius;
  const rx = r * ISO_RX;
  const ry = r * ISO_RY;
  return {
    width: 2 * rx,
    height: 2 * ry + params.height,
  };
}
