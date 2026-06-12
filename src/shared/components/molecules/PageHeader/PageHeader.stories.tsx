import type { Meta, StoryObj } from '@storybook/react';
import { PageHeader } from './PageHeader';
import { Button } from '../../atoms/Button';

const meta = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Gestión de Planes' },
};

export const WithDescription: Story = {
  args: {
    title: 'Elige tu plan',
    description: 'Selecciona el plan que mejor se adapte a las necesidades de tu empresa.',
  },
};

// DESIGN_SYSTEM.md §7.4 — título + acción primaria de la página
export const WithAction: Story = {
  args: {
    title: 'Gestión de Planes',
    description: 'Crea y administra los planes de la plataforma.',
    action: <Button>Crear plan</Button>,
  },
};
