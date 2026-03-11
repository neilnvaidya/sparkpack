import type { Meta, StoryObj } from '@storybook/react';
import { ShapeClassify } from './ShapeClassify';

const meta: Meta<typeof ShapeClassify> = {
  title: 'Renderers/ShapeClassify',
  component: ShapeClassify,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ShapeClassify>;

export const ThreeDShapes: Story = {
  args: {
    config: {
      objects: ['box', 'tin_can', 'cereal_box', 'party_hat'],
      categories: ['cuboid', 'cylinder', 'cuboid', 'cone'],
      correct: {
        box: 'cuboid',
        tin_can: 'cylinder',
        cereal_box: 'cuboid',
        party_hat: 'cone',
      },
    },
  },
};
