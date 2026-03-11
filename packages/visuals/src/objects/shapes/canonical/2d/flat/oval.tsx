import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { OvalParams } from '../../../params';

export function renderOval(params: OvalParams, options: ShapeRenderOptions): ReactNode {
  const { rx, ry } = params;
  const filled = options.filled === true;
  const dim = Math.max(2 * rx, 2 * ry);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line x1={0} y1={0} x2={rx} y2={0} stroke={ST} strokeWidth={SW} />
      <line x1={0} y1={0} x2={0} y2={-ry} stroke={ST} strokeWidth={SW} />
      <text x={rx / 2} y={pad + fs * 0.7} {...lp}>a</text>
      <text x={pad} y={-ry / 2} {...lp} textAnchor="start">b</text>
    </g>
  );
}

export function getOvalBbox(params: OvalParams): BBox {
  return { width: 2 * params.rx, height: 2 * params.ry };
}
