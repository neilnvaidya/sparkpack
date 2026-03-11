import type { ReactNode } from 'react';
import type { ObjectId } from './objectIds';
import { OBJECT_IDS } from './objectIds';
import { DRAWINGS } from './drawings';

/** Map each object id to its drawing component (only ids with an SVG have an entry). */
const DRAWING_MAP = DRAWINGS as Partial<Record<ObjectId, () => ReactNode>>;

export { OBJECT_IDS } from './objectIds';
export type { ObjectId } from './objectIds';

export function isObjectInLibrary(id: string): id is ObjectId {
  return OBJECT_IDS.includes(id as ObjectId);
}

/** Returns the SVG drawing for a library object id, or null if not in library or no drawing (e.g. marble, star, table, phone). */
export function getObjectDrawing(id: string): ReactNode | null {
  if (!isObjectInLibrary(id)) return null;
  const Drawing = DRAWING_MAP[id as ObjectId];
  if (!Drawing) return null;
  return Drawing();
}

/** Drawing size: each object is drawn in [-20,-20] to [20,20]. */
const DRAWING_HALF_SIZE = 20;

export interface ObjectDrawingProps {
  /** Object id (e.g. from shape_classify objects or count_objects object). */
  objectId: string;
  /** Center x in parent coordinates. */
  x: number;
  /** Center y in parent coordinates. */
  y: number;
  /** Size of the drawn object (width and height). Default 32. */
  size?: number;
  /** Optional className for the wrapper g. */
  className?: string;
}

/**
 * Renders the simple SVG drawing of an object at (x, y). If objectId is not in the library or has no drawing, returns null so the caller can fall back to a generic shape.
 */
export function ObjectDrawing({ objectId, x, y, size = 32, className }: ObjectDrawingProps): ReactNode {
  const drawing = getObjectDrawing(objectId);
  if (drawing == null) return null;
  const scale = size / (2 * DRAWING_HALF_SIZE);
  return (
    <g
      className={className}
      transform={`translate(${x}, ${y}) scale(${scale})`}
      aria-label={objectId}
    >
      {drawing}
    </g>
  );
}
