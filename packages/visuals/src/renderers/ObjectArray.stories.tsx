import type { Meta, StoryObj } from '@storybook/react';
import { ObjectArray } from './ObjectArray';

const meta: Meta<typeof ObjectArray> = {
  title: 'Renderers/ObjectArray',
  component: ObjectArray,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof ObjectArray>;

export const ThreeGroupsOfThree: Story = {
  args: {
    config: { groups: 3, items_per_group: 3, object: 'marble' },
  },
};
