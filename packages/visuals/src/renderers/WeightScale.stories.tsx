import type { Meta, StoryObj } from '@storybook/react';
import { WeightScale } from './WeightScale';

const meta: Meta<typeof WeightScale> = {
  title: 'Renderers/WeightScale',
  component: WeightScale,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof WeightScale>;

export const CardGiftLetter: Story = {
  args: {
    config: {
      items: [
        { label: 'card', grams: 32 },
        { label: 'gift', grams: 47 },
        { label: 'letter', grams: null },
      ],
      total: 100,
    },
  },
};
