import type { Meta, StoryObj } from '@storybook/react';
import { OBJECT_IDS_WITH_DRAWINGS } from './drawings';
import { ObjectDrawing } from './ObjectLibrary';

const CELL_SIZE = 96;
const DRAWING_SIZE = 72;

const HAS_DRAWING = new Set<string>(OBJECT_IDS_WITH_DRAWINGS);

/** Logical categories; only include ids that have an SVG drawing. */
const CATEGORIES: { title: string; ids: readonly string[] }[] = [
  { title: 'Containers & packages', ids: ['bag', 'tin_can', 'cereal_box'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Party & treats', ids: ['party_hat', 'balloon', 'cupcake', 'cookie'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Fruit & small items', ids: ['apple', 'orange', 'banana', 'pear'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Nature & sky', ids: ['flower', 'sun', 'moon', 'cloud', 'tree'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Animals', ids: ['duck', 'bird', 'fish', 'cat', 'dog'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Vehicles', ids: ['boat', 'airplane', 'toy_car', 'bicycle'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Furniture', ids: ['chair'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Dining', ids: ['cup', 'bottle'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Office / school', ids: ['book', 'pencil'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Keys & lock', ids: ['key', 'lock'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Electronics', ids: ['laptop', 'camera', 'clock', 'lightbulb'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Music', ids: ['guitar'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Mail & gifts', ids: ['envelope', 'gift'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Outdoor / misc', ids: ['umbrella', 'flag', 'button'].filter((id) => HAS_DRAWING.has(id)) },
  { title: 'Buildings', ids: ['house'].filter((id) => HAS_DRAWING.has(id)) },
].filter((c) => c.ids.length > 0);

function formatName(id: string): string {
  return id
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function DrawingCell({ id }: { id: string }) {
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
        <ObjectDrawing objectId={id} x={CELL_SIZE / 2} y={CELL_SIZE / 2} size={DRAWING_SIZE} />
      </svg>
      <span
        style={{
          fontSize: 13,
          fontFamily: 'system-ui, sans-serif',
          color: 'var(--sp-visual-text, #374151)',
          textAlign: 'center',
        }}
      >
        {formatName(id)}
      </span>
    </div>
  );
}

function DrawingsGrid() {
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      {CATEGORIES.map(({ title, ids }) => (
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
            <span style={{ fontWeight: 400, color: '#6b7280', marginLeft: 8 }}>({ids.length})</span>
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
            }}
          >
            {ids.map((id) => (
              <DrawingCell key={id} id={id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Flat grid of all SVG drawings (only objects that have an SVG). */
function DrawingsGridFlat() {
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
      {OBJECT_IDS_WITH_DRAWINGS.map((id) => (
        <DrawingCell key={id} id={id} />
      ))}
    </div>
  );
}

const meta: Meta<typeof DrawingsGrid> = {
  title: 'Objects/Drawings',
  component: DrawingsGrid,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof DrawingsGrid>;

export const ByCategory: Story = {
  render: () => <DrawingsGrid />,
  parameters: {
    docs: {
      description: {
        story: 'SVG object drawings grouped by category. Only objects with a downloaded SVG are shown (marble, strawberry, star, table, phone have no SVG yet).',
      },
    },
  },
};

export const AllFlat: Story = {
  render: () => <DrawingsGridFlat />,
  parameters: {
    docs: {
      description: {
        story: 'All SVG object drawings in a single grid. Generated from SVG files in objects/drawings (run scripts/generate-drawings.mjs after adding SVGs).',
      },
    },
  },
};
