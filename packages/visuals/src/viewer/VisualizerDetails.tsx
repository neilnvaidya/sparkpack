import type { VisualType } from '../types';
import { QuestionVisual } from './QuestionVisual';

const VISUAL_TYPES: { value: VisualType; description: string }[] = [
  { value: 'none', description: 'No visual (text-only question)' },
  { value: 'number_line', description: 'Number line with labelled/blank ticks' },
  { value: 'dice', description: 'Single die face (1–6)' },
  { value: 'count_objects', description: 'Groups of objects to count' },
  { value: 'object_array', description: 'Grid of objects (e.g. marbles)' },
  { value: 'bar_chart', description: 'Bar chart with optional blank bars' },
  { value: 'block_chart', description: 'Block chart grid (cells per row)' },
  { value: 'tally_chart', description: 'Tally chart table (Object | Tallies | Count)' },
  { value: 'shape_grid', description: 'Grid of shapes' },
  { value: 'shape_classify', description: 'Classify objects (cuboid, cylinder, cone)' },
  { value: 'coin_display', description: 'UK coin sets' },
  { value: 'fraction_of_set', description: 'Fraction of a set' },
  { value: 'spinner', description: 'Spinner with sections and arrow' },
  { value: 'matching_pairs', description: 'Left/right pairs to match' },
  { value: 'clock_face', description: 'Analog clock' },
  { value: 'weight_scale', description: 'Items and weights (total)' },
  { value: 'option_fill', description: 'Fill in the blank from options (comparison or operator rows)' },
  { value: 'missing_digits', description: 'Number sentence with digit/blank boxes' },
  { value: 'calculation_choices', description: 'Calculation options to circle/select' },
  { value: 'item_list', description: 'Generic list of items' },
  { value: 'number_pattern', description: 'Pattern recognition (sequence, continue the pattern)' },
];

const EXAMPLE_CONFIGS: Record<Exclude<VisualType, 'none'>, object> = {
  number_line: { min: 50, max: 70, interval: 5, labelled: [50, 60, 70], blank: [55, 65] },
  dice: { value: 5 },
  count_objects: { groups: [{ object: 'apple', count: 3 }, { object: 'apple', count: 2 }] },
  object_array: { groups: 3, items_per_group: 3, object: 'marble' },
  bar_chart: {
    title: 'Animals in a pond',
    x_label: 'Animal',
    y_label: 'Count',
    scale: 1,
    bars: [
      { label: 'duck', value: 4, given: false },
      { label: 'frog', value: 3, given: true },
      { label: 'fish', value: 6, given: true },
    ],
  },
  block_chart: {
    title: 'Animals in a pond',
    rows: [
      { label: 'duck', value: 4, given: false },
      { label: 'frog', value: 3, given: true },
      { label: 'fish', value: 6, given: true },
    ],
  },
  tally_chart: {
    title: 'Birds in the garden',
    rows: [
      { label: 'robin', value: 3 },
      { label: 'blue tit', value: 5, blank: 'count' },
      { label: 'sparrow', value: 10 },
    ],
  },
  shape_grid: { shapes: ['pentagon', 'hexagon', 'square', 'triangle'], task: 'select_matching_sides' },
  shape_classify: {
    objects: ['box', 'tin_can', 'cereal_box', 'party_hat'],
    categories: ['cuboid', 'cylinder', 'cuboid', 'cone'],
    correct: { box: 'cuboid', tin_can: 'cylinder', cereal_box: 'cuboid', party_hat: 'cone' },
  },
  coin_display: { sets: { ben: ['50p', '20p', '10p', '5p'], sita: ['20p', '10p', '2p', '1p'] } },
  fraction_of_set: { fraction: '1/2', items_shown: 4, object: 'car' },
  spinner: { sections: 4, labels: ['A', 'B', 'C', 'D'], arrow_start: 'A', turn_direction: 'anti-clockwise', turn_amount: '1/4' },
  matching_pairs: {
    left: ['10 minutes', '11 minutes', '13 minutes', '15 minutes'],
    right: ['1st', '2nd', '3rd', '4th'],
    correct: { '10 minutes': '1st', '11 minutes': '2nd', '13 minutes': '3rd', '15 minutes': '4th' },
  },
  clock_face: { hours: 3, minutes: 15 },
  weight_scale: {
    items: [
      { label: 'card', grams: 32 },
      { label: 'gift', grams: 47 },
      { label: 'letter', grams: null },
    ],
    total: 100,
  },
  option_fill: {
    options: ['<', '>', '='],
    rows: [
      { type: 'comparison', left: 21, right: 12 },
      { type: 'comparison', left: 48, right: 64 },
      { type: 'comparison', left: 55, right: 55 },
    ],
    correct: ['>', '<', '='],
  },
  missing_digits: {
    segments: [
      { type: 'number', value: 16 },
      { type: 'symbol', char: '−' },
      { type: 'blank', digits: 1 },
      { type: 'symbol', char: '=' },
      { type: 'number', value: 12 },
    ],
  },
  calculation_choices: { options: ['4+12', '12+4', '16-4', '12-4', '16-12'] },
  item_list: { items: [2, 7, 12, 17, 22], title: 'Pattern +5' },
  number_pattern: { variant: 'sequence', items: [2, 7, 12, 17, 22], title: 'Pattern +5', rule: '+5 each time' },
};

export function VisualizerDetails() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>
        @sparkpack/visuals — Visualizer
      </h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>
        SVG renderers for maths question visuals. Each type has a typed config and optional width/className.
      </p>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 12 }}>
          Visual types
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {VISUAL_TYPES.map(({ value, description }) => (
            <li
              key={value}
              style={{
                padding: '10px 12px',
                marginBottom: 6,
                background: '#f1f5f9',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <code style={{ fontFamily: 'monospace', fontWeight: 600 }}>{value}</code>
              <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 12 }}>
          Example (one per type)
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
          {(VISUAL_TYPES.filter((t) => t.value !== 'none') as { value: Exclude<VisualType, 'none'> }[]).map(({ value }) => (
            <div
              key={value}
              style={{
                padding: 16,
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                minWidth: 160,
              }}
            >
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{value}</div>
              <QuestionVisual
                visualType={value}
                visualConfig={EXAMPLE_CONFIGS[value] as any}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
