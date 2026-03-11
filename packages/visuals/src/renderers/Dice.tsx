import type { DiceConfig } from '../types';

export interface DiceProps {
  config: DiceConfig;
  width?: number;
  className?: string;
}

const DEFAULT_SIZE = 96;
const PAD = 12;
const DOT_R = 6;

function Dot({ cx, cy }: { cx: number; cy: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={DOT_R}
      fill="var(--sp-visual-fill, #111827)"
    />
  );
}

/** Renders dots for face value 1–6. */
function FaceDots({ value, size }: { value: number; size: number }) {
  const mid = size / 2;
  const off = size / 4;
  const dots: { cx: number; cy: number }[] = [];
  if (value === 1) dots.push({ cx: mid, cy: mid });
  if (value === 2) {
    dots.push({ cx: mid - off, cy: mid - off });
    dots.push({ cx: mid + off, cy: mid + off });
  }
  if (value === 3) {
    dots.push({ cx: mid - off, cy: mid - off });
    dots.push({ cx: mid, cy: mid });
    dots.push({ cx: mid + off, cy: mid + off });
  }
  if (value === 4) {
    dots.push({ cx: mid - off, cy: mid - off });
    dots.push({ cx: mid + off, cy: mid - off });
    dots.push({ cx: mid - off, cy: mid + off });
    dots.push({ cx: mid + off, cy: mid + off });
  }
  if (value === 5) {
    dots.push({ cx: mid - off, cy: mid - off });
    dots.push({ cx: mid + off, cy: mid - off });
    dots.push({ cx: mid, cy: mid });
    dots.push({ cx: mid - off, cy: mid + off });
    dots.push({ cx: mid + off, cy: mid + off });
  }
  if (value === 6) {
    dots.push({ cx: mid - off, cy: mid - off });
    dots.push({ cx: mid + off, cy: mid - off });
    dots.push({ cx: mid - off, cy: mid });
    dots.push({ cx: mid + off, cy: mid });
    dots.push({ cx: mid - off, cy: mid + off });
    dots.push({ cx: mid + off, cy: mid + off });
  }
  return (
    <>
      {dots.map((d, i) => (
        <Dot key={i} cx={PAD + d.cx} cy={PAD + d.cy} />
      ))}
    </>
  );
}

const BOX_SIZE = 32;
const BOX_GAP = 12;
const DIE_COLUMN_GAP = 24;

export function Dice({ config, width = DEFAULT_SIZE, className }: DiceProps) {
  const value = Math.max(1, Math.min(6, config.value));
  const size = width - PAD * 2;
  const options = config.number_options ?? [];
  const hasOptions = options.length > 0;
  const optionsColumnHeight = hasOptions ? options.length * BOX_SIZE + (options.length - 1) * BOX_GAP : 0;
  const totalWidth = hasOptions ? width + DIE_COLUMN_GAP + BOX_SIZE : width;
  const totalHeight = Math.max(width, optionsColumnHeight);

  const dieY = hasOptions ? (totalHeight - width) / 2 : 0;

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={className}
      aria-hidden
    >
      <g transform={`translate(0, ${dieY})`}>
        <rect
          x={2}
          y={2}
          width={width - 4}
          height={width - 4}
          rx={10}
          fill="var(--sp-visual-bg, #fefce8)"
          stroke="var(--sp-visual-stroke, #374151)"
          strokeWidth="2"
        />
        <FaceDots value={value} size={size} />
      </g>
      {hasOptions && (
        <g transform={`translate(${width + DIE_COLUMN_GAP}, ${(totalHeight - optionsColumnHeight) / 2})`}>
          {options.map((n, i) => {
            const y = i * (BOX_SIZE + BOX_GAP);
            return (
              <g key={n}>
                <rect
                  x={0}
                  y={y}
                  width={BOX_SIZE}
                  height={BOX_SIZE}
                  rx={4}
                  fill="var(--sp-visual-bg, #fff)"
                  stroke="var(--sp-visual-stroke, #374151)"
                  strokeWidth="2"
                />
                <text
                  x={BOX_SIZE / 2}
                  y={y + BOX_SIZE / 2 + 5}
                  textAnchor="middle"
                  fill="var(--sp-visual-text, #111827)"
                  style={{ fontSize: 16, fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}
                >
                  {n}
                </text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
}
