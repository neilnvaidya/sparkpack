import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { RectangleParams } from '../../../params';

export function renderRectangle(params: RectangleParams, options: ShapeRenderOptions): ReactNode {
  const w = params.width;
  const h = params.height;
  const filled = options.filled === true;
  const dim = Math.max(w, h);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <text x={0} y={h / 2 + pad + fs * 0.7} {...lp}>w</text>
      <text x={-w / 2 - pad} y={fs * 0.35} {...lp} textAnchor="end">h</text>
    </g>
  );
}

export function getRectangleBbox(params: RectangleParams): BBox {
  return { width: params.width, height: params.height };
}
