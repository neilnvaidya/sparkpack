import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { CircleParams } from '../../../params';

export function renderCircle(params: CircleParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const filled = options.filled === true;
  const fs = (2 * r) * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <circle
        cx={0}
        cy={0}
        r={r}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <line x1={0} y1={0} x2={r} y2={0} stroke={ST} strokeWidth={SW} />
      <text x={r / 2} y={-pad} {...lp}>r</text>
    </g>
  );
}

export function getCircleBbox(params: CircleParams): BBox {
  const d = params.radius * 2;
  return { width: d, height: d };
}
