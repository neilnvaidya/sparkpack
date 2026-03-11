import { JSX } from 'react/jsx-runtime';
import { ReactNode } from 'react';

/** Question record: shape from DB or derived from seed SQL. Used by QuestionContainer and paper viewer. */
/** Whether the answer is captured on the page (circle/choose/fill blanks) or in a separate answer box (computation). */
export declare type AnswerStyle = 'built_in' | 'answer_box';

export declare function BarChart({ config, width, className }: BarChartProps): JSX.Element;

/** bar_chart: title, axes, scale, bars; given=false means bar height is blank (to fill in). */
export declare interface BarChartBar {
    label: string;
    value: number;
    given: boolean;
}

export declare interface BarChartConfig {
    title: string;
    x_label: string;
    y_label: string;
    scale: number;
    bars: BarChartBar[];
}

declare interface BarChartProps {
    config: BarChartConfig;
    width?: number;
    className?: string;
}

/** Bounding box in canonical (logical) space. Shape is drawn centered; width/height used for fit-to-slot. */
export declare interface BBox {
    width: number;
    height: number;
}

export declare function BlockChart({ config, width, className }: BlockChartProps): JSX.Element;

export declare interface BlockChartConfig {
    title?: string;
    rows: BlockChartRow[];
}

declare interface BlockChartProps {
    config: BlockChartConfig;
    width?: number;
    className?: string;
}

/** block_chart: grid of square cells; row labels on left, count labels 1,2,3... on top; fill cells per row, one row has a blank to fill. */
export declare interface BlockChartRow {
    label: string;
    value: number;
    given: boolean;
}

export declare function CalculationChoices({ config, width, className }: CalculationChoicesProps): JSX.Element;

/** calculation_choices: list of calculation strings in boxes for student to circle/select (e.g. "Circle calculations that check 16−4=12"). */
export declare interface CalculationChoicesConfig {
    options: string[];
}

declare interface CalculationChoicesProps {
    config: CalculationChoicesConfig;
    width?: number;
    className?: string;
}

declare interface CircleParams {
    radius: number;
}

export declare function ClockFace({ config, width, className }: ClockFaceProps): JSX.Element;

/** clock_face: time shown. */
export declare interface ClockFaceConfig {
    hours: number;
    minutes: number;
}

declare interface ClockFaceProps {
    config: ClockFaceConfig;
    width?: number;
    className?: string;
}

export declare function CoinDisplay({ config, width, className }: CoinDisplayProps): JSX.Element;

/** coin_display: named sets of UK coin labels (e.g. "50p", "20p", "10p", "5p", "2p", "1p", "£1"). */
export declare interface CoinDisplayConfig {
    sets: Record<string, string[]>;
}

declare interface CoinDisplayProps {
    config: CoinDisplayConfig;
    width?: number;
    className?: string;
}

declare interface ConeParams {
    radius: number;
    height: number;
}

export declare function CountObjects({ config, width, className }: CountObjectsProps): JSX.Element;

/** count_objects: groups of objects (e.g. apples) with counts.
 *  object: key for display (e.g. "apple", "orange"). When no object library is present, renderer uses a circle placeholder.
 *  TODO: Add SVG object library and use object key to look up icon when available.
 */
export declare interface CountObjectsConfig {
    groups: Array<{
        object: string;
        count: number;
    }>;
    /** Reserved: 'circle' = placeholder circles until object SVGs exist; 'svg' = use object library when implemented. */
    object_display?: 'circle' | 'svg';
}

declare interface CountObjectsProps {
    config: CountObjectsConfig;
    width?: number;
    className?: string;
}

declare interface CubeParams {
    side: number;
}

declare interface CylinderParams {
    radius: number;
    height: number;
    /** Fill level 0–1 for "filled to height" (e.g. liquid). */
    fill?: number;
}

export declare function Dice({ config, width, className }: DiceProps): JSX.Element;

/** dice: single die face value 1–6. Optional number_options: numbers to show for student to circle (e.g. 2 less than dice). */
export declare interface DiceConfig {
    value: number;
    /** When set, render dice plus a row of these numbers in boxes for the student to circle. */
    number_options?: number[];
}

declare interface DiceProps {
    config: DiceConfig;
    width?: number;
    className?: string;
}

export declare function FractionOfSet({ config, width, className }: FractionOfSetProps): JSX.Element;

/** fraction_of_set: fraction string, how many items shown, object type. */
export declare interface FractionOfSetConfig {
    fraction: string;
    items_shown: number;
    object: string;
}

declare interface FractionOfSetProps {
    config: FractionOfSetConfig;
    width?: number;
    className?: string;
}

export declare function getShapeRenderer(shapeId: ShapeId): ShapeRendererEntry | undefined;

declare interface HexagonalPrismParams {
    baseRadius?: number;
    side?: number;
    height: number;
}

export declare function isObjectInLibrary(id: string): id is ObjectId;

export declare function isShapeId(id: string): id is ShapeId;

export declare function ItemList({ config, width, className }: ItemListProps): JSX.Element;

/** item_list: simple list of items (numbers or strings) with spacing; generic use. */
export declare interface ItemListConfig {
    items: (number | string)[];
    title?: string;
}

declare interface ItemListProps {
    config: ItemListConfig;
    width?: number;
    className?: string;
}

export declare function MatchingPairs({ config, width, className }: MatchingPairsProps): JSX.Element;

/** matching_pairs: left/right lists and correct pairing.
 *  Layout: left column = items in boxes with gap between rows; right column = one item per row.
 *  example_pair: when set, draw only this one connection line (left key) as the example; do not show all correct pairs.
 */
export declare interface MatchingPairsConfig {
    left: string[];
    right: string[];
    correct: Record<string, string>;
    /** If set, draw only this pair as a connection line (e.g. "ninety-nine"); student matches the rest. */
    example_pair?: string;
    /** 'compact' = 1:1 grid (no row skip). 'spaced' = left items every other row. Default: compact when left.length === right.length, else spaced. */
    layout?: 'compact' | 'spaced';
}

declare interface MatchingPairsProps {
    config: MatchingPairsConfig;
    width?: number;
    className?: string;
}

export declare function MissingDigits({ config, width, className }: MissingDigitsProps): JSX.Element;

declare interface MissingDigitsBlank {
    type: 'blank';
    digits?: number;
}

export declare interface MissingDigitsConfig {
    segments: MissingDigitsSegment[];
}

/** missing_digits: sequence of numbers and blanks; each number shown as digit boxes (side by side for 2+ digits), blanks as empty boxes. */
declare interface MissingDigitsPart {
    type: 'number';
    value: number;
}

declare interface MissingDigitsProps {
    config: MissingDigitsConfig;
    width?: number;
    className?: string;
}

export declare type MissingDigitsSegment = MissingDigitsPart | MissingDigitsBlank | MissingDigitsSymbol;

declare interface MissingDigitsSymbol {
    type: 'symbol';
    char: string;
}

export declare function NumberLine({ config, width, className }: NumberLineProps): JSX.Element;

/** number_line: min, max, interval; which ticks are labelled vs blank (to fill in). */
export declare interface NumberLineConfig {
    min: number;
    max: number;
    interval: number;
    labelled: number[];
    blank: number[];
}

declare interface NumberLineProps {
    config: NumberLineConfig;
    width?: number;
    className?: string;
}

export declare function NumberPattern({ config, width, className }: NumberPatternProps): JSX.Element;

export declare type NumberPatternConfig = {
    variant: 'sequence';
    items: (number | string)[];
    title?: string;
    /** Optional pattern rule (e.g. "+5 each time"). */
    rule?: string;
} | {
    variant: 'equations';
    rows: NumberPatternEquationRow[];
    title?: string;
};

/** number_pattern: pattern recognition. Two forms:
 *  - sequence: pattern in a row, large elements, no boxes, clear spacing ("what is the next item with condition?").
 *  - equations: fill in the blanks, vertically aligned so each part lines up; blanks are empty boxes. */
export declare interface NumberPatternEquationRow {
    first: number | null;
    op: string;
    second: number | null;
    result: number | null;
}

declare interface NumberPatternProps {
    config: NumberPatternConfig;
    width?: number;
    className?: string;
}

/** Object IDs that have a simple SVG drawing in the library (physical items). Ordered by logical category for display. */
export declare const OBJECT_IDS: readonly ["tin_can", "cereal_box", "bag", "box", "party_hat", "balloon", "cupcake", "cookie", "apple", "orange", "marble", "banana", "pear", "strawberry", "flower", "sun", "moon", "cloud", "tree", "star", "duck", "bird", "fish", "cat", "dog", "boat", "airplane", "toy_car", "bicycle", "chair", "table", "cup", "bottle", "book", "pencil", "key", "lock", "phone", "laptop", "camera", "clock", "lightbulb", "guitar", "envelope", "gift", "umbrella", "flag", "button", "house"];

export declare function ObjectArray({ config, width, className }: ObjectArrayProps): JSX.Element;

/** object_array: grid of groups × items_per_group; object type for display. */
export declare interface ObjectArrayConfig {
    groups: number;
    items_per_group: number;
    object: string;
}

declare interface ObjectArrayProps {
    config: ObjectArrayConfig;
    width?: number;
    className?: string;
}

/**
 * Renders the simple SVG drawing of an object at (x, y). If objectId is not in the library or has no drawing, returns null so the caller can fall back to a generic shape.
 */
export declare function ObjectDrawing({ objectId, x, y, size, className }: ObjectDrawingProps): ReactNode;

declare interface ObjectDrawingProps {
    /** Object id (e.g. from shape_classify objects or count_objects object). */
    objectId: string;
    /** Center x in parent coordinates. */
    x: number;
    /** Center y in parent coordinates. */
    y: number;
    /** Size of the drawn object (width and height). Default 32. */
    size?: number;
    /** Optional className for the wrapper g. */
    className?: string;
}

export declare type ObjectId = (typeof OBJECT_IDS)[number];

export declare function OptionFill({ config, width, className }: OptionFillProps): JSX.Element;

export declare interface OptionFillConfig {
    options: string[];
    rows: OptionFillRow[];
    correct?: string[];
}

declare interface OptionFillProps {
    config: OptionFillConfig;
    width?: number;
    className?: string;
}

/** option_fill: "fill in the blank with the correct option". Options shown at top; each row has one blank to fill.
 *  comparison: left [blank] right (e.g. 21 _ 12). operator: left [blank] right = result (e.g. 8 _ 2 = 16). */
export declare type OptionFillRow = {
    type: 'comparison';
    left: number;
    right: number;
} | {
    type: 'operator';
    left: number;
    right: number;
    result: number;
};

declare interface OvalParams {
    rx: number;
    ry: number;
}

/** Params for a given shape id. */
export declare type ParamsFor<T extends ShapeId> = Extract<ShapeParams, {
    shapeId: T;
}>['params'];

declare interface PentagonalPyramidParams {
    baseRadius?: number;
    side?: number;
    height: number;
}

export declare function QuestionContainer({ question, sourceLabel, showAnswer, notes, onNotesChange, className, }: QuestionContainerProps): JSX.Element;

declare interface QuestionContainerProps {
    question: QuestionRecord;
    sourceLabel?: string;
    showAnswer?: boolean;
    notes?: string;
    onNotesChange?: (value: string) => void;
    className?: string;
}

export declare interface QuestionRecord {
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

export declare function QuestionVisual<T extends VisualType>({ visualType, visualConfig, width, className, }: QuestionVisualProps<T>): JSX.Element | null;

/** Props for the main QuestionVisual component. */
export declare interface QuestionVisualProps<T extends VisualType = VisualType> {
    visualType: T;
    visualConfig: VisualConfigMap[T];
    width?: number;
    className?: string;
}

declare interface RectangleParams {
    width: number;
    height: number;
}

declare interface RectangularPrismParams {
    width: number;
    depth: number;
    height: number;
    fill?: number;
}

declare interface RectangularPyramidParams {
    baseWidth: number;
    baseDepth: number;
    height: number;
}

export declare function registerShapeRenderer(shapeId: ShapeId, entry: ShapeRendererEntry): void;

declare interface RegularPolygonParams {
    n: number;
    radius?: number;
    sideLength?: number;
}

declare interface RhombusParams {
    width: number;
    height: number;
    /** Or side and angle (degrees). */
    side?: number;
    angleDeg?: number;
}

declare type Shape2dId = (typeof SHAPE_2D_IDS)[number];

declare type Shape3dId = (typeof SHAPE_3D_IDS)[number];

/** 2D math shape IDs. */
export declare const SHAPE_2D_IDS: readonly ["triangle_equilateral", "triangle_isosceles", "triangle_right", "square", "rectangle", "circle", "oval", "regular_polygon", "rhombus", "trapezoid"];

/** 3D math shape IDs (oblique SVG projection). */
export declare const SHAPE_3D_IDS: readonly ["sphere", "cone", "cylinder", "cube", "rectangular_prism", "triangular_prism", "rectangular_pyramid", "pentagonal_pyramid", "hexagonal_prism"];

export declare const SHAPE_IDS: readonly ShapeId[];

export declare function ShapeClassify({ config, width, className }: ShapeClassifyProps): JSX.Element;

/** shape_classify: object id → category; categories list order for display. */
export declare interface ShapeClassifyConfig {
    objects: string[];
    categories: string[];
    correct: Record<string, string>;
}

declare interface ShapeClassifyProps {
    config: ShapeClassifyConfig;
    width?: number;
    className?: string;
}

/**
 * Renders a parametric math shape at (x, y), scaled to fit inside a size×size slot.
 * Shapes are outline-first; set filled=true for 2D fill.
 */
export declare function ShapeDrawing<S extends ShapeId>({ shapeId, params, x, y, size, filled, className, }: ShapeDrawingProps<S>): ReactNode;

export declare interface ShapeDrawingProps<S extends ShapeId = ShapeId> {
    shapeId: S;
    params: Extract<ShapeParams, {
        shapeId: S;
    }>['params'];
    x: number;
    y: number;
    /** Size of the slot (width and height); shape is scaled to fit. Default 32. */
    size?: number;
    /** If true, 2D shapes draw with fill; otherwise outline only. 3D shapes are outline-only. Default false. */
    filled?: boolean;
    className?: string;
}

export declare function ShapeGrid({ config, width, className }: ShapeGridProps): JSX.Element;

/** shape_grid: list of shape names and task (e.g. select_matching_sides). */
export declare interface ShapeGridConfig {
    shapes: string[];
    task: string;
}

declare interface ShapeGridProps {
    config: ShapeGridConfig;
    width?: number;
    className?: string;
}

export declare type ShapeId = Shape2dId | Shape3dId;

export declare type ShapeParams = {
    shapeId: 'triangle_equilateral';
    params: TriangleEquilateralParams;
} | {
    shapeId: 'triangle_isosceles';
    params: TriangleIsoscelesParams;
} | {
    shapeId: 'triangle_right';
    params: TriangleRightParams;
} | {
    shapeId: 'square';
    params: SquareParams;
} | {
    shapeId: 'rectangle';
    params: RectangleParams;
} | {
    shapeId: 'circle';
    params: CircleParams;
} | {
    shapeId: 'oval';
    params: OvalParams;
} | {
    shapeId: 'regular_polygon';
    params: RegularPolygonParams;
} | {
    shapeId: 'rhombus';
    params: RhombusParams;
} | {
    shapeId: 'trapezoid';
    params: TrapezoidParams;
} | {
    shapeId: 'sphere';
    params: SphereParams;
} | {
    shapeId: 'cone';
    params: ConeParams;
} | {
    shapeId: 'cylinder';
    params: CylinderParams;
} | {
    shapeId: 'cube';
    params: CubeParams;
} | {
    shapeId: 'rectangular_prism';
    params: RectangularPrismParams;
} | {
    shapeId: 'triangular_prism';
    params: TriangularPrismParams;
} | {
    shapeId: 'rectangular_pyramid';
    params: RectangularPyramidParams;
} | {
    shapeId: 'pentagonal_pyramid';
    params: PentagonalPyramidParams;
} | {
    shapeId: 'hexagonal_prism';
    params: HexagonalPrismParams;
};

export declare interface ShapeRendererEntry {
    render: (params: unknown, options: ShapeRenderOptions) => ReactNode;
    getBbox: (params: unknown) => BBox;
}

/** Options passed to shape renderers. 2D shapes use filled; 3D shapes are outline-only for now. */
export declare interface ShapeRenderOptions {
    /** If true, 2D shapes are drawn with a fill; otherwise outline only. Default false. */
    filled?: boolean;
}

declare interface SphereParams {
    radius: number;
}

export declare function Spinner({ config, width, className }: SpinnerProps): JSX.Element;

/** spinner: sections with labels, arrow position and turn. */
export declare interface SpinnerConfig {
    sections: number;
    labels: string[];
    arrow_start: string;
    turn_direction: 'clockwise' | 'anti-clockwise';
    turn_amount: string;
}

declare interface SpinnerProps {
    config: SpinnerConfig;
    width?: number;
    className?: string;
}

declare interface SquareParams {
    side: number;
}

export declare function TallyChart({ config, width, className }: TallyChartProps): JSX.Element;

export declare interface TallyChartConfig {
    title: string;
    rows: TallyChartRow[];
}

declare interface TallyChartProps {
    config: TallyChartConfig;
    width?: number;
    className?: string;
}

/** tally_chart: rows with label, value. At most one blank per row; first column (Object) is always filled.
 *  blank: 'tally' = tally cell blank (student fills tally marks); 'count' = count cell blank (student fills number). */
export declare interface TallyChartRow {
    label: string;
    value: number;
    /** Which cell is blank in this row; only one per row. Omit when both tally and count are shown. */
    blank?: 'tally' | 'count';
}

declare interface TrapezoidParams {
    top: number;
    bottom: number;
    height: number;
}

declare interface TriangleEquilateralParams {
    /** Side length, or use radius to derive. */
    side?: number;
    /** Circumradius; used to derive side if side not set. */
    radius?: number;
}

declare interface TriangleIsoscelesParams {
    base: number;
    /** Height from base to apex, or leg length (mutually exclusive with legLength). */
    height?: number;
    legLength?: number;
    /** Optional angle at apex (degrees); for computation. */
    apexAngleDeg?: number;
}

declare interface TriangleRightParams {
    /** Two legs (if both set). */
    legA?: number;
    legB?: number;
    /** Or base and height. */
    base?: number;
    height?: number;
    /** Or one angle in degrees (e.g. 30 → 30-60-90); system computes other angle and side ratios. */
    oneAngleDeg?: number;
}

declare interface TriangularPrismParams {
    baseWidth: number;
    baseHeight: number;
    depth: number;
}

/** Map each VisualType to its config type (none has no config). */
export declare interface VisualConfigMap {
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

export declare function VisualizerDetails(): JSX.Element;

/**
 * Visual type enum matching DB visual_type.
 * 'none' = no visual; all others have a corresponding config and renderer.
 */
export declare type VisualType = 'none' | 'number_line' | 'dice' | 'count_objects' | 'object_array' | 'bar_chart' | 'block_chart' | 'tally_chart' | 'shape_grid' | 'shape_classify' | 'coin_display' | 'fraction_of_set' | 'spinner' | 'matching_pairs' | 'clock_face' | 'weight_scale' | 'option_fill' | 'missing_digits' | 'calculation_choices' | 'item_list' | 'number_pattern';

export declare function WeightScale({ config, width, className }: WeightScaleProps): JSX.Element;

export declare interface WeightScaleConfig {
    items: WeightScaleItem[];
    total: number;
}

/** weight_scale: items with label and grams (null = unknown); total mass. */
export declare interface WeightScaleItem {
    label: string;
    grams: number | null;
}

declare interface WeightScaleProps {
    config: WeightScaleConfig;
    width?: number;
    className?: string;
}

export { }
