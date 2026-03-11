import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Renderers/BarChart',
  component: BarChart,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const AnimalsInPond: Story = {
  args: {
    config: {
      title: 'Animals in a pond',
      x_label: 'Animal',
      y_label: 'Count',
      scale: 1,
      bars: [
        { label: 'duck', value: 4, given: false },
        { label: 'frog', value: 3, given: true },
        { label: 'fish', value: 6, given: true },
      ],
    },
  },
};
