import type { ReactNode } from 'react';
import type { ShapeId } from './shapeIds';
import type { ShapeParams, ShapeRenderOptions } from './params';
import { getShapeRenderer } from './canonical/registry';

export interface ShapeDrawingProps<S extends ShapeId = ShapeId> {
  shapeId: S;
  params: Extract<ShapeParams, { shapeId: S }>['params'];
  x: number;
  y: number;
  /** Size of the slot (width and height); shape is scaled to fit. Default 32. */
  size?: number;
  /** If true, 2D shapes draw with fill; otherwise outline only. 3D shapes are outline-only. Default false. */
  filled?: boolean;
  /** If true, hidden edges shown as dotted (wireframe). If false, hidden edges omitted (solid). Default true. */
  wireframe?: boolean;
  /** If true, render as an open-top container with flat-shaded faces. Default false. */
  container?: boolean;
  className?: string;
}

/**
 * Renders a parametric math shape at (x, y), scaled to fit inside a size×size slot.
 * Shapes are outline-first; set filled=true for 2D fill.
 */
export function ShapeDrawing<S extends ShapeId>({
  shapeId,
  params,
  x,
  y,
  size = 32,
  filled = false,
  wireframe = true,
  container = false,
  className,
}: ShapeDrawingProps<S>): ReactNode {
  const entry = getShapeRenderer(shapeId);
  if (!entry) return null;
  const bbox = entry.getBbox(params);
  const scale = size / Math.max(bbox.width, bbox.height);
  const options: ShapeRenderOptions = { filled, wireframe, container };
  const content = entry.render(params, options);
  return (
    <g
      className={className}
      transform={`translate(${x}, ${y}) scale(${scale})`}
      aria-label={shapeId}
    >
      {content}
    </g>
  );
}
