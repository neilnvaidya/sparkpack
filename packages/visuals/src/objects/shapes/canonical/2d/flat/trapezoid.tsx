import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, DASH_HIDDEN, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { TrapezoidParams } from '../../../params';

export function renderTrapezoid(params: TrapezoidParams, options: ShapeRenderOptions): ReactNode {
  const { top, bottom, height } = params;
  const ra = params.rightAngled === true;
  const filled = options.filled === true;
  const dim = Math.max(bottom, height);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  const hh = height / 2;
  const hb = bottom / 2;

  let topLeft: number;
  let topRight: number;
  if (ra) {
    topLeft = -hb;
    topRight = -hb + top;
  } else {
    topLeft = -top / 2;
    topRight = top / 2;
  }

  const d = `M ${-hb} ${hh} L ${hb} ${hh} L ${topRight} ${-hh} L ${topLeft} ${-hh} Z`;
  const dottedProps = { stroke: ST, strokeWidth: SW, strokeDasharray: DASH_HIDDEN, fill: 'none' as const };

  const heightX = ra ? -hb : 0;

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      {!ra && <line x1={0} y1={-hh} x2={0} y2={hh} {...dottedProps} />}
      <text x={(topLeft + topRight) / 2} y={-hh - pad} {...lp}>a</text>
      <text x={0} y={hh + pad + fs * 0.7} {...lp}>b</text>
      <text x={heightX - pad} y={fs * 0.35} {...lp} textAnchor="end">h</text>
    </g>
  );
}

export function getTrapezoidBbox(params: TrapezoidParams): BBox {
  return { width: params.bottom, height: params.height };
}
