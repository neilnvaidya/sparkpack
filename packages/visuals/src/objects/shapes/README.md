# Math shapes library

Parametric 2D and 3D (oblique SVG) math shapes for visuals. Shapes are drawn in a logical coordinate system with correct proportions, then scaled to fit a slot.

## Usage

```tsx
import { ShapeDrawing } from '@sparkpack/visuals';

<svg viewBox="0 0 200 200">
  <ShapeDrawing
    shapeId="cylinder"
    params={{ radius: 1, height: 2, fill: 0.5 }}
    x={100}
    y={100}
    size={80}
  />
</svg>
```

## 2D shapes

Triangle (equilateral, isosceles, right with optional `oneAngleDeg` for e.g. 30-60-90), square, rectangle, circle, oval, regular polygon, rhombus, trapezoid.

## 3D shapes (oblique projection)

Sphere, cone, cylinder, cube, rectangular prism, triangular prism, rectangular pyramid, pentagonal pyramid, hexagonal prism. Cylinder and rectangular prism support `fill` in [0, 1] for “filled to height”.

## Extending

1. Add the shape id to `shapeIds.ts`.
2. Add the param type to `params.ts` and the `ShapeParams` union.
3. Implement `render*` and `get*Bbox` in `canonical/shape2d.tsx` or `shape3d.tsx`.
4. Register in `canonical/registry.ts`.

## Triangle angles

For right triangles, use `oneAngleDeg` (e.g. 30) to get a 30-60-90 triangle. Use `computeTriangleRight(params)` to get all angles and side lengths for trig/volume logic.
