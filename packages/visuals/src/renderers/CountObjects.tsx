import type { CountObjectsConfig } from '../types';
import { ObjectDrawing, isObjectInLibrary } from '../objects';

export interface CountObjectsProps {
  config: CountObjectsConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 280;
const ITEM_SIZE = 28;
const GAP = 12;
const GROUP_GAP = 24;

/** Object in scene: library drawing if available, else generic circle. */
function CountObject({ x, y, object }: { x: number; y: number; object: string }) {
  if (isObjectInLibrary(object)) {
    return <ObjectDrawing objectId={object} x={x} y={y} size={ITEM_SIZE} />;
  }
  return (
    <g transform={`translate(${x}, ${y})`} aria-label={object}>
      <circle
        cx={0}
        cy={0}
        r={ITEM_SIZE / 2 - 2}
        fill="var(--sp-visual-fill, #dc2626)"
        stroke="var(--sp-visual-stroke, #991b1b)"
        strokeWidth="1"
      />
    </g>
  );
}

export function CountObjects({ config, width = DEFAULT_WIDTH, className }: CountObjectsProps) {
  const { groups } = config;
  const cy = 24 + ITEM_SIZE / 2;
  let offsetX = 24;

  return (
    <svg
      width={width}
      height={cy + ITEM_SIZE / 2 + 16}
      viewBox={`0 0 ${width} ${cy + ITEM_SIZE / 2 + 16}`}
      className={className}
      aria-hidden
    >
      {groups.map((grp, gi) => {
        const items: React.ReactNode[] = [];
        for (let i = 0; i < grp.count; i++) {
          const x = offsetX + i * (ITEM_SIZE + GAP);
          items.push(
            <CountObject
              key={i}
              x={x + ITEM_SIZE / 2}
              y={cy}
              object={grp.object}
            />
          );
        }
        const groupW = grp.count * (ITEM_SIZE + GAP) - GAP;
        const g = <g key={gi}>{items}</g>;
        offsetX += groupW + GROUP_GAP;
        return g;
      })}
    </svg>
  );
}
