import type { BarChartConfig } from '../types';

export interface BarChartProps {
  config: BarChartConfig;
  width?: number;
  className?: string;
}

const DEFAULT_WIDTH = 320;
const CHART_LEFT = 48;
const CHART_BOTTOM = 32;
const TITLE_GAP = 8;
const BAR_GAP = 12;
const FONT_SIZE = 12;

export function BarChart({ config, width = DEFAULT_WIDTH, className }: BarChartProps) {
  const { title, x_label, y_label, scale, bars } = config;
  const chartWidth = width - CHART_LEFT - 24;
  const chartHeight = 120;
  const height = chartHeight + CHART_BOTTOM + 40 + TITLE_GAP * 2;

  const barWidth = Math.max(8, (chartWidth - (bars.length - 1) * BAR_GAP) / bars.length);
  const maxVal = Math.max(...bars.map((b) => b.value), scale);
  const scaleY = maxVal > 0 ? chartHeight / maxVal : 0;

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
        y={16}
        textAnchor="middle"
        fill="var(--sp-visual-text, #111827)"
        style={{ fontSize: 14, fontWeight: 600, fontFamily: 'system-ui, sans-serif' }}
      >
        {title}
      </text>
      <text
        x={width / 2}
        y={height - 8}
        textAnchor="middle"
        fill="var(--sp-visual-text, #6b7280)"
        style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
      >
        {x_label}
      </text>
      <text
        x={16}
        y={40 + chartHeight / 2}
        textAnchor="middle"
        fill="var(--sp-visual-text, #6b7280)"
        style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
        transform={`rotate(-90, 16, ${40 + chartHeight / 2})`}
      >
        {y_label}
      </text>
      {/* Y axis ticks */}
      {[0, scale].filter((v) => v <= maxVal).map((v) => (
        <g key={v}>
          <line
            x1={CHART_LEFT - 4}
            y1={40 + chartHeight - v * scaleY}
            x2={CHART_LEFT}
            y2={40 + chartHeight - v * scaleY}
            stroke="var(--sp-visual-stroke, #9ca3af)"
            strokeWidth="1"
          />
          <text
            x={CHART_LEFT - 8}
            y={40 + chartHeight - v * scaleY + 4}
            textAnchor="end"
            fill="var(--sp-visual-text, #374151)"
            style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* Bars */}
      {bars.map((bar, i) => {
        const x = CHART_LEFT + i * (barWidth + BAR_GAP);
        const h = bar.given ? bar.value * scaleY : 0;
        const y = 40 + chartHeight - h;
        return (
          <g key={i}>
            {bar.given ? (
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill="var(--sp-visual-fill, #3b82f6)"
                stroke="var(--sp-visual-stroke, #1d4ed8)"
                strokeWidth="1"
              />
            ) : (
              <rect
                x={x}
                y={40}
                width={barWidth}
                height={chartHeight}
                fill="var(--sp-visual-bg, #f3f4f6)"
                stroke="var(--sp-visual-stroke, #d1d5db)"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
            )}
            <text
              x={x + barWidth / 2}
              y={40 + chartHeight + 16}
              textAnchor="middle"
              fill="var(--sp-visual-text, #374151)"
              style={{ fontSize: FONT_SIZE, fontFamily: 'system-ui, sans-serif' }}
            >
              {bar.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
