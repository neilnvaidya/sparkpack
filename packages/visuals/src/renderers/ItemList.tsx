import type { ItemListConfig } from '../types';

export interface ItemListProps {
  config: ItemListConfig;
  width?: number;
  className?: string;
}

const ITEM_GAP = 24;
const BOX_PAD = 14;
const FONT_SIZE = 18;
const PAD = 24;
const ROW_HEIGHT = 32 + BOX_PAD * 2;

export function ItemList({ config, width, className }: ItemListProps) {
  const { items, title } = config;
  const boxWidths = items.map((item) => Math.max(44, String(item).length * 16 + BOX_PAD * 2));
  const rowW = boxWidths.reduce((a, w) => a + w, 0) + (items.length - 1) * ITEM_GAP;
  const totalW = width ?? Math.max(320, rowW + PAD * 2);
  const startX = (totalW - rowW) / 2;
  let x = startX;
  let y = PAD;
  const elements: React.ReactNode[] = [];
  if (title) {
    elements.push(
      <text key="title" x={totalW / 2} y={y + 16} textAnchor="middle" fill="var(--sp-visual-text, #111827)" style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}>
        {title}
      </text>
    );
    y += 36;
  }
  items.forEach((item, i) => {
    const text = String(item);
    const boxW = boxWidths[i];
    elements.push(
      <g key={i}>
        <rect
          x={x}
          y={y}
          width={boxW}
          height={ROW_HEIGHT}
          rx={6}
          fill="var(--sp-visual-bg, #f9fafb)"
          stroke="var(--sp-visual-stroke, #d1d5db)"
          strokeWidth="1.5"
        />
        <text
          x={x + boxW / 2}
          y={y + ROW_HEIGHT / 2 + 5}
          textAnchor="middle"
          fill="var(--sp-visual-text, #111827)"
          style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
        >
          {text}
        </text>
      </g>
    );
    x += boxW + ITEM_GAP;
  });
  const totalH = y + ROW_HEIGHT + PAD;
  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} className={className} aria-hidden>
      {elements}
    </svg>
  );
}
