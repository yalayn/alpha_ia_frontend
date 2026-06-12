import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const intervalOptions = [
  { value: 'month', label: 'Mensual' },
  { value: 'year', label: 'Anual' },
];

const meta = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Intervalo', options: intervalOptions },
};

export const WithHelperText: Story = {
  args: {
    label: 'Intervalo',
    options: intervalOptions,
    helperText: 'El intervalo no puede cambiarse después de crear el plan.',
  },
};

export const WithError: Story = {
  args: {
    label: 'Intervalo',
    options: intervalOptions,
    errorMessage: 'Selecciona un intervalo.',
  },
};

export const Disabled: Story = {
  args: { label: 'Intervalo', options: intervalOptions, disabled: true },
};
