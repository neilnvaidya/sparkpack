import type { Meta, StoryObj } from '@storybook/react';
import { FractionOfSet } from './FractionOfSet';

const meta: Meta<typeof FractionOfSet> = {
  title: 'Renderers/FractionOfSet',
  component: FractionOfSet,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof FractionOfSet>;

export const HalfOfCars: Story = {
  args: {
    config: { fraction: '1/2', items_shown: 4, object: 'car' },
  },
};
