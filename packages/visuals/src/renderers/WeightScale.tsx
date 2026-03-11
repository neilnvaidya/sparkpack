import type { WeightScaleConfig } from '../types';

export interface WeightScaleProps {
  config: WeightScaleConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 280;
const ROW_HEIGHT = 40;
const FONT_SIZE = 14;

export function WeightScale({ config, width = DEFAULT_WIDTH, className }: WeightScaleProps) {
  const { items, total } = config;
  const height = 24 + items.length * ROW_HEIGHT + 32;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      <text
        x={width / 2}
        y={18}
        textAnchor="middle"
        fill="var(--sp-visual-text, #111827)"
        style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
      >
        Total: {total}g
      </text>
      {items.map((item, i) => {
        const y = 24 + (i + 1) * ROW_HEIGHT;
        const valueStr = item.grams !== null ? `${item.grams}g` : '?';
        return (
          <g key={i}>
            <text
              x={24}
              y={y - 4}
              fill="var(--sp-visual-text, #374151)"
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
            >
              {item.label}
            </text>
            <text
              x={width - 24}
              y={y - 4}
              textAnchor="end"
              fill={item.grams !== null ? 'var(--sp-visual-text, #374151)' : 'var(--sp-visual-text, #9ca3af)'}
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
            >
              {valueStr}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
