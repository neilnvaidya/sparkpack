import type { Meta, StoryObj } from '@storybook/react';
import { NumberLine } from './NumberLine';

const meta: Meta<typeof NumberLine> = {
  title: 'Renderers/NumberLine',
  component: NumberLine,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof NumberLine>;

export const FiftyToSeventy: Story = {
  args: {
    config: { min: 50, max: 70, interval: 5, labelled: [50, 60, 70], blank: [55, 65] },
    width: 400,
  },
};

export const ZeroToTwenty: Story = {
  args: {
    config: { min: 0, max: 20, interval: 2, labelled: [0, 10, 20], blank: [5, 15] },
  },
};
