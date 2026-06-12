import type { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'Atoms/Text',
  component: Text,
  tags: ['autodocs'],
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Body: Story = {
  args: { children: 'Texto base de la interfaz, para contenido principal.' },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Selecciona el plan que mejor se adapte a las necesidades de tu empresa.',
  },
};

export const Muted: Story = {
  args: { variant: 'muted', children: 'Última actualización: hace 2 días' },
};

export const Label: Story = {
  args: { variant: 'label', as: 'span', children: 'Próximo cobro' },
};

export const WithTone: Story = {
  args: { children: 'Tonos de feedback' },
  render: () => (
    <div className="flex flex-col gap-2">
      <Text variant="secondary" tone="success">La suscripción se activó correctamente.</Text>
      <Text variant="secondary" tone="warning">Tu plan vence en 3 días.</Text>
      <Text variant="secondary" tone="error">El método de pago fue rechazado.</Text>
      <Text variant="secondary" tone="info">El cambio se aplicará al final del ciclo.</Text>
    </div>
  ),
};
