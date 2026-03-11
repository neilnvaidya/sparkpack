import type { CalculationChoicesConfig } from '../types';

export interface CalculationChoicesProps {
  config: CalculationChoicesConfig;
  width?: number;
  className?: string;
}

const BOX_PAD_H = 16;
const BOX_PAD_V = 12;
const GAP = 16;
const FONT_SIZE = 16;

export function CalculationChoices({ config, width, className }: CalculationChoicesProps) {
  const { options } = config;
  const boxes: { x: number; w: number }[] = [];
  let x = 24;
  const y = 24;
  options.forEach((text) => {
    const w = Math.max(60, text.length * 12 + BOX_PAD_H * 2);
    boxes.push({ x, w });
    x += w + GAP;
  });
  const totalW = width ?? x + 24;
  const totalH = y + 32 + BOX_PAD_V * 2;
  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} className={className} aria-hidden>
      {options.map((text, i) => (
        <g key={i}>
          <rect
            x={boxes[i].x}
            y={y}
            width={boxes[i].w}
            height={28 + BOX_PAD_V * 2}
            rx={6}
            fill="var(--sp-visual-bg, #fff)"
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="2"
          />
          <text
            x={boxes[i].x + boxes[i].w / 2}
            y={y + 14 + BOX_PAD_V + 5}
            textAnchor="middle"
            fill="var(--sp-visual-text, #111827)"
            style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
          >
            {text}
          </text>
        </g>
      ))}
    </svg>
  );
}
