import type { ReactNode } from 'react';
import { ST, SW, DASH_HIDDEN, LBL_FS_3D, LBL_PAD, labelProps } from '../../shared';
import { ISO_SIN, ISO_COS } from '../isometric';
import type { BBox, ShapeRenderOptions } from '../../params';
import type { SphereParams } from '../../params';

function isoArcFront(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`;
}
function isoArcBack(cx: number, cy: number, rx: number, ry: number): string {
  return `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
}

let gradientCounter = 0;

export function renderSphere(params: SphereParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const wire = options.wireframe !== false;

  const erx = r;
  const ery = r * (ISO_SIN / ISO_COS);

  const strokeProps = { fill: 'none' as const, stroke: ST, strokeWidth: SW };
  const dottedProps = { ...strokeProps, strokeDasharray: DASH_HIDDEN };

  const dim = 2 * r;
  const fs = dim * LBL_FS_3D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const gradId = `sphere-grad-${gradientCounter++}`;

  return (
    <g>
      <defs>
        <radialGradient id={gradId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#d1d5db" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0.6" />
        </radialGradient>
      </defs>
      <circle cx={0} cy={0} r={r} fill={wire ? 'none' : `url(#${gradId})`} stroke={ST} strokeWidth={SW} />
      {wire && <path d={isoArcBack(0, 0, erx, ery)} {...dottedProps} />}
      {wire && <path d={isoArcFront(0, 0, erx, ery)} {...strokeProps} />}
      <line x1={0} y1={0} x2={r} y2={0} stroke={ST} strokeWidth={SW} fill="none" />
      <text x={r / 2} y={-pad} {...lp}>r</text>
    </g>
  );
}

export function getSphereBbox(params: SphereParams): BBox {
  const d = 2 * params.radius;
  return { width: d, height: d };
}
