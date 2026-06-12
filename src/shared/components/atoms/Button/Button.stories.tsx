import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// DESIGN_SYSTEM.md §8.2 — un solo `primary` por vista
export const Primary: Story = {
  args: { variant: 'primary', children: 'Crear plan' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cambiar plan' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Eliminar plan' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Cancelar' },
};

export const Small: Story = {
  args: { size: 'sm', variant: 'secondary', children: 'Editar' },
};

export const Loading: Story = {
  args: { isLoading: true, children: 'Guardando...' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Confirmar y pagar' },
};
