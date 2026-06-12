import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Nombre', placeholder: 'ej. Plan Profesional' },
};

export const WithHelperText: Story = {
  args: {
    label: 'ID de método de pago (Stripe)',
    placeholder: 'pm_...',
    helperText: 'Ingresa el ID de tu método de pago de Stripe (pm_...).',
  },
};

// DESIGN_SYSTEM.md §9.4 — error de validación: debajo del campo, nunca toast
export const WithError: Story = {
  args: {
    label: 'Email',
    defaultValue: 'admin@empresa',
    errorMessage: 'El email no tiene un formato válido.',
  },
};

export const Disabled: Story = {
  args: { label: 'Moneda', defaultValue: 'USD', disabled: true },
};
