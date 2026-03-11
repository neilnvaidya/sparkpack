/**
 * Visual type enum matching DB visual_type.
 * 'none' = no visual; all others have a corresponding config and renderer.
 */
export type VisualType =
  | 'none'
  | 'number_line'
  | 'dice'
  | 'count_objects'
  | 'object_array'
  | 'bar_chart'
  | 'block_chart'
  | 'tally_chart'
  | 'shape_grid'
  | 'shape_classify'
  | 'coin_display'
  | 'fraction_of_set'
  | 'spinner'
  | 'matching_pairs'
  | 'clock_face'
  | 'weight_scale'
  | 'option_fill'
  | 'missing_digits'
  | 'calculation_choices'
  | 'item_list'
  | 'number_pattern';

/** number_line: min, max, interval; which ticks are labelled vs blank (to fill in). */
export interface NumberLineConfig {
  min: number;
  max: number;
  interval: number;
  labelled: number[];
  blank: number[];
}

/** dice: single die face value 1–6. Optional number_options: numbers to show for student to circle (e.g. 2 less than dice). */
export interface DiceConfig {
  value: number;
  /** When set, render dice plus a row of these numbers in boxes for the student to circle. */
  number_options?: number[];
}

/** count_objects: groups of objects (e.g. apples) with counts.
 *  object: key for display (e.g. "apple", "orange"). When no object library is present, renderer uses a circle placeholder.
 *  TODO: Add SVG object library and use object key to look up icon when available.
 */
export interface CountObjectsConfig {
  groups: Array<{ object: string; count: number }>;
  /** Reserved: 'circle' = placeholder circles until object SVGs exist; 'svg' = use object library when implemented. */
  object_display?: 'circle' | 'svg';
}

/** object_array: grid of groups × items_per_group; object type for display. */
export interface ObjectArrayConfig {
  groups: number;
  items_per_group: number;
  object: string;
}

/** bar_chart: title, axes, scale, bars; given=false means bar height is blank (to fill in). */
export interface BarChartBar {
  label: string;
  value: number;
  given: boolean;
}
export interface BarChartConfig {
  title: string;
  x_label: string;
  y_label: string;
  scale: number;
  bars: BarChartBar[];
}

/** block_chart: grid of square cells; row labels on left, count labels 1,2,3... on top; fill cells per row, one row has a blank to fill. */
export interface BlockChartRow {
  label: string;
  value: number;
  given: boolean;
}
export interface BlockChartConfig {
  title?: string;
  rows: BlockChartRow[];
}

/** tally_chart: rows with label, value. At most one blank per row; first column (Object) is always filled.
 *  blank: 'tally' = tally cell blank (student fills tally marks); 'count' = count cell blank (student fills number). */
export interface TallyChartRow {
  label: string;
  value: number;
  /** Which cell is blank in this row; only one per row. Omit when both tally and count are shown. */
  blank?: 'tally' | 'count';
}
export interface TallyChartConfig {
  title: string;
  rows: TallyChartRow[];
}

/** shape_grid: list of shape names and task (e.g. select_matching_sides). */
export interface ShapeGridConfig {
  shapes: string[];
  task: string;
}

/** shape_classify: object id → category; categories list order for display. */
export interface ShapeClassifyConfig {
  objects: string[];
  categories: string[];
  correct: Record<string, string>;
}

/** coin_display: named sets of UK coin labels (e.g. "50p", "20p", "10p", "5p", "2p", "1p", "£1"). */
export interface CoinDisplayConfig {
  sets: Record<string, string[]>;
}

/** fraction_of_set: fraction string, how many items shown, object type. */
export interface FractionOfSetConfig {
  fraction: string;
  items_shown: number;
  object: string;
}

/** spinner: sections with labels, arrow position and turn. */
export interface SpinnerConfig {
  sections: number;
  labels: string[];
  arrow_start: string;
  turn_direction: 'clockwise' | 'anti-clockwise';
  turn_amount: string; // e.g. "1/4"
}

/** matching_pairs: left/right lists and correct pairing.
 *  Layout: left column = items in boxes with gap between rows; right column = one item per row.
 *  example_pair: when set, draw only this one connection line (left key) as the example; do not show all correct pairs.
 */
export interface MatchingPairsConfig {
  left: string[];
  right: string[];
  correct: Record<string, string>;
  /** If set, draw only this pair as a connection line (e.g. "ninety-nine"); student matches the rest. */
  example_pair?: string;
  /** 'compact' = 1:1 grid (no row skip). 'spaced' = left items every other row. Default: compact when left.length === right.length, else spaced. */
  layout?: 'compact' | 'spaced';
}

/** clock_face: time shown. */
export interface ClockFaceConfig {
  hours: number;
  minutes: number;
}

/** weight_scale: items with label and grams (null = unknown); total mass. */
export interface WeightScaleItem {
  label: string;
  grams: number | null;
}
export interface WeightScaleConfig {
  items: WeightScaleItem[];
  total: number;
}

/** option_fill: "fill in the blank with the correct option". Options shown at top; each row has one blank to fill.
 *  comparison: left [blank] right (e.g. 21 _ 12). operator: left [blank] right = result (e.g. 8 _ 2 = 16). */
export type OptionFillRow =
  | { type: 'comparison'; left: number; right: number }
  | { type: 'operator'; left: number; right: number; result: number };
export interface OptionFillConfig {
  options: string[];
  rows: OptionFillRow[];
  correct?: string[];
}

/** missing_digits: sequence of numbers and blanks; each number shown as digit boxes (side by side for 2+ digits), blanks as empty boxes. */
export interface MissingDigitsPart {
  type: 'number';
  value: number;
}
export interface MissingDigitsBlank {
  type: 'blank';
  digits?: number; // default 1
}
export interface MissingDigitsSymbol {
  type: 'symbol';
  char: string;
}
export type MissingDigitsSegment = MissingDigitsPart | MissingDigitsBlank | MissingDigitsSymbol;
export interface MissingDigitsConfig {
  segments: MissingDigitsSegment[];
}

/** calculation_choices: list of calculation strings in boxes for student to circle/select (e.g. "Circle calculations that check 16−4=12"). */
export interface CalculationChoicesConfig {
  options: string[];
}

/** item_list: simple list of items (numbers or strings) with spacing; generic use. */
export interface ItemListConfig {
  items: (number | string)[];
  title?: string;
}

/** number_pattern: pattern recognition. Two forms:
 *  - sequence: pattern in a row, large elements, no boxes, clear spacing ("what is the next item with condition?").
 *  - equations: fill in the blanks, vertically aligned so each part lines up; blanks are empty boxes. */
export interface NumberPatternEquationRow {
  first: number | null;
  op: string;
  second: number | null;
  result: number | null;
}

export type NumberPatternConfig =
  | {
      variant: 'sequence';
      items: (number | string)[];
      title?: string;
      /** Optional pattern rule (e.g. "+5 each time"). */
      rule?: string;
    }
  | {
      variant: 'equations';
      rows: NumberPatternEquationRow[];
      title?: string;
    };

/** Map each VisualType to its config type (none has no config). */
export interface VisualConfigMap {
  none: null;
  number_line: NumberLineConfig;
  dice: DiceConfig;
  count_objects: CountObjectsConfig;
  object_array: ObjectArrayConfig;
  bar_chart: BarChartConfig;
  block_chart: BlockChartConfig;
  tally_chart: TallyChartConfig;
  shape_grid: ShapeGridConfig;
  shape_classify: ShapeClassifyConfig;
  coin_display: CoinDisplayConfig;
  fraction_of_set: FractionOfSetConfig;
  spinner: SpinnerConfig;
  matching_pairs: MatchingPairsConfig;
  clock_face: ClockFaceConfig;
  weight_scale: WeightScaleConfig;
  option_fill: OptionFillConfig;
  missing_digits: MissingDigitsConfig;
  calculation_choices: CalculationChoicesConfig;
  item_list: ItemListConfig;
  number_pattern: NumberPatternConfig;
}

/** Props for the main QuestionVisual component. */
export interface QuestionVisualProps<T extends VisualType = VisualType> {
  visualType: T;
  visualConfig: VisualConfigMap[T];
  width?: number;
  className?: string;
}

/** Question record: shape from DB or derived from seed SQL. Used by QuestionContainer and paper viewer. */
/** Whether the answer is captured on the page (circle/choose/fill blanks) or in a separate answer box (computation). */
export type AnswerStyle = 'built_in' | 'answer_box';

export interface QuestionRecord {
  id: number;
  question_text: string;
  question_type: string;
  difficulty: string;
  marks: number;
  visual_type: VisualType;
  visual_config: VisualConfigMap[VisualType];
  /** built_in = student circles, chooses, or fills blanks on the visual; answer_box = student writes answer in a box (e.g. computation). */
  answer_style?: AnswerStyle;
  primary_answer?: string;
  exam_source_id?: number;
  objective_id?: number;
  source_label?: string;
}
