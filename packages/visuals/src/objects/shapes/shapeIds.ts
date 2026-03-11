/** 2D math shape IDs. */
export const SHAPE_2D_IDS = [
  'triangle_equilateral',
  'triangle_equilateral_isometric',
  'triangle_isosceles',
  'triangle_isosceles_isometric',
  'triangle_right',
  'triangle_right_isometric',
  'square',
  'square_isometric',
  'rectangle',
  'circle',
  'circle_isometric',
  'oval',
  'regular_polygon',
  'regular_polygon_isometric',
  'pentagon',
  'pentagon_isometric',
  'hexagon',
  'hexagon_isometric',
  'heptagon',
  'heptagon_isometric',
  'octagon',
  'octagon_isometric',
  'nonagon',
  'nonagon_isometric',
  'decagon',
  'decagon_isometric',
  'rhombus',
  'trapezoid',
  'parallelogram',
  'parallelogram_isometric',
  'kite',
  'kite_isometric',
  'semicircle',
  'semicircle_isometric',
] as const;

/** 3D math shape IDs (oblique SVG projection). */
export const SHAPE_3D_IDS = [
  'sphere',
  'cone',
  'cylinder',
  'cube',
  'rectangular_prism',
  'triangular_prism',
  'triangular_pyramid',
  'rectangular_pyramid',
  'pentagonal_pyramid',
  'hexagonal_pyramid',
  'heptagonal_pyramid',
  'octagonal_pyramid',
  'nonagonal_pyramid',
  'decagonal_pyramid',
  'hexagonal_prism',
  'octagonal_prism',
] as const;

export type Shape2dId = (typeof SHAPE_2D_IDS)[number];
export type Shape3dId = (typeof SHAPE_3D_IDS)[number];
export type ShapeId = Shape2dId | Shape3dId;

export const SHAPE_IDS: readonly ShapeId[] = [...SHAPE_2D_IDS, ...SHAPE_3D_IDS];

export function isShapeId(id: string): id is ShapeId {
  return (SHAPE_IDS as readonly string[]).includes(id);
}
