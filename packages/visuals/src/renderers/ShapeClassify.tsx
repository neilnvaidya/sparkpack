import type { ShapeClassifyConfig } from '../types';
import { ObjectDrawing, isObjectInLibrary } from '../objects';

export interface ShapeClassifyProps {
  config: ShapeClassifyConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 320;
const ROW_HEIGHT = 44;
const BOX_SIZE = 32;
const FONT_SIZE = 13;

/** Simple 3D-ish box for cuboid, cylinder, cone (fallback when object has no library icon). */
function ShapeIcon({ kind, x, y }: { kind: string; x: number; y: number }) {
  const s = BOX_SIZE / 2;
  switch (kind.toLowerCase()) {
    case 'cuboid':
      return (
        <g transform={`translate(${x}, ${y})`}>
          <path
            d={`M ${-s} ${s} L ${-s} ${-s} L ${s} ${-s} L ${s} ${s} Z`}
            fill="var(--sp-visual-bg, #e5e7eb)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${s} ${s} L ${s} ${-s} L ${s + 8} ${-s + 6} L ${s + 8} ${s + 6} Z`}
            fill="var(--sp-visual-fill, #d1d5db)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1.5"
          />
          <path
            d={`M ${-s} ${s} L ${s} ${s} L ${s + 8} ${s + 6} L ${-s + 8} ${s + 6} Z`}
            fill="var(--sp-visual-fill, #9ca3af)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1.5"
          />
        </g>
      );
    case 'cylinder':
      return (
        <g transform={`translate(${x}, ${y})`}>
          <ellipse cx={0} cy={-s + 4} rx={s} ry={6} fill="var(--sp-visual-bg, #e5e7eb)" stroke="var(--sp-visual-stroke, #374151)" strokeWidth="1.5" />
          <path
            d={`M ${-s} ${-s + 4} L ${-s} ${s - 4} Q ${-s} ${s + 4} 0 ${s + 4} Q ${s} ${s + 4} ${s} ${s - 4} L ${s} ${-s + 4}`}
            fill="none"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1.5"
          />
        </g>
      );
    case 'cone':
      return (
        <g transform={`translate(${x}, ${y})`}>
          <path
            d={`M 0 ${-s} L ${s} ${s} L ${-s} ${s} Z`}
            fill="var(--sp-visual-bg, #e5e7eb)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1.5"
          />
        </g>
      );
    default:
      return (
        <rect
          x={x - s}
          y={y - s}
          width={BOX_SIZE}
          height={BOX_SIZE}
          fill="var(--sp-visual-bg, #e5e7eb)"
          stroke="var(--sp-visual-stroke, #374151)"
          strokeWidth="1.5"
        />
      );
  }
}

/** First column: show library object drawing if available, else shape-by-category. */
function ObjectCell({ objectId, category, x, y }: { objectId: string; category: string; x: number; y: number }) {
  if (isObjectInLibrary(objectId)) {
    return <ObjectDrawing objectId={objectId} x={x} y={y} size={BOX_SIZE} />;
  }
  return <ShapeIcon kind={category} x={x} y={y} />;
}

const COL_OBJECT = 80;
const COL_CATEGORY = 64;
const HEADER_ROW = 28;
const TABLE_FONT = 12;

export function ShapeClassify({ config, width = DEFAULT_WIDTH, className }: ShapeClassifyProps) {
  const { objects, categories, correct } = config;
  const numRows = objects.length + 1;
  const height = HEADER_ROW + numRows * ROW_HEIGHT;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      {/* Table header: Object | Cuboid | Cylinder | Cone */}
      <text x={COL_OBJECT / 2} y={18} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: TABLE_FONT, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        Object
      </text>
      {categories.filter((c, i, a) => a.indexOf(c) === i).map((cat, ci) => (
        <text
          key={cat}
          x={COL_OBJECT + (ci + 0.5) * COL_CATEGORY}
          y={18}
          textAnchor="middle"
          fill="var(--sp-visual-text, #111827)"
          style={{ fontSize: TABLE_FONT, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </text>
      ))}
      {/* Header underline */}
      <line x1={0} y1={HEADER_ROW} x2={width} y2={HEADER_ROW} stroke="var(--sp-visual-stroke, #374151)" strokeWidth="1" />
      {/* Data rows: object icon in first column. Only first row gets a tick as example; other rows empty boxes only. */}
      {objects.map((obj, ri) => {
        const cat = correct[obj] ?? '';
        const y = HEADER_ROW + (ri + 0.5) * ROW_HEIGHT;
        const uniqueCats = categories.filter((c, i, a) => a.indexOf(c) === i);
        const showExampleTick = ri === 0;
        return (
          <g key={obj}>
            <ObjectCell objectId={obj} category={cat} x={COL_OBJECT / 2} y={y} />
            {uniqueCats.map((c, ci) => {
              const tick = showExampleTick && c === cat;
              const cx = COL_OBJECT + (ci + 0.5) * COL_CATEGORY;
              return (
                <g key={c}>
                  {tick ? (
                    <text x={cx} y={y + 4} textAnchor="middle" fill="var(--sp-visual-text, #059669)" style={{ fontSize: 16, fontFamily: 'system-ui, sans-serif' }}>✓</text>
                  ) : (
                    <rect x={cx - 10} y={y - 10} width={20} height={20} fill="none" stroke="var(--sp-visual-stroke, #d1d5db)" strokeWidth="1" />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
