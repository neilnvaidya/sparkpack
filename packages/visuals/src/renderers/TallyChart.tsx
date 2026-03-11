import type { TallyChartConfig } from '../types';

export interface TallyChartProps {
  config: TallyChartConfig;
  width?: number;
  className?: string;
}

const PAD = 24;
const ROW_HEIGHT = 40;
const HEADER_ROW = 28;
const TITLE_TO_TABLE_GAP = 20; /* extra space between title baseline and table header when title present */
const COL_OBJECT = 100;
const COL_TALLY = 140;
const COL_COUNT = 56;
const TALLY_CELL_W = 100;
const TALLY_MARK_H = 18;
const FONT_SIZE = 14;

/** Draw tally marks: 4 vertical + 1 diagonal per group of 5. */
function TallyMarks({ value, x, y, given }: { value: number; x: number; y: number; given: boolean }) {
  const stroke = given ? 'var(--sp-visual-stroke, #374151)' : 'var(--sp-visual-stroke, #d1d5db)';
  const elements: React.ReactNode[] = [];
  const vGap = 5;
  let cx = x;
  const displayVal = given ? value : 0;
  const fullGroups = Math.floor(displayVal / 5);
  const remainder = displayVal % 5;
  for (let g = 0; g < fullGroups; g++) {
    for (let i = 0; i < 4; i++) {
      elements.push(
        <line key={`${g}-v-${i}`} x1={cx + i * vGap} y1={y} x2={cx + i * vGap} y2={y - TALLY_MARK_H} stroke={stroke} strokeWidth="2" />
      );
    }
    elements.push(
      <line key={`${g}-d`} x1={cx - 2} y1={y - TALLY_MARK_H} x2={cx + 4 * vGap + 2} y2={y} stroke={stroke} strokeWidth="2" />
    );
    cx += 4 * vGap + 10;
  }
  for (let i = 0; i < remainder; i++) {
    elements.push(
      <line key={`r-${i}`} x1={cx + i * vGap} y1={y} x2={cx + i * vGap} y2={y - TALLY_MARK_H} stroke={stroke} strokeWidth="2" />
    );
  }
  if (!given) {
    elements.push(
      <rect key="blank" x={x} y={y - TALLY_MARK_H} width={TALLY_CELL_W} height={TALLY_MARK_H + 4} fill="none" stroke="var(--sp-visual-stroke, #d1d5db)" strokeWidth="1" strokeDasharray="4 2" />
    );
  }
  return <g>{elements}</g>;
}

const DEFAULT_WIDTH = PAD + COL_OBJECT + COL_TALLY + COL_COUNT + PAD;

const TITLE_FONT_SIZE = 14;
const TITLE_BASELINE = PAD - 6; /* 18px from top */

export function TallyChart({ config, width = DEFAULT_WIDTH, className }: TallyChartProps) {
  const { title, rows } = config;
  const tableTop = title ? TITLE_BASELINE + TITLE_FONT_SIZE + TITLE_TO_TABLE_GAP : HEADER_ROW;
  const height = PAD + tableTop + rows.length * ROW_HEIGHT + PAD;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      {title && (
        <text x={width / 2} y={TITLE_BASELINE} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: TITLE_FONT_SIZE, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
          {title}
        </text>
      )}
      {/* Table header */}
      <text x={COL_OBJECT / 2} y={tableTop - 8} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        Object
      </text>
      <text x={COL_OBJECT + COL_TALLY / 2} y={tableTop - 8} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        Tallies
      </text>
      <text x={COL_OBJECT + COL_TALLY + COL_COUNT / 2} y={tableTop - 8} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: FONT_SIZE, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        Count
      </text>
      <line x1={PAD} y1={tableTop} x2={width - PAD} y2={tableTop} stroke="var(--sp-visual-stroke, #374151)" strokeWidth="1" />
      {/* Data rows */}
      {rows.map((row, i) => {
        const baseY = tableTop + 12 + i * ROW_HEIGHT;
        const labelY = baseY + ROW_HEIGHT / 2 + 4;
        const tallyY = baseY + ROW_HEIGHT / 2 + 4;
        return (
          <g key={i}>
            <text x={COL_OBJECT / 2} y={labelY} textAnchor="middle" fill="var(--sp-visual-text, #374151)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
              {row.label}
            </text>
            <TallyMarks value={row.value} x={COL_OBJECT + (COL_TALLY - TALLY_CELL_W) / 2} y={tallyY} given={row.blank !== 'tally'} />
            {row.blank !== 'count' ? (
              <text x={COL_OBJECT + COL_TALLY + COL_COUNT / 2} y={labelY} textAnchor="middle" fill="var(--sp-visual-text, #374151)" style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
                {row.value}
              </text>
            ) : (
              <rect x={COL_OBJECT + COL_TALLY + COL_COUNT / 2 - 14} y={labelY - 12} width={28} height={20} fill="none" stroke="var(--sp-visual-stroke, #d1d5db)" strokeWidth="1" strokeDasharray="3 2" />
            )}
          </g>
        );
      })}
    </svg>
  );
}
