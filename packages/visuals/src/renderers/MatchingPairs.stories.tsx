import type { Meta, StoryObj } from '@storybook/react';
import { MatchingPairs } from './MatchingPairs';

const meta: Meta<typeof MatchingPairs> = {
  title: 'Renderers/MatchingPairs',
  component: MatchingPairs,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof MatchingPairs>;

export const RaceTimes: Story = {
  args: {
    config: {
      left: ['10 minutes', '11 minutes', '13 minutes', '15 minutes'],
      right: ['1st', '2nd', '3rd', '4th'],
      correct: { '10 minutes': '1st', '11 minutes': '2nd', '13 minutes': '3rd', '15 minutes': '4th' },
    },
  },
};

export const Numerals: Story = {
  args: {
    config: {
      left: ['ninety-nine', 'sixteen', 'forty-three'],
      right: ['99', '16', '43'],
      correct: { 'ninety-nine': '99', 'sixteen': '16', 'forty-three': '43' },
    },
  },
};
