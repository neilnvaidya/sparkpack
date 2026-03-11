import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW, LBL_FS_2D, LBL_PAD, labelProps } from '../../../shared';
import { projectIsometric, projectPathIsometric, ISO_COS, ISO_SIN } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { ParallelogramParams } from '../../../params';

export function renderParallelogramIsometric(params: ParallelogramParams, options: ShapeRenderOptions): ReactNode {
  const { base, height } = params;
  const offset = params.offset ?? height * 0.5;
  const filled = options.filled === true;

  const totalW = base + Math.abs(offset);
  const hw = totalW / 2;
  const hh = height / 2;
  const blX = -hw;
  const brX = -hw + base;
  const tlX = blX + offset;
  const trX = brX + offset;

  const points: [number, number, number][] = [
    [blX, hh, 0],
    [brX, hh, 0],
    [trX, -hh, 0],
    [tlX, -hh, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';

  const frontLeft = projectIsometric(blX, hh, 0);
  const frontRight = projectIsometric(brX, hh, 0);
  const fMidX = (frontLeft.sx + frontRight.sx) / 2;
  const fMidY = (frontLeft.sy + frontRight.sy) / 2;
  const dim = Math.max(totalW, height);
  const fs = dim * LBL_FS_2D;
  const pad = fs * LBL_PAD;
  const lp = labelProps(fs);

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <text x={fMidX} y={fMidY + pad + fs * 0.7} {...lp}>a</text>
    </g>
  );
}

export function getParallelogramIsometricBbox(params: ParallelogramParams): BBox {
  const offset = params.offset ?? params.height * 0.5;
  const totalW = params.base + Math.abs(offset);
  const hh = params.height / 2;
  const hw = totalW / 2;
  return {
    width: 2 * (hw + hh) * ISO_COS,
    height: 2 * (hw + hh) * ISO_SIN,
  };
}
