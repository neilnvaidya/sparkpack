import type { CoinDisplayConfig } from '../types';

export interface CoinDisplayProps {
  config: CoinDisplayConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 320;
const COIN_R = 14;
const COIN_GAP = 8;
const ROW_GAP = 24;
const LABEL_GAP = 8;

/** UK coin labels to display (e.g. "1p", "2p", "5p", "10p", "20p", "50p", "£1"). */
function CoinSet({
  label,
  coins,
  x,
  y,
}: {
  label: string;
  coins: string[];
  x: number;
  y: number;
}) {
  let cx = x;
  return (
    <g>
      <text
        x={x}
        y={y - 4}
        fill="var(--sp-visual-text, #111827)"
        style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
      >
        {label}
      </text>
      {coins.map((coin, i) => {
        const pos = { cx, cy: y + COIN_R + LABEL_GAP };
        cx += COIN_R * 2 + COIN_GAP;
        return (
          <g key={`${coin}-${i}`}>
            <circle
              cx={pos.cx}
              cy={pos.cy}
              r={COIN_R}
              fill="var(--sp-visual-coin, #fcd34d)"
              stroke="var(--sp-visual-stroke, #b45309)"
              strokeWidth="1.5"
            />
            <text
              x={pos.cx}
              y={pos.cy + 4}
              textAnchor="middle"
              fill="var(--sp-visual-text, #111827)"
              style={{ fontSize: 10, fontFamily: 'system-ui, sans-serif' }}
            >
              {coin}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function CoinDisplay({ config, width = DEFAULT_WIDTH, className }: CoinDisplayProps) {
  const names = Object.keys(config.sets);
  const rowHeight = COIN_R * 2 + LABEL_GAP + 20 + ROW_GAP;
  const height = names.length * rowHeight + 16;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      {names.map((name, i) => (
        <CoinSet
          key={name}
          label={name}
          coins={config.sets[name]}
          x={24}
          y={24 + i * rowHeight + COIN_R + LABEL_GAP + 14}
        />
      ))}
    </svg>
  );
}
