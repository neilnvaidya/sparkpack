import type { ShapeGridConfig } from '../types';

export interface ShapeGridProps {
  config: ShapeGridConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 280;
const CELL = 56;
const SHAPE_SIZE = 24;

function getShapePath(shape: string, cx: number, cy: number, size: number): string {
  const s = size / 2;
  switch (shape.toLowerCase()) {
    case 'triangle':
      return `M ${cx} ${cy - s} L ${cx + s} ${cy + s} L ${cx - s} ${cy + s} Z`;
    case 'square':
      return `M ${cx - s} ${cy - s} h ${size} v ${size} h ${-size} Z`;
    case 'pentagon': {
      const points = Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        return `${cx + s * Math.cos(a)} ${cy + s * Math.sin(a)}`;
      });
      return `M ${points.join(' L ')} Z`;
    }
    case 'hexagon': {
      const points = Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * 2 * Math.PI - Math.PI / 6;
        return `${cx + s * Math.cos(a)} ${cy + s * Math.sin(a)}`;
      });
      return `M ${points.join(' L ')} Z`;
    }
    case 'rhombus':
      return `M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z`;
    default:
      return `M ${cx - s} ${cy - s} h ${size} v ${size} h ${-size} Z`;
  }
}

export function ShapeGrid({ config, width = DEFAULT_WIDTH, className }: ShapeGridProps) {
  const { shapes } = config;
  const cols = Math.ceil(Math.sqrt(shapes.length));
  const rows = Math.ceil(shapes.length / cols);
  const w = cols * CELL;
  const h = rows * CELL;
  const totalW = Math.max(width, w + 32);
  const totalH = h + 32;
  const offsetX = (totalW - w) / 2 + CELL / 2;
  const offsetY = 24 + CELL / 2;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      className={className}
      aria-hidden
    >
      {shapes.map((shape, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = offsetX + col * CELL;
        const cy = offsetY + row * CELL;
        const d = getShapePath(shape, cx, cy, SHAPE_SIZE);
        return (
          <path
            key={i}
            d={d}
            fill="var(--sp-visual-bg, #f3f4f6)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="2"
          />
        );
      })}
    </svg>
  );
}
