import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Borrador' },
};

export const Brand: Story = {
  args: { variant: 'brand', children: 'Plan Pro' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Activa' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Inactiva' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Cancelada' },
};
