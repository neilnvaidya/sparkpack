import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW } from '../../../shared';
import { projectPathIsometric, ISO_COS, ISO_SIN } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { KiteParams } from '../../../params';

export function renderKiteIsometric(params: KiteParams, options: ShapeRenderOptions): ReactNode {
  const { width, height } = params;
  const crossRatio = params.crossRatio ?? 0.25;
  const filled = options.filled === true;

  const hh = height / 2;
  const hw = width / 2;
  const crossY = -hh + crossRatio * height;

  const points: [number, number, number][] = [
    [0, -hh, 0],
    [hw, crossY, 0],
    [0, hh, 0],
    [-hw, crossY, 0],
  ];
  const d = projectPathIsometric(points) + ' Z';

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
    </g>
  );
}

export function getKiteIsometricBbox(params: KiteParams): BBox {
  const hw = params.width / 2;
  const hh = params.height / 2;
  return {
    width: 2 * (hw + hh) * ISO_COS,
    height: 2 * (hw + hh) * ISO_SIN,
  };
}
