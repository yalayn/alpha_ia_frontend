import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    // Los args `onXxx` se registran como acciones en el panel Actions
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'base',
      values: [
        { name: 'base', value: '#F8F9FA' },     // --color-bg-base
        { name: 'surface', value: '#FFFFFF' },  // --color-bg-surface
      ],
    },
  },
};

export default preview;
