import type { ObjectArrayConfig } from '../types';
import { ObjectDrawing, isObjectInLibrary } from '../objects';

export interface ObjectArrayProps {
  config: ObjectArrayConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 240;
const ITEM_R = 12;
const ITEM_SIZE = ITEM_R * 2;
const GAP = 16;
const GROUP_GAP = 24;

/** Single item: library object drawing if available, else circle. */
function Item({ x, y, object }: { x: number; y: number; object: string }) {
  if (isObjectInLibrary(object)) {
    return <ObjectDrawing objectId={object} x={x} y={y} size={ITEM_SIZE} />;
  }
  return (
    <circle
      cx={x}
      cy={y}
      r={ITEM_R}
      fill="var(--sp-visual-fill, #3b82f6)"
      stroke="var(--sp-visual-stroke, #1d4ed8)"
      strokeWidth="1"
      aria-label={object}
    />
  );
}

export function ObjectArray({ config, width = DEFAULT_WIDTH, className }: ObjectArrayProps) {
  const { groups, items_per_group, object } = config;
  const groupWidth = items_per_group * (ITEM_R * 2 + GAP) - GAP;
  const totalWidth = groups * groupWidth + (groups - 1) * GROUP_GAP;
  const w = Math.max(width, totalWidth + 48);
  const startX = (w - totalWidth) / 2 + groupWidth / 2 + ITEM_R;
  const cy = 24 + ITEM_R;

  return (
    <svg
      width={w}
      height={cy + ITEM_R * 2 + 16}
      viewBox={`0 0 ${w} ${cy + ITEM_R * 2 + 16}`}
      className={className}
      aria-hidden
    >
      {Array.from({ length: groups }).map((_, g) =>
        Array.from({ length: items_per_group }).map((_, i) => {
          const gx = startX + g * (groupWidth + GROUP_GAP);
          const x = gx - (items_per_group * (ITEM_R * 2 + GAP) - GAP) / 2 + ITEM_R + i * (ITEM_R * 2 + GAP);
          return <Item key={`${g}-${i}`} x={x} y={cy} object={object} />;
        })
      )}
    </svg>
  );
}
