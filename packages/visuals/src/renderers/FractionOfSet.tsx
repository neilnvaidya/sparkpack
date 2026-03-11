import type { FractionOfSetConfig } from '../types';

export interface FractionOfSetProps {
  config: FractionOfSetConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 200;
const ITEM_R = 14;
const GAP = 12;
const FONT_SIZE = 18;

/** Simple car/item shape: circle (generic object). */
function SetItem({ x, y, filled }: { x: number; y: number; filled: boolean }) {
  return (
    <circle
      cx={x}
      cy={y}
      r={ITEM_R}
      fill={filled ? 'var(--sp-visual-fill, #3b82f6)' : 'var(--sp-visual-bg, #e5e7eb)'}
      stroke="var(--sp-visual-stroke, #6b7280)"
      strokeWidth="1"
    />
  );
}

export function FractionOfSet({ config, width = DEFAULT_WIDTH, className }: FractionOfSetProps) {
  const { fraction, items_shown, object } = config;
  const total = items_shown; // shown subset; fraction describes proportion (e.g. 1/2 of 8 = 4 shown)
  const num = fraction.split('/')[0];
  const den = fraction.split('/')[1];
  const filledCount = den ? Math.round((parseInt(num, 10) / parseInt(den, 10)) * total) : 0;
  const perRow = 4;
  const startX = (width - perRow * (ITEM_R * 2 + GAP) + GAP) / 2 + ITEM_R;
  const cy = 32 + ITEM_R;

  return (
    <svg
      width={width}
      height={90}
      viewBox={`0 0 ${width} 90`}
      className={className}
      aria-hidden
    >
      <text
        x={width / 2}
        y={20}
        textAnchor="middle"
        fill="var(--sp-visual-text, #111827)"
        style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
      >
        {fraction} of {object}s
      </text>
      {Array.from({ length: total }).map((_, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const x = startX + col * (ITEM_R * 2 + GAP);
        const y = cy + row * (ITEM_R * 2 + GAP);
        return (
          <SetItem key={i} x={x} y={y} filled={i < filledCount} />
        );
      })}
    </svg>
  );
}
