import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { ParallelogramParams } from '../../../params';

export function renderParallelogram(params: ParallelogramParams, options: ShapeRenderOptions): ReactNode {
  const { base, height } = params;
  const offset = params.offset ?? height * 0.5;
  const filled = options.filled === true;
  const dim = Math.max(base + Math.abs(offset), height);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const hh = height / 2;
  const totalW = base + Math.abs(offset);
  const hw = totalW / 2;

  const blX = -hw;
  const brX = -hw + base;
  const tlX = blX + offset;
  const trX = brX + offset;

  const d = `M ${blX} ${hh} L ${brX} ${hh} L ${trX} ${-hh} L ${tlX} ${-hh} Z`;
  const dottedProps = { stroke: ST, strokeWidth: SW, strokeDasharray: DASH_HIDDEN, fill: 'none' as const };

  const heightX = (blX + tlX) / 2;

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line x1={heightX} y1={-hh} x2={heightX} y2={hh} {...dottedProps} />
      <text x={(blX + brX) / 2} y={hh + pad + fs * 0.7} {...lp}>a</text>
      <text x={heightX - pad} y={fs * 0.35} {...lp} textAnchor="end">h</text>
    </g>
  );
}

export function getParallelogramBbox(params: ParallelogramParams): BBox {
  const offset = params.offset ?? params.height * 0.5;
  return { width: params.base + Math.abs(offset), height: params.height };
}
