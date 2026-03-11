import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Renderers/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const QuarterTurn: Story = {
  args: {
    config: {
      sections: 4,
      labels: ['A', 'B', 'C', 'D'],
      arrow_start: 'A',
      turn_direction: 'anti-clockwise',
      turn_amount: '1/4',
    },
  },
};
