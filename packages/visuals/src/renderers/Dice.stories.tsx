import type { Meta, StoryObj } from '@storybook/react';
import { Dice } from './Dice';

const meta: Meta<typeof Dice> = {
  title: 'Renderers/Dice',
  component: Dice,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof Dice>;

export const Five: Story = {
  args: { config: { value: 5 } },
};

export const One: Story = {
  args: { config: { value: 1 } },
};

export const Six: Story = {
  args: { config: { value: 6 } },
};
