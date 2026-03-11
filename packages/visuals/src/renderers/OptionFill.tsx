import type { OptionFillConfig, OptionFillRow } from '../types';

export interface OptionFillProps {
  config: OptionFillConfig;
  width?: number;
  className?: string;
}

const BOX = 36;
const OPTION_GAP = 8;
const ROW_GAP = 14;
const FONT_SIZE = 16;
const OPTIONS_ROW_H = 44;
const NUM_GAP = 24;
const EQ_GAP = 12;

export function OptionFill({ config, width, className }: OptionFillProps) {
  const { options, rows } = config;
  const hasOperator = rows.some((r) => r.type === 'operator');
  const pairRowH = BOX + ROW_GAP;
  const totalH = OPTIONS_ROW_H + rows.length * pairRowH + 16;

  const optionsWidth = options.length * BOX + (options.length - 1) * OPTION_GAP;
  const numCell = 36;
  const rowContentWidth = (r: OptionFillRow) => {
    const base = numCell + NUM_GAP + BOX + NUM_GAP + numCell;
    if (r.type === 'operator') return base + EQ_GAP + 16 + EQ_GAP + numCell;
    return base;
  };
  const maxRowWidth = rows.length ? Math.max(...rows.map(rowContentWidth)) : 0;
  const totalW = width ?? Math.max(280, Math.max(optionsWidth, maxRowWidth) + 48);

  const optionsStartX = (totalW - optionsWidth) / 2;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      className={className}
      aria-hidden
    >
      {/* Top row: options in boxes, centered */}
      {options.map((opt, i) => {
        const x = optionsStartX + i * (BOX + OPTION_GAP);
        return (
          <g key={i}>
            <rect
              x={x}
              y={8}
              width={BOX}
              height={BOX}
              fill="var(--sp-visual-bg, #f9fafb)"
              stroke="var(--sp-visual-stroke, #374151)"
              strokeWidth="1.5"
            />
            <text
              x={x + BOX / 2}
              y={8 + BOX / 2 + 5}
              textAnchor="middle"
              fill="var(--sp-visual-text, #111827)"
              style={{ fontSize: 18, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
            >
              {opt}
            </text>
          </g>
        );
      })}
      {/* Rows: left [blank] right  or  left [blank] right = result, each row centered */}
      {rows.map((row: OptionFillRow, ri) => {
        const y = OPTIONS_ROW_H + 8 + ri * pairRowH;
        const isOperator = row.type === 'operator';
        const contentW = rowContentWidth(row);
        const rowStartX = (totalW - contentW) / 2;
        const blankX = rowStartX + numCell + NUM_GAP;
        const leftNumX = rowStartX + numCell / 2;
        const rightNumX = blankX + BOX + NUM_GAP + numCell / 2;
        const baseW = numCell + NUM_GAP + BOX + NUM_GAP + numCell;
        const eqX = isOperator ? rowStartX + baseW + EQ_GAP + 8 : 0;
        const resultX = isOperator ? rowStartX + baseW + EQ_GAP + 16 + EQ_GAP + numCell / 2 : 0;
        return (
          <g key={ri}>
            <text x={leftNumX} y={y + BOX / 2 + 5} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
              {row.left}
            </text>
            <rect
              x={blankX}
              y={y}
              width={BOX}
              height={BOX}
              fill="none"
              stroke="var(--sp-visual-stroke, #9ca3af)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x={rightNumX} y={y + BOX / 2 + 5} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
              {row.right}
            </text>
            {isOperator && (
              <>
                <text x={eqX} y={y + BOX / 2 + 5} textAnchor="middle" fill="var(--sp-visual-text, #6b7280)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
                  =
                </text>
                <text x={resultX} y={y + BOX / 2 + 5} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
                  {row.result}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
