import type { Meta, StoryObj } from '@storybook/react';
import { Package, SearchX } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from '../../atoms/Button';

const meta = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

// DESIGN_SYSTEM.md §12 — título posesivo/contextual, no "Sin resultados"
export const WithAction: Story = {
  args: {
    icon: Package,
    title: 'Aún no tienes un plan',
    description: 'Elige uno para comenzar a usar la plataforma.',
    action: <Button>Elige tu plan</Button>,
  },
};

export const WithoutAction: Story = {
  args: {
    icon: SearchX,
    title: 'Aún no hay planes publicados',
    description: 'Los planes que crees aparecerán aquí.',
  },
};

export const TitleOnly: Story = {
  args: { title: 'Aún no tienes notificaciones' },
};
