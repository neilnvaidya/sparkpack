import type { BlockChartConfig } from '../types';

export interface BlockChartProps {
  config: BlockChartConfig;
  width?: number;
  className?: string;
}

const CELL = 24;
const LABEL_COL_WIDTH = 56;
const HEADER_HEIGHT = 24;
const FONT_SIZE = 12;

export function BlockChart({ config, width, className }: BlockChartProps) {
  const { title, rows } = config;
  const maxVal = Math.max(...rows.map((r) => r.value), 1);
  const cols = maxVal;
  const w = LABEL_COL_WIDTH + cols * CELL + 24;
  const h = HEADER_HEIGHT + rows.length * CELL + 24;
  const totalW = width != null ? Math.max(width, w) : w;

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      className={className}
      aria-hidden
    >
      {title && (
        <text
          x={totalW / 2}
          y={14}
          textAnchor="middle"
          fill="var(--sp-visual-text, #111827)"
          style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
        >
          {title}
        </text>
      )}
      {/* Top row: column labels 1, 2, 3, ... */}
      {Array.from({ length: cols }, (_, i) => i + 1).map((n) => (
        <text
          key={n}
          x={LABEL_COL_WIDTH + (n - 0.5) * CELL}
          y={title ? HEADER_HEIGHT + 16 : 16}
          textAnchor="middle"
          fill="var(--sp-visual-text, #6b7280)"
          style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
        >
          {n}
        </text>
      ))}
      {/* Rows: label in first column, then cells. For row being tested (given=false), no cells filled and no dashed hint. */}
      {rows.map((row, ri) => {
        const y = (title ? HEADER_HEIGHT : 0) + 24 + ri * CELL;
        const isTestRow = !row.given;
        const fillCount = isTestRow ? 0 : row.value;
        return (
          <g key={ri}>
            <text
              x={LABEL_COL_WIDTH - 8}
              y={y + CELL / 2 + 4}
              textAnchor="end"
              fill="var(--sp-visual-text, #374151)"
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
            >
              {row.label}
            </text>
            {Array.from({ length: cols }, (_, ci) => {
              const filled = ci < fillCount;
              const x = LABEL_COL_WIDTH + ci * CELL;
              return (
                <rect
                  key={ci}
                  x={x + 1}
                  y={y + 1}
                  width={CELL - 2}
                  height={CELL - 2}
                  fill={filled ? 'var(--sp-visual-fill, #3b82f6)' : 'var(--sp-visual-bg, #f3f4f6)'}
                  stroke="var(--sp-visual-stroke, #d1d5db)"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
