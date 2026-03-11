import type { Meta, StoryObj } from '@storybook/react';
import { VisualizerDetails } from './VisualizerDetails';

const meta: Meta<typeof VisualizerDetails> = {
  title: 'Visualizer/Details',
  component: VisualizerDetails,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof VisualizerDetails>;

export const Default: Story = {};
