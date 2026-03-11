import type { ReactNode } from 'react';
import type { MissingDigitsConfig, MissingDigitsSegment } from '../types';

export interface MissingDigitsProps {
  config: MissingDigitsConfig;
  width?: number;
  className?: string;
}

const BOX_W = 28;
const BOX_H = 36;
const GAP = 8;
const SYMBOL_PAD = 6;
const FONT_SIZE = 18;

function digitBoxes(value: number, x: number, y: number): ReactNode[] {
  const digits = String(value).split('');
  const nodes: ReactNode[] = [];
  digits.forEach((d, i) => {
    const bx = x + i * (BOX_W + 2);
    nodes.push(
      <g key={i}>
        <rect
          x={bx}
          y={y}
          width={BOX_W}
          height={BOX_H}
          fill="var(--sp-visual-bg, #fff)"
          stroke="var(--sp-visual-stroke, #374151)"
          strokeWidth="1.5"
        />
        <text
          x={bx + BOX_W / 2}
          y={y + BOX_H / 2 + 5}
          textAnchor="middle"
          fill="var(--sp-visual-text, #111827)"
          style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}
        >
          {d}
        </text>
      </g>
    );
  });
  return nodes;
}

function blankBoxes(count: number, x: number, y: number): ReactNode[] {
  const n = count ?? 1;
  const nodes: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const bx = x + i * (BOX_W + 2);
    nodes.push(
      <rect
        key={i}
        x={bx}
        y={y}
        width={BOX_W}
        height={BOX_H}
        fill="none"
        stroke="var(--sp-visual-stroke, #9ca3af)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
    );
  }
  return nodes;
}

export function MissingDigits({ config, width, className }: MissingDigitsProps) {
  const { segments } = config;
  let x = 24;
  const y = 24;
  const elements: ReactNode[] = [];
  segments.forEach((seg: MissingDigitsSegment, i) => {
    if (seg.type === 'number') {
      digitBoxes(seg.value, x, y).forEach((node, j) => elements.push(<g key={`n-${i}-${j}`}>{node}</g>));
      x += String(seg.value).length * (BOX_W + 2) + GAP;
    } else if (seg.type === 'blank') {
      const n = seg.digits ?? 1;
      blankBoxes(n, x, y).forEach((node, j) => elements.push(<g key={`b-${i}-${j}`}>{node}</g>));
      x += n * (BOX_W + 2) + GAP;
    } else {
      elements.push(
        <text
          key={`s-${i}`}
          x={x + SYMBOL_PAD}
          y={y + BOX_H / 2 + 5}
          textAnchor="middle"
          fill="var(--sp-visual-text, #374151)"
          style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
        >
          {seg.char}
        </text>
      );
      x += SYMBOL_PAD * 2 + 16 + GAP;
    }
  });
  const totalW = width ?? x + 24;
  const totalH = y + BOX_H + 24;
  return (
    <svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`} className={className} aria-hidden>
      {elements}
    </svg>
  );
}
