import type { SpinnerConfig } from '../types';

export interface SpinnerProps {
  config: SpinnerConfig;
  width?: number;
  className?: string;
}

const DEFAULT_SIZE = 120;
const CENTER = 60;

/** Parse turn amount like "1/4" to fraction. */
function parseTurnAmount(s: string): number {
  const parts = s.split('/').map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1]) && parts[1] !== 0) {
    return parts[0] / parts[1];
  }
  return 0;
}

export function Spinner({ config, width = DEFAULT_SIZE, className }: SpinnerProps) {
  const { sections, labels, arrow_start, turn_direction, turn_amount } = config;
  const size = width;
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;

  const startIndex = labels.indexOf(arrow_start);
  const turn = parseTurnAmount(turn_amount);
  const sign = turn_direction === 'anti-clockwise' ? 1 : -1;
  const endAngleRaw = (startIndex / sections) * 360 + sign * turn * 360;
  /* Place arrow firmly inside a quadrant: use section center offset by 0.35 so not on the boundary (e.g. 22.5° inside). */
  const sectionAngle = 360 / sections;
  const sectionIndex = Math.floor((((endAngleRaw % 360) + 360) % 360) / sectionAngle) % sections;
  const endAngle = (sectionIndex + 0.35) * sectionAngle;
  const arrowAngle = (endAngle * Math.PI) / 180;
  const arrowLen = r - 8;
  const arrowTipX = cx + Math.sin(arrowAngle) * arrowLen;
  const arrowTipY = cy - Math.cos(arrowAngle) * arrowLen;
  const arrowTailX = cx - Math.sin(arrowAngle) * 12;
  const arrowTailY = cy + Math.cos(arrowAngle) * 12;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden
    >
      {/* Sections */}
      {Array.from({ length: sections }).map((_, i) => {
        const a0 = (i / sections) * 360;
        const a1 = ((i + 1) / sections) * 360;
        const rad0 = (a0 * Math.PI) / 180;
        const rad1 = (a1 * Math.PI) / 180;
        const x0 = cx + r * Math.sin(rad0);
        const y0 = cy - r * Math.cos(rad0);
        const x1 = cx + r * Math.sin(rad1);
        const y1 = cy - r * Math.cos(rad1);
        const large = 360 / sections > 180 ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
        return (
          <path
            key={i}
            d={d}
            fill={i % 2 === 0 ? 'var(--sp-visual-fill, #dbeafe)' : 'var(--sp-visual-bg, #f3f4f6)'}
            stroke="var(--sp-visual-stroke, #374151)"
            strokeWidth="1"
          />
        );
      })}
      {/* Section labels */}
      {labels.map((label, i) => {
        const midAngle = ((i + 0.5) / sections) * 360;
        const rad = (midAngle * Math.PI) / 180;
        const lr = r * 0.65;
        const lx = cx + lr * Math.sin(rad);
        const ly = cy - lr * Math.cos(rad);
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--sp-visual-text, #111827)"
            style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
          >
            {label}
          </text>
        );
      })}
      {/* Arrow from center to edge */}
      <line
        x1={arrowTailX}
        y1={arrowTailY}
        x2={arrowTipX}
        y2={arrowTipY}
        stroke="var(--sp-visual-stroke, #dc2626)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={6} fill="var(--sp-visual-fill, #374151)" />
    </svg>
  );
}
