import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'Molecules/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

// DESIGN_SYSTEM.md §9.4 — mensajes específicos, nunca "Algo salió mal."
export const Default: Story = {
  args: {
    error: new Error('No se pudo cargar la lista de planes. Verifica tu conexión.'),
  },
};

export const WithRetry: Story = {
  args: {
    error: new Error('No se pudo cargar tu suscripción.'),
    onRetry: () => {},
  },
};

export const FromApiError: Story = {
  args: {
    error: {
      response: {
        data: {
          error: 'subscription_not_found',
          message: 'El cliente no tiene ninguna suscripción.',
        },
      },
    },
  },
};
