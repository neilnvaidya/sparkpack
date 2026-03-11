import type { Meta, StoryObj } from '@storybook/react';
import { ClockFace } from './ClockFace';

const meta: Meta<typeof ClockFace> = {
  title: 'Renderers/ClockFace',
  component: ClockFace,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ClockFace>;

export const ThreeFifteen: Story = {
  args: {
    config: { hours: 3, minutes: 15 },
  },
};

export const TwelveOClock: Story = {
  args: {
    config: { hours: 12, minutes: 0 },
  },
};
