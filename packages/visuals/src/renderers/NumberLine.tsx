import type { NumberLineConfig } from '../types';

export interface NumberLineProps {
  config: NumberLineConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 400;
const LINE_Y = 24;
const TICK_HEIGHT = 8;
const LABEL_OFFSET = 4;
/** Triangle marker (tip down) for "blank" position: height ~same as number labels. */
const TRIANGLE_H = 14;
const TRIANGLE_W = 16;

export function NumberLine({ config, width = DEFAULT_WIDTH, className }: NumberLineProps) {
  const { min, max, interval, labelled, blank } = config;
  const range = max - min;
  const step = interval;
  const ticks: number[] = [];
  for (let v = min; v <= max; v += step) ticks.push(v);

  const x = (value: number) => {
    const t = (value - min) / range;
    return 24 + t * (width - 48);
  };

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      className={className}
      style={{ overflow: 'visible' }}
      aria-hidden
    >
      <line
        x1={24}
        y1={LINE_Y}
        x2={width - 24}
        y2={LINE_Y}
        stroke="var(--sp-visual-stroke, #374151)"
        strokeWidth="2"
      />
      {ticks.map((v) => {
        const isLabelled = labelled.includes(v);
        const isBlank = blank.includes(v);
        const cx = x(v);
        return (
          <g key={v}>
            <line
              x1={cx}
              y1={LINE_Y}
              x2={cx}
              y2={LINE_Y + TICK_HEIGHT}
              stroke="var(--sp-visual-stroke, #374151)"
              strokeWidth="2"
            />
            {isLabelled && (
              <text
                x={cx}
                y={LINE_Y + TICK_HEIGHT + LABEL_OFFSET + 12}
                textAnchor="middle"
                fill="var(--sp-visual-text, #111827)"
                style={{ fontSize: 14, fontFamily: 'system-ui, sans-serif' }}
              >
                {v}
              </text>
            )}
            {isBlank && (
              <path
                d={`M ${cx} ${LINE_Y} L ${cx - TRIANGLE_W / 2} ${LINE_Y - TRIANGLE_H} L ${cx + TRIANGLE_W / 2} ${LINE_Y - TRIANGLE_H} Z`}
                fill="var(--sp-visual-fill, #374151)"
                stroke="var(--sp-visual-stroke, #111827)"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
