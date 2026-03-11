import type { NumberPatternConfig, NumberPatternEquationRow } from '../types';

export interface NumberPatternProps {
  config: NumberPatternConfig;
  width?: number;
  className?: string;
}

const PAD = 24;
const SEQ_GAP = 32;
const SEQ_FONT_SIZE = 22;
const EQ_ROW_HEIGHT = 36;
const EQ_CELL_WIDTH = 40;
const EQ_BOX_SIZE = 32;
const EQ_GAP = 12;
const EQ_FONT_SIZE = 16;

/** Sequence form: pattern in a row, large elements, no boxes, clear spacing. */
function SequenceForm({
  items,
  title,
  rule,
  totalW,
}: {
  items: (number | string)[];
  title?: string;
  rule?: string;
  totalW: number;
}) {
  const elements: React.ReactNode[] = [];
  let y = PAD;
  if (title) {
    elements.push(
      <text key="title" x={totalW / 2} y={y + 16} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        {title}
      </text>
    );
    y += 36;
  }
  if (rule) {
    elements.push(
      <text key="rule" x={totalW / 2} y={y + 12} textAnchor="middle" fill="var(--sp-visual-text, #6b7280)" style={{ fontSize: 12, fontFamily: 'system-ui, sans-serif' }}>
        {rule}
      </text>
    );
    y += 24;
  }
  const totalItemW = items.reduce((acc: number, item) => acc + String(item).length * 14 + SEQ_GAP, 0) - SEQ_GAP;
  let x = (totalW - totalItemW) / 2;
  items.forEach((item, i) => {
    const text = String(item);
    const w = text.length * 14;
    elements.push(
      <text key={i} x={x + w / 2} y={y + SEQ_FONT_SIZE / 2 + 6} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: SEQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>
        {text}
      </text>
    );
    x += w + SEQ_GAP;
  });
  return { elements, height: y + SEQ_FONT_SIZE + PAD };
}

/** Equations form: rows vertically aligned, blanks as empty boxes. Columns: first | op | second | = | result. */
function EquationsForm({
  rows,
  title,
  totalW,
}: {
  rows: NumberPatternEquationRow[];
  title?: string;
  totalW: number;
}) {
  const W = EQ_CELL_WIDTH;
  const G = EQ_GAP;
  const opW = 20;
  const eqW = 16;
  const contentW = W + G + opW + G + W + G + eqW + G + W;
  const startX = (totalW - contentW) / 2;
  const c1 = startX;
  const c2 = startX + W + G;
  const c3 = startX + W + G + opW + G;
  const c4 = startX + 2 * W + 2 * G + opW;
  const c5 = startX + 2 * W + 2 * G + opW + eqW + G;

  const elements: React.ReactNode[] = [];
  let y = PAD;
  if (title) {
    elements.push(
      <text key="title" x={totalW / 2} y={y + 16} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        {title}
      </text>
    );
    y += 36;
  }
  rows.forEach((row, ri) => {
    const baseY = y + ri * EQ_ROW_HEIGHT;
    const midY = baseY + EQ_ROW_HEIGHT / 2 + 4;
    if (row.first !== null) {
      elements.push(<text key={`${ri}-first`} x={c1 + EQ_CELL_WIDTH / 2} y={midY} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: EQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>{row.first}</text>);
    } else {
      elements.push(<rect key={`${ri}-first`} x={c1 + (EQ_CELL_WIDTH - EQ_BOX_SIZE) / 2} y={baseY + (EQ_ROW_HEIGHT - EQ_BOX_SIZE) / 2} width={EQ_BOX_SIZE} height={EQ_BOX_SIZE} fill="none" stroke="var(--sp-visual-stroke, #9ca3af)" strokeWidth="1.5" strokeDasharray="4 2" />);
    }
    elements.push(<text key={`${ri}-op`} x={c2 + 12} y={midY} textAnchor="middle" fill="var(--sp-visual-text, #374151)" style={{ fontSize: EQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>{row.op}</text>);
    if (row.second !== null) {
      elements.push(<text key={`${ri}-second`} x={c3 + EQ_CELL_WIDTH / 2} y={midY} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: EQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>{row.second}</text>);
    } else {
      elements.push(<rect key={`${ri}-second`} x={c3 + (EQ_CELL_WIDTH - EQ_BOX_SIZE) / 2} y={baseY + (EQ_ROW_HEIGHT - EQ_BOX_SIZE) / 2} width={EQ_BOX_SIZE} height={EQ_BOX_SIZE} fill="none" stroke="var(--sp-visual-stroke, #9ca3af)" strokeWidth="1.5" strokeDasharray="4 2" />);
    }
    elements.push(<text key={`${ri}-eq`} x={c4 + 8} y={midY} textAnchor="middle" fill="var(--sp-visual-text, #6b7280)" style={{ fontSize: EQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>=</text>);
    if (row.result !== null) {
      elements.push(<text key={`${ri}-result`} x={c5 + EQ_CELL_WIDTH / 2} y={midY} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: EQ_FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}>{row.result}</text>);
    } else {
      elements.push(<rect key={`${ri}-result`} x={c5 + (EQ_CELL_WIDTH - EQ_BOX_SIZE) / 2} y={baseY + (EQ_ROW_HEIGHT - EQ_BOX_SIZE) / 2} width={EQ_BOX_SIZE} height={EQ_BOX_SIZE} fill="none" stroke="var(--sp-visual-stroke, #9ca3af)" strokeWidth="1.5" strokeDasharray="4 2" />);
    }
  });
  const totalH = y + rows.length * EQ_ROW_HEIGHT + PAD;
  return { elements, height: totalH };
}

export function NumberPattern({ config, width, className }: NumberPatternProps) {
  const isSequence = config.variant === 'sequence';
  const isEquations = config.variant === 'equations';

  const totalW = width ?? 420;
  let result: { elements: React.ReactNode[]; height: number };

  if (isEquations && 'rows' in config) {
    result = EquationsForm({ rows: config.rows, title: config.title, totalW });
  } else if (isSequence && 'items' in config) {
    result = SequenceForm({ items: config.items, title: config.title, rule: config.rule, totalW });
  } else {
    const c = config as { items?: (number | string)[]; title?: string; rule?: string };
    result = SequenceForm({ items: c.items ?? [], title: c.title, rule: c.rule, totalW });
  }

  return (
    <svg width={totalW} height={result.height} viewBox={`0 0 ${totalW} ${result.height}`} className={className} aria-hidden>
      {result.elements}
    </svg>
  );
}
