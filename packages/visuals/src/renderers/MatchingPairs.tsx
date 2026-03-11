import type { MatchingPairsConfig } from '../types';

export interface MatchingPairsProps {
  config: MatchingPairsConfig;
  width?: number;
  className?: string;
}

const PAD = 32;
const BOX_HEIGHT = 44;
const ROW_GAP = 20;
const LEFT_BOX_WIDTH = 200;
const COLUMN_GAP = 72;
const RIGHT_BOX_WIDTH = 72;
const LEFT_X = PAD;
const RIGHT_X = LEFT_X + LEFT_BOX_WIDTH + COLUMN_GAP;
const FONT_SIZE = 18;
const DEFAULT_WIDTH = RIGHT_X + RIGHT_BOX_WIDTH + PAD;

export function MatchingPairs({ config, width = DEFAULT_WIDTH, className }: MatchingPairsProps) {
  const { left, right, correct, example_pair, layout } = config;
  const useCompact = layout === 'compact' || (layout !== 'spaced' && left.length === right.length);
  const count = useCompact ? left.length : right.length;
  const rowHeight = BOX_HEIGHT + ROW_GAP;
  const height = PAD + count * rowHeight - ROW_GAP + PAD;

  /* compact: 1:1 grid left[i] and right[i] on same row. spaced: left items every other row (left[i] at row i*2). */
  const leftRow = (i: number) => (useCompact ? i : i * 2);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      {/* Left column: written numbers in boxes, one every other row (skip a row between each) */}
      {left.map((text, i) => {
        const row = leftRow(i);
        const y = PAD + row * rowHeight;
        return (
          <g key={`l-${i}`}>
            <rect
              x={LEFT_X}
              y={y}
              width={LEFT_BOX_WIDTH}
              height={BOX_HEIGHT}
              rx={6}
              fill="var(--sp-visual-bg, #fff)"
              stroke="var(--sp-visual-stroke, #374151)"
              strokeWidth="2"
            />
            <text
              x={LEFT_X + LEFT_BOX_WIDTH / 2}
              y={y + BOX_HEIGHT / 2 + 6}
              textAnchor="middle"
              fill="var(--sp-visual-text, #111827)"
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
            >
              {text}
            </text>
          </g>
        );
      })}
      {/* Right column: numerals in a box per row, aligned to grid */}
      {right.map((text, i) => {
        const y = PAD + i * rowHeight;
        return (
          <g key={`r-${i}`}>
            <rect
              x={RIGHT_X}
              y={y}
              width={RIGHT_BOX_WIDTH}
              height={BOX_HEIGHT}
              rx={6}
              fill="var(--sp-visual-bg, #fff)"
              stroke="var(--sp-visual-stroke, #374151)"
              strokeWidth="2"
            />
            <text
              x={RIGHT_X + RIGHT_BOX_WIDTH / 2}
              y={y + BOX_HEIGHT / 2 + 6}
              textAnchor="middle"
              fill="var(--sp-visual-text, #111827)"
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}
            >
              {text}
            </text>
          </g>
        );
      })}
      {/* Example pair connection: left box right edge to right box left edge */}
      {example_pair != null && correct[example_pair] != null && (() => {
        const li = left.indexOf(example_pair);
        const rLabel = correct[example_pair];
        const ri = right.indexOf(rLabel);
        if (li === -1 || ri === -1) return null;
        const y1 = PAD + leftRow(li) * rowHeight + BOX_HEIGHT / 2;
        const y2 = PAD + ri * rowHeight + BOX_HEIGHT / 2;
        const x1 = LEFT_X + LEFT_BOX_WIDTH;
        const x2 = RIGHT_X;
        return (
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--sp-visual-stroke, #6b7280)"
            strokeWidth="2"
            strokeDasharray="8 5"
          />
        );
      })()}
    </svg>
  );
}
