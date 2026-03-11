import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { RhombusParams } from '../../../params';

export function renderRhombus(params: RhombusParams, options: ShapeRenderOptions): ReactNode {
  const w = params.width;
  const h = params.height;
  const hw = w / 2;
  const hh = h / 2;
  const filled = options.filled === true;
  const dim = Math.max(w, h);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const d = `M 0 ${-hh} L ${hw} 0 L 0 ${hh} L ${-hw} 0 Z`;
  const dottedProps = { stroke: ST, strokeWidth: SW, strokeDasharray: DASH_HIDDEN, fill: 'none' as const };

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      {/* Diagonals (dashed) */}
      <line x1={-hw} y1={0} x2={hw} y2={0} {...dottedProps} />
      <line x1={0} y1={-hh} x2={0} y2={hh} {...dottedProps} />
      {/* Labels for diagonals */}
      <text x={hw / 2} y={-pad} {...lp}>
        d<tspan dy={fs * 0.25} fontSize={fs * 0.7}>1</tspan>
      </text>
      <text x={pad} y={-hh / 2} {...lp} textAnchor="start">
        d<tspan dy={fs * 0.25} fontSize={fs * 0.7}>2</tspan>
      </text>
    </g>
  );
}

export function getRhombusBbox(params: RhombusParams): BBox {
  return { width: params.width, height: params.height };
}
