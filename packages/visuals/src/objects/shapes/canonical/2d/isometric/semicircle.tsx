import type { ReactNode } from 'react';
import { ST, F_SHAPE, SW } from '../../../shared';
import { projectIsometric, ISO_COS, ISO_SIN } from '../../isometric';
import type { BBox, ShapeRenderOptions } from '../../../params';
import type { SemicircleParams } from '../../../params';

const ARC_SEGMENTS = 32;

export function renderSemicircleIsometric(params: SemicircleParams, options: ShapeRenderOptions): ReactNode {
  const r = params.radius;
  const filled = options.filled === true;

  const pts: { sx: number; sy: number }[] = [];
  for (let i = 0; i <= ARC_SEGMENTS; i++) {
    const angle = Math.PI * (i / ARC_SEGMENTS);
    const x = r * Math.cos(angle);
    const y = -r * Math.sin(angle);
    pts.push(projectIsometric(x, y, 0));
  }
  const diamLeft = projectIsometric(-r, 0, 0);
  const diamRight = projectIsometric(r, 0, 0);

  let d = `M ${diamRight.sx} ${diamRight.sy}`;
  for (let i = 1; i <= ARC_SEGMENTS; i++) {
    d += ` L ${pts[i].sx} ${pts[i].sy}`;
  }
  d += ' Z';

  return (
    <g>
      <path d={d} fill={filled ? F_SHAPE : 'none'} stroke={ST} strokeWidth={SW} />
      <line
        x1={diamLeft.sx} y1={diamLeft.sy}
        x2={diamRight.sx} y2={diamRight.sy}
        stroke={ST} strokeWidth={SW}
      />
    </g>
  );
}

export function getSemicircleIsometricBbox(params: SemicircleParams): BBox {
  const r = params.radius;
  return {
    width: 2 * r * ISO_COS + r * ISO_COS,
    height: 2 * r * ISO_SIN + r * ISO_SIN,
  };
}
