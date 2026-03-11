import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { ISO_COS, ISO_SIN } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { CircleParams } from '../../../params';

const ISO_ELLIPSE_RX = Math.SQRT2 * ISO_COS;
const ISO_ELLIPSE_RY = Math.SQRT2 * ISO_SIN;

export function renderCircleIsometric(params: CircleParams, options: ShapeRenderOptions): ReactNode {
  const filled = options.filled === true;
  const r = params.radius;
  const rx = r * ISO_ELLIPSE_RX;
  const ry = r * ISO_ELLIPSE_RY;
  const fs = (2 * r) * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <ellipse
        cx={0}
        cy={0}
        rx={rx}
        ry={ry}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <line x1={0} y1={0} x2={rx} y2={0} stroke={ST} strokeWidth={SW} />
      <text x={rx / 2} y={-pad} {...lp}>r</text>
    </g>
  );
}

export function getCircleIsometricBbox(params: CircleParams): BBox {
  const r = params.radius;
  return {
    width: 2 * r * ISO_ELLIPSE_RX,
    height: 2 * r * ISO_ELLIPSE_RY,
  };
}
