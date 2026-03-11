import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { SemicircleParams } from '../../../params';

export function renderSemicircle(params: SemicircleParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const filled = options.filled === true;
  const fs = (2 * r) * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const d = `M ${-r} ${r / 2} A ${r} ${r} 0 0 1 ${r} ${r / 2} Z`;

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line x1={0} y1={r / 2} x2={0} y2={-r / 2} stroke={ST} strokeWidth={SW} />
      <text x={pad} y={0} {...lp} textAnchor="start">r</text>
    </g>
  );
}

export function getSemicircleBbox(params: SemicircleParams): BBox {
  const r = params.radius;
  return { width: 2 * r, height: r };
}
