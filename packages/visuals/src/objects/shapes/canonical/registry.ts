import type { ReactNode } from 'react';
import type { ShapeId } from '../shapeIds';
import type { BBox, ShapeRenderOptions } from '../params';
import type * as P from '../params';
import { renderTriangleEquilateral, getTriangleEquilateralBbox } from './2d/flat/triangle_equilateral';
import { renderTriangleIsosceles, getTriangleIsoscelesBbox } from './2d/flat/triangle_isosceles';
import { renderTriangleRight, getTriangleRightBbox } from './2d/flat/triangle_right';
import { renderSquare, getSquareBbox } from './2d/flat/square';
import { renderCircle, getCircleBbox } from './2d/flat/circle';
import { renderTriangleEquilateralIsometric, getTriangleEquilateralIsometricBbox } from './2d/isometric/triangle_equilateral';
import { renderTriangleIsoscelesIsometric, getTriangleIsoscelesIsometricBbox } from './2d/isometric/triangle_isosceles';
import { renderTriangleRightIsometric, getTriangleRightIsometricBbox } from './2d/isometric/triangle_right';
import { renderSquareIsometric, getSquareIsometricBbox } from './2d/isometric/square';
import { renderCircleIsometric, getCircleIsometricBbox } from './2d/isometric/circle';
import { renderRegularPolygon, getRegularPolygonBbox } from './2d/flat/regular_polygon';
import { renderRegularPolygonIsometric, getRegularPolygonIsometricBbox } from './2d/isometric/regular_polygon';
import { renderCuboid, getCuboidBbox } from './3d/cuboid';
import { renderCylinder, getCylinderBbox } from './3d/cylinder';
import { renderTriangularPrism, getTriangularPrismBbox } from './3d/triangular_prism';
import { renderPyramid, getPyramidBbox } from './3d/pyramid';
import { renderSphere, getSphereBbox } from './3d/sphere';
import { renderCone, getConeBbox } from './3d/cone';
import { renderRegularPrism, getRegularPrismBbox } from './3d/regular_prism';
import { renderRectangle, getRectangleBbox } from './2d/flat/rectangle';
import { renderOval, getOvalBbox } from './2d/flat/oval';
import { renderRhombus, getRhombusBbox } from './2d/flat/rhombus';
import { renderTrapezoid, getTrapezoidBbox } from './2d/flat/trapezoid';
import { renderParallelogram, getParallelogramBbox } from './2d/flat/parallelogram';
import { renderParallelogramIsometric, getParallelogramIsometricBbox } from './2d/isometric/parallelogram';
import { renderKite, getKiteBbox } from './2d/flat/kite';
import { renderKiteIsometric, getKiteIsometricBbox } from './2d/isometric/kite';
import { renderSemicircle, getSemicircleBbox } from './2d/flat/semicircle';
import { renderSemicircleIsometric, getSemicircleIsometricBbox } from './2d/isometric/semicircle';

export interface ShapeRendererEntry {
  render: (params: unknown, options: ShapeRenderOptions) => ReactNode;
  getBbox: (params: unknown) => BBox;
}

const NAMED_POLYGONS: [ShapeId, ShapeId, number][] = [
  ['pentagon', 'pentagon_isometric', 5],
  ['hexagon', 'hexagon_isometric', 6],
  ['heptagon', 'heptagon_isometric', 7],
  ['octagon', 'octagon_isometric', 8],
  ['nonagon', 'nonagon_isometric', 9],
  ['decagon', 'decagon_isometric', 10],
];

function namedPolygonEntries(): Partial<Record<ShapeId, ShapeRendererEntry>> {
  const entries: Partial<Record<ShapeId, ShapeRendererEntry>> = {};
  for (const [flat, iso, n] of NAMED_POLYGONS) {
    const withN = (p: unknown) => ({ ...(p as P.RegularPolygonParams), n });
    entries[flat] = {
      render: (p, o) => renderRegularPolygon(withN(p), o),
      getBbox: (p) => getRegularPolygonBbox(withN(p)),
    };
    entries[iso] = {
      render: (p, o) => renderRegularPolygonIsometric(withN(p), o),
      getBbox: (p) => getRegularPolygonIsometricBbox(withN(p)),
    };
  }
  return entries;
}

const NAMED_PYRAMIDS: [ShapeId, number][] = [
  ['triangular_pyramid', 3],
  ['rectangular_pyramid', 4],
  ['pentagonal_pyramid', 5],
  ['hexagonal_pyramid', 6],
  ['heptagonal_pyramid', 7],
  ['octagonal_pyramid', 8],
  ['nonagonal_pyramid', 9],
  ['decagonal_pyramid', 10],
];

function namedPyramidEntries(): Partial<Record<ShapeId, ShapeRendererEntry>> {
  const entries: Partial<Record<ShapeId, ShapeRendererEntry>> = {};
  for (const [id, n] of NAMED_PYRAMIDS) {
    const withN = (p: unknown) => ({ ...(p as P.RegularPyramidParams), n });
    entries[id] = {
      render: (p, o) => renderPyramid(withN(p), o),
      getBbox: (p) => getPyramidBbox(withN(p)),
    };
  }
  return entries;
}

const NAMED_PRISMS: [ShapeId, number][] = [
  ['hexagonal_prism', 6],
  ['octagonal_prism', 8],
];

function namedPrismEntries(): Partial<Record<ShapeId, ShapeRendererEntry>> {
  const entries: Partial<Record<ShapeId, ShapeRendererEntry>> = {};
  for (const [id, n] of NAMED_PRISMS) {
    const withN = (p: unknown) => ({ ...(p as P.RegularPrismParams), n });
    entries[id] = {
      render: (p, o) => renderRegularPrism(withN(p), o),
      getBbox: (p) => getRegularPrismBbox(withN(p)),
    };
  }
  return entries;
}

const REGISTRY: Partial<Record<ShapeId, ShapeRendererEntry>> = {
  triangle_equilateral: {
    render: (p, o) => renderTriangleEquilateral(p as P.TriangleEquilateralParams, o),
    getBbox: (p) => getTriangleEquilateralBbox(p as P.TriangleEquilateralParams),
  },
  triangle_equilateral_isometric: {
    render: (p, o) => renderTriangleEquilateralIsometric(p as P.TriangleEquilateralParams, o),
    getBbox: (p) => getTriangleEquilateralIsometricBbox(p as P.TriangleEquilateralParams),
  },
  triangle_isosceles: {
    render: (p, o) => renderTriangleIsosceles(p as P.TriangleIsoscelesParams, o),
    getBbox: (p) => getTriangleIsoscelesBbox(p as P.TriangleIsoscelesParams),
  },
  triangle_isosceles_isometric: {
    render: (p, o) => renderTriangleIsoscelesIsometric(p as P.TriangleIsoscelesParams, o),
    getBbox: (p) => getTriangleIsoscelesIsometricBbox(p as P.TriangleIsoscelesParams),
  },
  triangle_right: {
    render: (p, o) => renderTriangleRight(p as P.TriangleRightParams, o),
    getBbox: (p) => getTriangleRightBbox(p as P.TriangleRightParams),
  },
  triangle_right_isometric: {
    render: (p, o) => renderTriangleRightIsometric(p as P.TriangleRightParams, o),
    getBbox: (p) => getTriangleRightIsometricBbox(p as P.TriangleRightParams),
  },
  square: {
    render: (p, o) => renderSquare(p as P.SquareParams, o),
    getBbox: (p) => getSquareBbox(p as P.SquareParams),
  },
  square_isometric: {
    render: (p, o) => renderSquareIsometric(p as P.SquareParams, o),
    getBbox: (p) => getSquareIsometricBbox(p as P.SquareParams),
  },
  rectangle: {
    render: (p, o) => renderRectangle(p as P.RectangleParams, o),
    getBbox: (p) => getRectangleBbox(p as P.RectangleParams),
  },
  circle: {
    render: (p, o) => renderCircle(p as P.CircleParams, o),
    getBbox: (p) => getCircleBbox(p as P.CircleParams),
  },
  circle_isometric: {
    render: (p, o) => renderCircleIsometric(p as P.CircleParams, o),
    getBbox: (p) => getCircleIsometricBbox(p as P.CircleParams),
  },
  oval: {
    render: (p, o) => renderOval(p as P.OvalParams, o),
    getBbox: (p) => getOvalBbox(p as P.OvalParams),
  },
  rhombus: {
    render: (p, o) => renderRhombus(p as P.RhombusParams, o),
    getBbox: (p) => getRhombusBbox(p as P.RhombusParams),
  },
  trapezoid: {
    render: (p, o) => renderTrapezoid(p as P.TrapezoidParams, o),
    getBbox: (p) => getTrapezoidBbox(p as P.TrapezoidParams),
  },
  parallelogram: {
    render: (p, o) => renderParallelogram(p as P.ParallelogramParams, o),
    getBbox: (p) => getParallelogramBbox(p as P.ParallelogramParams),
  },
  parallelogram_isometric: {
    render: (p, o) => renderParallelogramIsometric(p as P.ParallelogramParams, o),
    getBbox: (p) => getParallelogramIsometricBbox(p as P.ParallelogramParams),
  },
  kite: {
    render: (p, o) => renderKite(p as P.KiteParams, o),
    getBbox: (p) => getKiteBbox(p as P.KiteParams),
  },
  kite_isometric: {
    render: (p, o) => renderKiteIsometric(p as P.KiteParams, o),
    getBbox: (p) => getKiteIsometricBbox(p as P.KiteParams),
  },
  semicircle: {
    render: (p, o) => renderSemicircle(p as P.SemicircleParams, o),
    getBbox: (p) => getSemicircleBbox(p as P.SemicircleParams),
  },
  semicircle_isometric: {
    render: (p, o) => renderSemicircleIsometric(p as P.SemicircleParams, o),
    getBbox: (p) => getSemicircleIsometricBbox(p as P.SemicircleParams),
  },
  regular_polygon: {
    render: (p, o) => renderRegularPolygon(p as P.RegularPolygonParams, o),
    getBbox: (p) => getRegularPolygonBbox(p as P.RegularPolygonParams),
  },
  regular_polygon_isometric: {
    render: (p, o) => renderRegularPolygonIsometric(p as P.RegularPolygonParams, o),
    getBbox: (p) => getRegularPolygonIsometricBbox(p as P.RegularPolygonParams),
  },
  ...namedPolygonEntries(),
  sphere: {
    render: (p, o) => renderSphere(p as P.SphereParams, o),
    getBbox: (p) => getSphereBbox(p as P.SphereParams),
  },
  cone: {
    render: (p, o) => renderCone(p as P.ConeParams, o),
    getBbox: (p) => getConeBbox(p as P.ConeParams),
  },
  cube: {
    render: (p, o) => renderCuboid(p as P.CuboidParams, o),
    getBbox: (p) => getCuboidBbox(p as P.CuboidParams),
  },
  rectangular_prism: {
    render: (p, o) => {
      const pp = p as P.RectangularPrismParams;
      return renderCuboid({ width: pp.width, length: pp.depth, height: pp.height, fillHeight: pp.fill }, o);
    },
    getBbox: (p) => {
      const pp = p as P.RectangularPrismParams;
      return getCuboidBbox({ width: pp.width, length: pp.depth, height: pp.height });
    },
  },
  cylinder: {
    render: (p, o) => renderCylinder(p as P.CylinderParams, o),
    getBbox: (p) => getCylinderBbox(p as P.CylinderParams),
  },
  triangular_prism: {
    render: (p, o) => renderTriangularPrism(p as P.TriangularPrismParams, o),
    getBbox: (p) => getTriangularPrismBbox(p as P.TriangularPrismParams),
  },
  ...namedPyramidEntries(),
  ...namedPrismEntries(),
};

export function getShapeRenderer(shapeId: ShapeId): ShapeRendererEntry | undefined {
  return REGISTRY[shapeId];
}

export function registerShapeRenderer(
  shapeId: ShapeId,
  entry: ShapeRendererEntry
): void {
  (REGISTRY as Record<ShapeId, ShapeRendererEntry>)[shapeId] = entry;
}
