import type { ClockFaceConfig } from '../types';

export interface ClockFaceProps {
  config: ClockFaceConfig;
  width?: number;
  className?: string;
}

const DEFAULT_SIZE = 120;
const CENTER = 60;

export function ClockFace({ config, width = DEFAULT_SIZE, className }: ClockFaceProps) {
  const { hours, minutes } = config;
  const size = width;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 12;

  const hourAngle = ((hours % 12) + minutes / 60) * (360 / 12);
  const minuteAngle = minutes * (360 / 60);
  const radH = ((hourAngle - 90) * Math.PI) / 180;
  const radM = ((minuteAngle - 90) * Math.PI) / 180;
  const hLen = r * 0.5;
  const mLen = r * 0.8;
  const hx = cx + Math.cos(radH) * hLen;
  const hy = cy + Math.sin(radH) * hLen;
  const mx = cx + Math.cos(radM) * mLen;
  const my = cy + Math.sin(radM) * mLen;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--sp-visual-bg, #fefce8)"
        stroke="var(--sp-visual-stroke, #374151)"
        strokeWidth="2"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        const x1 = cx + (r - 6) * Math.cos(a);
        const y1 = cy + (r - 6) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth={i % 3 === 0 ? 2 : 1}
          />
        );
      })}
      <line
        x1={cx}
        y1={cy}
        x2={hx}
        y2={hy}
        stroke="var(--sp-visual-stroke, #111827)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={mx}
        y2={my}
        stroke="var(--sp-visual-stroke, #374151)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={4} fill="var(--sp-visual-fill, #111827)" />
    </svg>
  );
}
