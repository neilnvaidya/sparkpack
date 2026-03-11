import type { Meta, StoryObj } from '@storybook/react';
import { TallyChart } from './TallyChart';

const meta: Meta<typeof TallyChart> = {
  title: 'Renderers/TallyChart',
  component: TallyChart,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof TallyChart>;

export const BirdsInGarden: Story = {
  args: {
    config: {
      title: 'Birds in the garden',
      rows: [
        { label: 'robin', value: 3 },
        { label: 'blue tit', value: 5, blank: 'count' },
        { label: 'sparrow', value: 10 },
      ],
    },
  },
};
