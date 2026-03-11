import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { SquareParams } from '../../../params';

export function renderSquare(params: SquareParams, options: ShapeRenderOptions): ReactNode {
  const s = params.side / 2;
  const filled = options.filled === true;
  const fs = params.side * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <rect
        x={-s}
        y={-s}
        width={params.side}
        height={params.side}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <text x={0} y={s + pad + fs * 0.7} {...lp}>w</text>
    </g>
  );
}

export function getSquareBbox(params: SquareParams): BBox {
  return { width: params.side, height: params.side };
}
