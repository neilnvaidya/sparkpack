import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { SquareParams } from '../../../params';

export function renderSquareIsometric(params: SquareParams, options: ShapeRenderOptions): ReactNode {
  const s = params.side / 2;
  const filled = options.filled === true;
  const points: [number, number, number][] = [
    [-s, -s, 0],
    [s, -s, 0],
    [s, s, 0],
    [-s, s, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';
  const frontLeft = projectIsometric(-s, s, 0);
  const frontRight = projectIsometric(s, s, 0);
  const fMidX = (frontLeft.sx + frontRight.sx) / 2;
  const fMidY = (frontLeft.sy + frontRight.sy) / 2;
  const fs = params.side * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);
  return (
    <g>
      <path
        d={d}
        fill={filled ? F_SHAPE : 'none'}
        stroke={ST}
        strokeWidth={SW}
      />
      <text x={fMidX} y={fMidY + pad + fs * 0.7} {...lp}>w</text>
    </g>
  );
}

export function getSquareIsometricBbox(params: SquareParams): BBox {
  const s = params.side / 2;
  return {
    width: 4 * s * ISO_COS,
    height: 4 * s * ISO_SIN,
  };
}
