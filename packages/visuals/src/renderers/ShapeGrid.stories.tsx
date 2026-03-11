import type { Meta, StoryObj } from '@storybook/react';
import { ShapeGrid } from './ShapeGrid';

const meta: Meta<typeof ShapeGrid> = {
  title: 'Renderers/ShapeGrid',
  component: ShapeGrid,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ShapeGrid>;

export const FourShapes: Story = {
  args: {
    config: {
      shapes: ['pentagon', 'hexagon', 'square', 'triangle'],
      task: 'select_matching_sides',
    },
  },
};
