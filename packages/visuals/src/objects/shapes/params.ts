import type { ShapeId } from './shapeIds';

/** Bounding box in canonical (logical) space. Shape is drawn centered; width/height used for fit-to-slot. */
export interface BBox {
  width: number;
  height: number;
}

/** Options passed to shape renderers. */
export interface ShapeRenderOptions {
  /** If true, 2D shapes are drawn with a fill; otherwise outline only. Default false. */
  filled?: boolean;
  /** If true, hidden edges are shown as dotted lines (wireframe). If false, hidden edges are omitted (solid). Default true. */
  wireframe?: boolean;
  /** If true, render as an open-top container with flat-shaded faces. Default false. */
  container?: boolean;
}

// ---- 2D params ----

export interface TriangleEquilateralParams {
  /** Side length, or use radius to derive. */
  side?: number;
  /** Circumradius; used to derive side if side not set. */
  radius?: number;
}

export interface TriangleIsoscelesParams {
  base: number;
  /** Height from base to apex, or leg length (mutually exclusive with legLength). */
  height?: number;
  legLength?: number;
  /** Optional angle at apex (degrees); for computation. */
  apexAngleDeg?: number;
}

export interface TriangleRightParams {
  /** Two legs (if both set). */
  legA?: number;
  legB?: number;
  /** Or base and height. */
  base?: number;
  height?: number;
  /** Or one angle in degrees (e.g. 30 → 30-60-90); system computes other angle and side ratios. */
  oneAngleDeg?: number;
}

export interface SquareParams {
  side: number;
}

export interface RectangleParams {
  width: number;
  height: number;
}

export interface CircleParams {
  radius: number;
}

export interface OvalParams {
  rx: number;
  ry: number;
}

export interface RegularPolygonParams {
  n: number;
  radius?: number;
  sideLength?: number;
}

export interface RhombusParams {
  width: number;
  height: number;
  /** Or side and angle (degrees). */
  side?: number;
  angleDeg?: number;
}

export interface TrapezoidParams {
  top: number;
  bottom: number;
  height: number;
  /** If true, left side is vertical (right-angled trapezoid). Default false (isosceles). */
  rightAngled?: boolean;
}

export interface ParallelogramParams {
  base: number;
  height: number;
  /** Horizontal offset of the top edge relative to the bottom. Default: height * 0.5. */
  offset?: number;
}

export interface KiteParams {
  width: number;
  height: number;
  /** Fraction of height (from top) where the horizontal diagonal sits. Default 0.25. */
  crossRatio?: number;
}

export interface SemicircleParams {
  radius: number;
}

// ---- 3D params ----

export interface SphereParams {
  radius: number;
}

export interface ConeParams {
  radius: number;
  height: number;
  /** Fill height in same units as height. When set, draws fill up to this level. */
  fillHeight?: number;
}

export interface CylinderParams {
  radius: number;
  height: number;
  /** Absolute fill height in same units as height. When set, draws fill and cutting ellipse. */
  fillHeight?: number;
}

export interface CuboidParams {
  /** Shorthand: sets width, length, and height all to this value (cube). */
  side?: number;
  /** Width of the base (front edge). Overrides side. */
  width?: number;
  /** Length/depth of the base (side edge). Overrides side. */
  length?: number;
  /** Height (vertical). Overrides side. */
  height?: number;
  /** Fill height in same units. When set, draws fill and cutting plane at this z. */
  fillHeight?: number;
}

/** @deprecated Use CuboidParams. */
export type CubeParams = CuboidParams;

export interface RectangularPrismParams {
  width: number;
  depth: number;
  height: number;
  fill?: number;
}

export interface TriangularPrismParams {
  /** Side length for an equilateral base. Overridden by baseWidth/baseHeight. */
  side?: number;
  /** Base triangle width. Defaults to side. */
  baseWidth?: number;
  /** Base triangle height. Defaults to equilateral height from side. */
  baseHeight?: number;
  /** Prism height (vertical extent). */
  height: number;
  /** Fill height in same units as height. When set, draws fill and cutting plane. */
  fillHeight?: number;
}

/** @deprecated Use RegularPyramidParams. */
export type RectangularPyramidParams = RegularPyramidParams;

/** @deprecated Use RegularPyramidParams. */
export type PentagonalPyramidParams = RegularPyramidParams;

export interface RegularPyramidParams {
  n: number;
  sideLength?: number;
  radius?: number;
  height: number;
  /** Fill height in same units as height. When set, draws fill up to this level. */
  fillHeight?: number;
}

export interface RegularPrismParams {
  n: number;
  sideLength?: number;
  radius?: number;
  height: number;
  fillHeight?: number;
}

/** @deprecated Use RegularPrismParams. */
export type HexagonalPrismParams = RegularPrismParams;

// ---- Discriminated union: shape id + corresponding params ----

export type ShapeParams =
  | { shapeId: 'triangle_equilateral'; params: TriangleEquilateralParams }
  | { shapeId: 'triangle_equilateral_isometric'; params: TriangleEquilateralParams }
  | { shapeId: 'triangle_isosceles'; params: TriangleIsoscelesParams }
  | { shapeId: 'triangle_isosceles_isometric'; params: TriangleIsoscelesParams }
  | { shapeId: 'triangle_right'; params: TriangleRightParams }
  | { shapeId: 'triangle_right_isometric'; params: TriangleRightParams }
  | { shapeId: 'square'; params: SquareParams }
  | { shapeId: 'square_isometric'; params: SquareParams }
  | { shapeId: 'rectangle'; params: RectangleParams }
  | { shapeId: 'circle'; params: CircleParams }
  | { shapeId: 'circle_isometric'; params: CircleParams }
  | { shapeId: 'oval'; params: OvalParams }
  | { shapeId: 'regular_polygon'; params: RegularPolygonParams }
  | { shapeId: 'regular_polygon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'pentagon'; params: RegularPolygonParams }
  | { shapeId: 'pentagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'hexagon'; params: RegularPolygonParams }
  | { shapeId: 'hexagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'heptagon'; params: RegularPolygonParams }
  | { shapeId: 'heptagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'octagon'; params: RegularPolygonParams }
  | { shapeId: 'octagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'nonagon'; params: RegularPolygonParams }
  | { shapeId: 'nonagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'decagon'; params: RegularPolygonParams }
  | { shapeId: 'decagon_isometric'; params: RegularPolygonParams }
  | { shapeId: 'rhombus'; params: RhombusParams }
  | { shapeId: 'trapezoid'; params: TrapezoidParams }
  | { shapeId: 'parallelogram'; params: ParallelogramParams }
  | { shapeId: 'parallelogram_isometric'; params: ParallelogramParams }
  | { shapeId: 'kite'; params: KiteParams }
  | { shapeId: 'kite_isometric'; params: KiteParams }
  | { shapeId: 'semicircle'; params: SemicircleParams }
  | { shapeId: 'semicircle_isometric'; params: SemicircleParams }
  | { shapeId: 'sphere'; params: SphereParams }
  | { shapeId: 'cone'; params: ConeParams }
  | { shapeId: 'cylinder'; params: CylinderParams }
  | { shapeId: 'cube'; params: CuboidParams }
  | { shapeId: 'rectangular_prism'; params: RectangularPrismParams }
  | { shapeId: 'triangular_prism'; params: TriangularPrismParams }
  | { shapeId: 'triangular_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'rectangular_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'pentagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'hexagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'heptagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'octagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'nonagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'decagonal_pyramid'; params: RegularPyramidParams }
  | { shapeId: 'hexagonal_prism'; params: RegularPrismParams }
  | { shapeId: 'octagonal_prism'; params: RegularPrismParams };

/** Params for a given shape id. */
export type ParamsFor<T extends ShapeId> = Extract<ShapeParams, { shapeId: T }>['params'];
