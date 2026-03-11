import type { Meta, StoryObj } from '@storybook/react';
import { CoinDisplay } from './CoinDisplay';

const meta: Meta<typeof CoinDisplay> = {
  title: 'Renderers/CoinDisplay',
  component: CoinDisplay,
  parameters: { layout: 'centered' },
};

export default meta;

type Story = StoryObj<typeof CoinDisplay>;

export const BenAndSita: Story = {
  args: {
    config: {
      sets: {
        ben: ['50p', '20p', '10p', '5p'],
        sita: ['20p', '10p', '2p', '1p'],
      },
    },
  },
};
