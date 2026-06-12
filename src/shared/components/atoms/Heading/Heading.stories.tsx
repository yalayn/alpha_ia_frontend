import type { Meta, StoryObj } from '@storybook/react';
import { Heading } from './Heading';

const meta = {
  title: 'Atoms/Heading',
  component: Heading,
  tags: ['autodocs'],
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PageTitle: Story = {
  args: { size: 'xl', children: 'Gestión de Planes' },
};

export const SectionSubtitle: Story = {
  args: { size: 'lg', as: 'h2', children: 'Funcionalidades incluidas' },
};

export const ModalTitle: Story = {
  args: { size: '2xl', as: 'h2', children: 'Confirmar suscripción' },
};

// §3.1 — 3xl reservado para métricas destacadas; `as="p"` porque no es encabezado semántico
export const Metric: Story = {
  args: { size: '3xl', as: 'p', children: 'USD 10' },
};

export const AllSizes: Story = {
  args: { children: 'Todas las escalas' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Heading size="lg" as="h3">Subtítulo de sección (lg)</Heading>
      <Heading size="xl" as="h2">Título de página (xl)</Heading>
      <Heading size="2xl" as="h2">Título de modal (2xl)</Heading>
      <Heading size="3xl" as="p">Métrica (3xl)</Heading>
    </div>
  ),
};
