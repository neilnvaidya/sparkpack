import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { KiteParams } from '../../../params';

export function renderKite(params: KiteParams, options: ShapeRenderOptions): ReactNode {
  const { width, height } = params;
  const crossRatio = params.crossRatio ?? 0.25;
  const filled = options.filled === true;
  const dim = Math.max(width, height);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const hh = height / 2;
  const hw = width / 2;
  const crossY = -hh + crossRatio * height;

  const d = `M 0 ${-hh} L ${hw} ${crossY} L 0 ${hh} L ${-hw} ${crossY} Z`;
  const dottedProps = { stroke: ST, strokeWidth: SW, strokeDasharray: DASH_HIDDEN, fill: 'none' as const };

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      {/* Diagonals (dashed) */}
      <line x1={-hw} y1={crossY} x2={hw} y2={crossY} {...dottedProps} />
      <line x1={0} y1={-hh} x2={0} y2={hh} {...dottedProps} />
      <text x={hw / 2} y={crossY - pad} {...lp}>
        d<tspan dy={fs * 0.25} fontSize={fs * 0.7}>1</tspan>
      </text>
      <text x={pad} y={0} {...lp} textAnchor="start">
        d<tspan dy={fs * 0.25} fontSize={fs * 0.7}>2</tspan>
      </text>
    </g>
  );
}

export function getKiteBbox(params: KiteParams): BBox {
  return { width: params.width, height: params.height };
}
