import type { Meta, StoryObj } from '@storybook/react';
import { CountObjects } from './CountObjects';

const meta: Meta<typeof CountObjects> = {
  title: 'Renderers/CountObjects',
  component: CountObjects,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof CountObjects>;

export const TwoGroupsOfApples: Story = {
  args: {
    config: {
      groups: [
        { object: 'apple', count: 3 },
        { object: 'apple', count: 2 },
      ],
    },
  },
};
