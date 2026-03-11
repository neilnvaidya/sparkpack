import type { Meta, StoryObj } from '@storybook/react';
import { ShapeDrawing } from './index';
import type { ShapeId } from './shapeIds';

const CELL_SIZE = 160;
const SHAPE_SIZE = 120;

type ShapeEntry = {
  id: string;
  label: string;
  shapeId: ShapeId;
  params: Record<string, unknown>;
  filled?: boolean;
  wireframe?: boolean;
  container?: boolean;
};

const CATEGORIES: { title: string; shapes: ShapeEntry[] }[] = [
  {
    title: '2D — Flat',
    shapes: [
      { id: 'tri-eq', label: 'Equilateral △', shapeId: 'triangle_equilateral', params: { side: 2 } },
      { id: 'tri-eq-filled', label: 'Equilateral △ (filled)', shapeId: 'triangle_equilateral', params: { side: 2 }, filled: true },
      { id: 'tri-iso', label: 'Isosceles △', shapeId: 'triangle_isosceles', params: { base: 2, height: 2.5 } },
      { id: 'tri-iso-filled', label: 'Isosceles △ (filled)', shapeId: 'triangle_isosceles', params: { base: 2, height: 2.5 }, filled: true },
      { id: 'tri-right', label: 'Right △', shapeId: 'triangle_right', params: { base: 2, height: 1.5 } },
      { id: 'tri-right-filled', label: 'Right △ (filled)', shapeId: 'triangle_right', params: { base: 2, height: 1.5 }, filled: true },
      { id: 'square', label: 'Square', shapeId: 'square', params: { side: 2 } },
      { id: 'square-filled', label: 'Square (filled)', shapeId: 'square', params: { side: 2 }, filled: true },
      { id: 'rectangle', label: 'Rectangle', shapeId: 'rectangle', params: { width: 3, height: 2 } },
      { id: 'rectangle-filled', label: 'Rectangle (filled)', shapeId: 'rectangle', params: { width: 3, height: 2 }, filled: true },
      { id: 'circle', label: 'Circle', shapeId: 'circle', params: { radius: 1 } },
      { id: 'circle-filled', label: 'Circle (filled)', shapeId: 'circle', params: { radius: 1 }, filled: true },
      { id: 'oval', label: 'Oval', shapeId: 'oval', params: { rx: 1.5, ry: 1 } },
      { id: 'oval-filled', label: 'Oval (filled)', shapeId: 'oval', params: { rx: 1.5, ry: 1 }, filled: true },
      { id: 'rhombus', label: 'Rhombus', shapeId: 'rhombus', params: { width: 2, height: 3 } },
      { id: 'rhombus-filled', label: 'Rhombus (filled)', shapeId: 'rhombus', params: { width: 2, height: 3 }, filled: true },
      { id: 'trapezoid', label: 'Trapezoid', shapeId: 'trapezoid', params: { top: 1.5, bottom: 3, height: 2 } },
      { id: 'trapezoid-filled', label: 'Trapezoid (filled)', shapeId: 'trapezoid', params: { top: 1.5, bottom: 3, height: 2 }, filled: true },
      { id: 'trapezoid-ra', label: 'Right trapezoid', shapeId: 'trapezoid', params: { top: 1.5, bottom: 3, height: 2, rightAngled: true } },
      { id: 'trapezoid-ra-filled', label: 'Right trapezoid (filled)', shapeId: 'trapezoid', params: { top: 1.5, bottom: 3, height: 2, rightAngled: true }, filled: true },
      { id: 'parallelogram', label: 'Parallelogram', shapeId: 'parallelogram', params: { base: 3, height: 2 } },
      { id: 'parallelogram-filled', label: 'Parallelogram (filled)', shapeId: 'parallelogram', params: { base: 3, height: 2 }, filled: true },
      { id: 'kite', label: 'Kite', shapeId: 'kite', params: { width: 2, height: 3 } },
      { id: 'kite-filled', label: 'Kite (filled)', shapeId: 'kite', params: { width: 2, height: 3 }, filled: true },
      { id: 'semicircle', label: 'Semicircle', shapeId: 'semicircle', params: { radius: 1.5 } },
      { id: 'semicircle-filled', label: 'Semicircle (filled)', shapeId: 'semicircle', params: { radius: 1.5 }, filled: true },
      { id: 'pentagon', label: 'Pentagon', shapeId: 'pentagon', params: { sideLength: 1.2 } },
      { id: 'pentagon-filled', label: 'Pentagon (filled)', shapeId: 'pentagon', params: { sideLength: 1.2 }, filled: true },
      { id: 'hexagon', label: 'Hexagon', shapeId: 'hexagon', params: { sideLength: 1.2 } },
      { id: 'hexagon-filled', label: 'Hexagon (filled)', shapeId: 'hexagon', params: { sideLength: 1.2 }, filled: true },
      { id: 'heptagon', label: 'Heptagon', shapeId: 'heptagon', params: { sideLength: 1.2 } },
      { id: 'heptagon-filled', label: 'Heptagon (filled)', shapeId: 'heptagon', params: { sideLength: 1.2 }, filled: true },
      { id: 'octagon', label: 'Octagon', shapeId: 'octagon', params: { sideLength: 1.2 } },
      { id: 'octagon-filled', label: 'Octagon (filled)', shapeId: 'octagon', params: { sideLength: 1.2 }, filled: true },
      { id: 'nonagon', label: 'Nonagon', shapeId: 'nonagon', params: { sideLength: 1.2 } },
      { id: 'nonagon-filled', label: 'Nonagon (filled)', shapeId: 'nonagon', params: { sideLength: 1.2 }, filled: true },
      { id: 'decagon', label: 'Decagon', shapeId: 'decagon', params: { sideLength: 1.2 } },
      { id: 'decagon-filled', label: 'Decagon (filled)', shapeId: 'decagon', params: { sideLength: 1.2 }, filled: true },
    ],
  },
  {
    title: '2D — Isometric',
    shapes: [
      { id: 'tri-eq-iso', label: 'Equilateral △', shapeId: 'triangle_equilateral_isometric', params: { side: 2 } },
      { id: 'tri-eq-iso-filled', label: 'Equilateral △ (filled)', shapeId: 'triangle_equilateral_isometric', params: { side: 2 }, filled: true },
      { id: 'tri-iso-iso', label: 'Isosceles △', shapeId: 'triangle_isosceles_isometric', params: { base: 2, height: 2.5 } },
      { id: 'tri-iso-iso-filled', label: 'Isosceles △ (filled)', shapeId: 'triangle_isosceles_isometric', params: { base: 2, height: 2.5 }, filled: true },
      { id: 'tri-right-iso', label: 'Right △', shapeId: 'triangle_right_isometric', params: { base: 2, height: 1.5 } },
      { id: 'tri-right-iso-filled', label: 'Right △ (filled)', shapeId: 'triangle_right_isometric', params: { base: 2, height: 1.5 }, filled: true },
      { id: 'square-iso', label: 'Square', shapeId: 'square_isometric', params: { side: 2 } },
      { id: 'square-iso-filled', label: 'Square (filled)', shapeId: 'square_isometric', params: { side: 2 }, filled: true },
      { id: 'circle-iso', label: 'Circle', shapeId: 'circle_isometric', params: { radius: 1 } },
      { id: 'circle-iso-filled', label: 'Circle (filled)', shapeId: 'circle_isometric', params: { radius: 1 }, filled: true },
      { id: 'parallelogram-iso', label: 'Parallelogram', shapeId: 'parallelogram_isometric', params: { base: 3, height: 2 } },
      { id: 'parallelogram-iso-filled', label: 'Parallelogram (filled)', shapeId: 'parallelogram_isometric', params: { base: 3, height: 2 }, filled: true },
      { id: 'kite-iso', label: 'Kite', shapeId: 'kite_isometric', params: { width: 2, height: 3 } },
      { id: 'kite-iso-filled', label: 'Kite (filled)', shapeId: 'kite_isometric', params: { width: 2, height: 3 }, filled: true },
      { id: 'semicircle-iso', label: 'Semicircle', shapeId: 'semicircle_isometric', params: { radius: 1.5 } },
      { id: 'semicircle-iso-filled', label: 'Semicircle (filled)', shapeId: 'semicircle_isometric', params: { radius: 1.5 }, filled: true },
      { id: 'pentagon-iso', label: 'Pentagon', shapeId: 'pentagon_isometric', params: { sideLength: 1.2 } },
      { id: 'pentagon-iso-filled', label: 'Pentagon (filled)', shapeId: 'pentagon_isometric', params: { sideLength: 1.2 }, filled: true },
      { id: 'hexagon-iso', label: 'Hexagon', shapeId: 'hexagon_isometric', params: { sideLength: 1.2 } },
      { id: 'hexagon-iso-filled', label: 'Hexagon (filled)', shapeId: 'hexagon_isometric', params: { sideLength: 1.2 }, filled: true },
      { id: 'heptagon-iso', label: 'Heptagon', shapeId: 'heptagon_isometric', params: { sideLength: 1.2 } },
      { id: 'heptagon-iso-filled', label: 'Heptagon (filled)', shapeId: 'heptagon_isometric', params: { sideLength: 1.2 }, filled: true },
      { id: 'octagon-iso', label: 'Octagon', shapeId: 'octagon_isometric', params: { sideLength: 1.2 } },
      { id: 'octagon-iso-filled', label: 'Octagon (filled)', shapeId: 'octagon_isometric', params: { sideLength: 1.2 }, filled: true },
      { id: 'nonagon-iso', label: 'Nonagon', shapeId: 'nonagon_isometric', params: { sideLength: 1.2 } },
      { id: 'nonagon-iso-filled', label: 'Nonagon (filled)', shapeId: 'nonagon_isometric', params: { sideLength: 1.2 }, filled: true },
      { id: 'decagon-iso', label: 'Decagon', shapeId: 'decagon_isometric', params: { sideLength: 1.2 } },
      { id: 'decagon-iso-filled', label: 'Decagon (filled)', shapeId: 'decagon_isometric', params: { sideLength: 1.2 }, filled: true },
    ],
  },
  {
    title: '3D — Sphere & Cone',
    shapes: [
      { id: 'sphere', label: 'Sphere', shapeId: 'sphere', params: { radius: 1.5 } },
      { id: 'sphere-solid', label: 'Sphere (solid)', shapeId: 'sphere', params: { radius: 1.5 }, wireframe: false },
      { id: 'cone', label: 'Cone', shapeId: 'cone', params: { radius: 1.2, height: 3 } },
      { id: 'cone-solid', label: 'Cone (solid)', shapeId: 'cone', params: { radius: 1.2, height: 3 }, wireframe: false },
      { id: 'cone-filled', label: 'Cone (filled)', shapeId: 'cone', params: { radius: 1.2, height: 3, fillHeight: 1.5 } },
    ],
  },
  {
    title: '3D — Cuboid family',
    shapes: [
      { id: 'cube', label: 'Cube', shapeId: 'cube', params: { side: 2 } },
      { id: 'cube-solid', label: 'Cube (solid)', shapeId: 'cube', params: { side: 2 }, wireframe: false },
      { id: 'cube-filled', label: 'Cube (filled)', shapeId: 'cube', params: { side: 2, fillHeight: 1.2 } },
      { id: 'cube-container', label: 'Cube (container)', shapeId: 'cube', params: { side: 2 }, container: true },
      { id: 'cube-container-filled', label: 'Cube (container filled)', shapeId: 'cube', params: { side: 2, fillHeight: 1.2 }, container: true },
      { id: 'cuboid', label: 'Cuboid', shapeId: 'cube', params: { width: 3, length: 2, height: 4 } },
      { id: 'cuboid-solid', label: 'Cuboid (solid)', shapeId: 'cube', params: { width: 3, length: 2, height: 4 }, wireframe: false },
      { id: 'cuboid-filled', label: 'Cuboid (filled)', shapeId: 'cube', params: { width: 3, length: 2, height: 4, fillHeight: 2.5 } },
      { id: 'cuboid-container', label: 'Cuboid (container)', shapeId: 'cube', params: { width: 3, length: 2, height: 4 }, container: true },
      { id: 'cuboid-container-filled', label: 'Cuboid (container filled)', shapeId: 'cube', params: { width: 3, length: 2, height: 4, fillHeight: 2.5 }, container: true },
    ],
  },
  {
    title: '3D — Cylinder family',
    shapes: [
      { id: 'cylinder', label: 'Cylinder', shapeId: 'cylinder', params: { radius: 1, height: 2 } },
      { id: 'cylinder-solid', label: 'Cylinder (solid)', shapeId: 'cylinder', params: { radius: 1, height: 2 }, wireframe: false },
      { id: 'cylinder-filled', label: 'Cylinder (filled)', shapeId: 'cylinder', params: { radius: 1, height: 2, fillHeight: 1.2 } },
    ],
  },
  {
    title: '3D — Prisms',
    shapes: [
      { id: 'tri-prism-eq', label: 'Equilateral prism', shapeId: 'triangular_prism', params: { side: 2, height: 3 } },
      { id: 'tri-prism-eq-solid', label: 'Equilateral prism (solid)', shapeId: 'triangular_prism', params: { side: 2, height: 3 }, wireframe: false },
      { id: 'tri-prism-eq-filled', label: 'Equilateral prism (filled)', shapeId: 'triangular_prism', params: { side: 2, height: 3, fillHeight: 2 } },
      { id: 'tri-prism-iso', label: 'Isosceles prism', shapeId: 'triangular_prism', params: { baseWidth: 2, baseHeight: 3, height: 3 } },
      { id: 'tri-prism-iso-solid', label: 'Isosceles prism (solid)', shapeId: 'triangular_prism', params: { baseWidth: 2, baseHeight: 3, height: 3 }, wireframe: false },
      { id: 'tri-prism-iso-filled', label: 'Isosceles prism (filled)', shapeId: 'triangular_prism', params: { baseWidth: 2, baseHeight: 3, height: 3, fillHeight: 2 } },
      { id: 'hex-prism', label: 'Hexagonal prism', shapeId: 'hexagonal_prism', params: { sideLength: 1.2, height: 3 } },
      { id: 'hex-prism-solid', label: 'Hexagonal prism (solid)', shapeId: 'hexagonal_prism', params: { sideLength: 1.2, height: 3 }, wireframe: false },
      { id: 'hex-prism-filled', label: 'Hexagonal prism (filled)', shapeId: 'hexagonal_prism', params: { sideLength: 1.2, height: 3, fillHeight: 1.8 } },
      { id: 'oct-prism', label: 'Octagonal prism', shapeId: 'octagonal_prism', params: { sideLength: 1, height: 3 } },
      { id: 'oct-prism-solid', label: 'Octagonal prism (solid)', shapeId: 'octagonal_prism', params: { sideLength: 1, height: 3 }, wireframe: false },
      { id: 'oct-prism-filled', label: 'Octagonal prism (filled)', shapeId: 'octagonal_prism', params: { sideLength: 1, height: 3, fillHeight: 1.8 } },
    ],
  },
  {
    title: '3D — Pyramids',
    shapes: [
      { id: 'tri-pyramid', label: 'Triangular pyramid', shapeId: 'triangular_pyramid', params: { sideLength: 2, height: 3 } },
      { id: 'tri-pyramid-solid', label: 'Triangular pyramid (solid)', shapeId: 'triangular_pyramid', params: { sideLength: 2, height: 3 }, wireframe: false },
      { id: 'tri-pyramid-filled', label: 'Triangular pyramid (filled)', shapeId: 'triangular_pyramid', params: { sideLength: 2, height: 3, fillHeight: 1.5 } },
      { id: 'rect-pyramid', label: 'Rectangular pyramid', shapeId: 'rectangular_pyramid', params: { sideLength: 2, height: 3 } },
      { id: 'rect-pyramid-solid', label: 'Rectangular pyramid (solid)', shapeId: 'rectangular_pyramid', params: { sideLength: 2, height: 3 }, wireframe: false },
      { id: 'rect-pyramid-filled', label: 'Rectangular pyramid (filled)', shapeId: 'rectangular_pyramid', params: { sideLength: 2, height: 3, fillHeight: 1.5 } },
      { id: 'pent-pyramid', label: 'Pentagonal pyramid', shapeId: 'pentagonal_pyramid', params: { sideLength: 1.5, height: 3.5 } },
      { id: 'pent-pyramid-solid', label: 'Pentagonal pyramid (solid)', shapeId: 'pentagonal_pyramid', params: { sideLength: 1.5, height: 3.5 }, wireframe: false },
      { id: 'pent-pyramid-filled', label: 'Pentagonal pyramid (filled)', shapeId: 'pentagonal_pyramid', params: { sideLength: 1.5, height: 3.5, fillHeight: 1.8 } },
      { id: 'hex-pyramid', label: 'Hexagonal pyramid', shapeId: 'hexagonal_pyramid', params: { sideLength: 1.5, height: 3.5 } },
      { id: 'hex-pyramid-solid', label: 'Hexagonal pyramid (solid)', shapeId: 'hexagonal_pyramid', params: { sideLength: 1.5, height: 3.5 }, wireframe: false },
      { id: 'hex-pyramid-filled', label: 'Hexagonal pyramid (filled)', shapeId: 'hexagonal_pyramid', params: { sideLength: 1.5, height: 3.5, fillHeight: 1.8 } },
      { id: 'hept-pyramid', label: 'Heptagonal pyramid', shapeId: 'heptagonal_pyramid', params: { sideLength: 1.5, height: 4 } },
      { id: 'hept-pyramid-solid', label: 'Heptagonal pyramid (solid)', shapeId: 'heptagonal_pyramid', params: { sideLength: 1.5, height: 4 }, wireframe: false },
      { id: 'hept-pyramid-filled', label: 'Heptagonal pyramid (filled)', shapeId: 'heptagonal_pyramid', params: { sideLength: 1.5, height: 4, fillHeight: 2 } },
      { id: 'oct-pyramid', label: 'Octagonal pyramid', shapeId: 'octagonal_pyramid', params: { sideLength: 1.5, height: 4 } },
      { id: 'oct-pyramid-solid', label: 'Octagonal pyramid (solid)', shapeId: 'octagonal_pyramid', params: { sideLength: 1.5, height: 4 }, wireframe: false },
      { id: 'oct-pyramid-filled', label: 'Octagonal pyramid (filled)', shapeId: 'octagonal_pyramid', params: { sideLength: 1.5, height: 4, fillHeight: 2 } },
      { id: 'non-pyramid', label: 'Nonagonal pyramid', shapeId: 'nonagonal_pyramid', params: { sideLength: 1.5, height: 4.5 } },
      { id: 'non-pyramid-solid', label: 'Nonagonal pyramid (solid)', shapeId: 'nonagonal_pyramid', params: { sideLength: 1.5, height: 4.5 }, wireframe: false },
      { id: 'non-pyramid-filled', label: 'Nonagonal pyramid (filled)', shapeId: 'nonagonal_pyramid', params: { sideLength: 1.5, height: 4.5, fillHeight: 2.2 } },
      { id: 'dec-pyramid', label: 'Decagonal pyramid', shapeId: 'decagonal_pyramid', params: { sideLength: 1.5, height: 4.5 } },
      { id: 'dec-pyramid-solid', label: 'Decagonal pyramid (solid)', shapeId: 'decagonal_pyramid', params: { sideLength: 1.5, height: 4.5 }, wireframe: false },
      { id: 'dec-pyramid-filled', label: 'Decagonal pyramid (filled)', shapeId: 'decagonal_pyramid', params: { sideLength: 1.5, height: 4.5, fillHeight: 2.2 } },
    ],
  },
];

const ALL_SHAPES = CATEGORIES.flatMap((c) => c.shapes);

function ShapeCell({ entry }: { entry: ShapeEntry }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <svg
        width={CELL_SIZE}
        height={CELL_SIZE}
        viewBox={`0 0 ${CELL_SIZE} ${CELL_SIZE}`}
        style={{ overflow: 'visible' }}
      >
        <ShapeDrawing
          shapeId={entry.shapeId}
          params={entry.params}
          x={CELL_SIZE / 2}
          y={CELL_SIZE / 2}
          size={SHAPE_SIZE}
          filled={entry.filled}
          wireframe={entry.wireframe}
          container={entry.container}
        />
      </svg>
      <span
        style={{
          fontSize: 13,
          fontFamily: 'system-ui, sans-serif',
          color: 'var(--sp-visual-text, #374151)',
          textAlign: 'center',
        }}
      >
        {entry.label}
      </span>
    </div>
  );
}

function ShapesGrid() {
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      {CATEGORIES.map(({ title, shapes }) => (
        <section
          key={title}
          style={{
            marginBottom: 32,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'system-ui, sans-serif',
              color: 'var(--sp-visual-text, #111827)',
              marginBottom: 12,
              paddingBottom: 4,
              borderBottom: '1px solid var(--sp-visual-border, #e5e7eb)',
            }}
          >
            {title}
            <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: 8 }}>({shapes.length})</span>
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            {shapes.map((s) => (
              <ShapeCell key={s.id} entry={s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ShapesGridFlat() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 24,
        padding: 24,
        maxWidth: 900,
      }}
    >
      {ALL_SHAPES.map((s) => (
        <ShapeCell key={s.id} entry={s} />
      ))}
    </div>
  );
}

const meta: Meta<typeof ShapesGrid> = {
  title: 'Objects/Shapes',
  component: ShapesGrid,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ShapesGrid>;

export const ByCategory: Story = {
  render: () => <ShapesGrid />,
  parameters: {
    docs: {
      description: {
        story: 'Parametric math shapes grouped by category. Includes 2D (flat & isometric), 3D solids, prisms, and pyramids in wireframe, solid, and filled variants.',
      },
    },
  },
};

export const AllFlat: Story = {
  render: () => <ShapesGridFlat />,
  parameters: {
    docs: {
      description: {
        story: 'All parametric math shapes in a single flat grid.',
      },
    },
  },
};
