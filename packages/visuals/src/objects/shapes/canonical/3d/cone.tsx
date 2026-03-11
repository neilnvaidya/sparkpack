import type { ReactNode } from 'react';
import { ST, SW, F_LIQUID, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { projectIsometric, ISO_COS, ISO_SIN } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { ConeParams } from '../../params';

const ISO_RX = Math.SQRT2 * ISO_COS;
const ISO_RY = Math.SQRT2 * ISO_SIN;

function isoArcFront(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;
}
function isoArcBack(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
}

function isoEllipseFull(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`;
}

export function renderCone(params: ConeParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const h = params.height;
  const rx = r * ISO_RX;
  const ry = r * ISO_RY;
  const wire = options.wireframe !== false;
  const cutH = params.fillHeight != null && params.fillHeight > 0 ? params.fillHeight : null;

  const bc = projectIsometric(0, 0, 0);
  const ac = projectIsometric(0, 0, h);

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  const dim = Math.max(2 * r, h);
  const fs = dim * LBL_FS_3D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const hMidY = (bc.sy + ac.sy) / 2;

  const cutScale = cutH != null ? (h - cutH) / h : 0;
  const cutR = r * cutScale;
  const cutRx = cutR * ISO_RX;
  const cutRy = cutR * ISO_RY;
  const cc = cutH != null ? projectIsometric(0, 0, cutH) : null;

  return (
    <g>
      {cutH != null && cc != null && (
        <>
          <path
            d={
              `M ${bc.sx - rx} ${bc.sy} A ${rx} ${ry} 0 0 0 ${bc.sx + rx} ${bc.sy}` +
              ` L ${cc.sx + cutRx} ${cc.sy} A ${cutRx} ${cutRy} 0 0 1 ${cc.sx - cutRx} ${cc.sy} Z`
            }
            fill={F_LIQUID} stroke="none"
          />
          <ellipse cx={cc.sx} cy={cc.sy} rx={cutRx} ry={cutRy} fill={F_LIQUID} stroke="none" />
        </>
      )}
      {wire && <path d={isoArcBack(bc.sx, bc.sy, rx, ry)} {...dottedProps} />}
      <path d={isoArcFront(bc.sx, bc.sy, rx, ry)} {...strokeProps} />
      {cutH != null && cc != null && (
        <path d={isoEllipseFull(cc.sx, cc.sy, cutRx, cutRy)} {...strokeProps} />
      )}
      <line x1={bc.sx - rx} y1={bc.sy} x2={ac.sx} y2={ac.sy} {...strokeProps} />
      <line x1={bc.sx + rx} y1={bc.sy} x2={ac.sx} y2={ac.sy} {...strokeProps} />
      {wire && (
        <line
          x1={bc.sx} y1={bc.sy} x2={ac.sx} y2={ac.sy}
          stroke={ST} strokeWidth={SW} strokeDasharray={DASH_HIDDEN}
        />
      )}
      <line x1={bc.sx} y1={bc.sy} x2={bc.sx + rx} y2={bc.sy} stroke={ST} strokeWidth={SW} fill="none" />
      <text x={bc.sx + rx / 2} y={bc.sy - pad} {...lp}>r</text>
      {wire && <text x={bc.sx + pad * 0.5} y={hMidY + fs * 0.35} {...lp} textAnchor="start">h</text>}
    </g>
  );
}

export function getConeBbox(params: ConeParams): BBox {
  const r = params.radius;
  const rx = r * ISO_RX;
  const ry = r * ISO_RY;
  return {
    width: 2 * rx,
    height: ry + params.height,
  };
}
