import React from 'react';
import type { Preview } from '@storybook/react';
import './preview.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div style={{ padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
