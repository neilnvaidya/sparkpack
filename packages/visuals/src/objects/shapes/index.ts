export {
  SHAPE_2D_IDS,
  SHAPE_3D_IDS,
  SHAPE_IDS,
  isShapeId,
  type ShapeId,
  type Shape2dId,
  type Shape3dId,
} from './shapeIds';
export type {
  BBox,
  ShapeParams,
  ParamsFor,
  TriangleEquilateralParams,
  TriangleIsoscelesParams,
  TriangleRightParams,
  SquareParams,
  RectangleParams,
  CircleParams,
  OvalParams,
  RegularPolygonParams,
  RhombusParams,
  TrapezoidParams,
  ParallelogramParams,
  KiteParams,
  SemicircleParams,
  SphereParams,
  ConeParams,
  CylinderParams,
  CuboidParams,
  CubeParams,
  RectangularPrismParams,
  TriangularPrismParams,
  RectangularPyramidParams,
  PentagonalPyramidParams,
  HexagonalPrismParams,
  RegularPrismParams,
  RegularPyramidParams,
} from './params';
export { ShapeDrawing, type ShapeDrawingProps } from './ShapeDrawing';
export type { ShapeRenderOptions } from './params';
export { getShapeRenderer, registerShapeRenderer } from './canonical/registry';
export { projectIsometric, projectPathIsometric } from './canonical/isometric';
export type { ShapeRendererEntry } from './canonical/registry';
