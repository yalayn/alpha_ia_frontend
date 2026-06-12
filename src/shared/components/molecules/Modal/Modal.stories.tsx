import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';

const meta = {
  title: 'Molecules/Modal',
  component: Modal,
  tags: ['autodocs'],
  // El overlay es position:fixed — fullscreen evita que el frame del docs lo recorte
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: 'Confirmar suscripción',
    children: null,
  },
  render: (args) => (
    <Modal {...args}>
      <div className="flex flex-col gap-4">
        <Input label="ID de método de pago (Stripe)" placeholder="pm_..." />
        <div className="flex justify-end gap-3">
          <Button variant="ghost">Cancelar</Button>
          <Button>Confirmar y pagar</Button>
        </div>
      </div>
    </Modal>
  ),
};

// §8.6 — 360px para confirmaciones; el botón destructivo repite la acción (§12)
export const Confirmation: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: '¿Eliminar plan?',
    width: 'sm',
    children: null,
  },
  render: (args) => (
    <Modal {...args}>
      <div className="flex flex-col gap-4">
        <Text variant="secondary">
          Esta acción no se puede deshacer. Los clientes suscritos no se verán afectados.
        </Text>
        <div className="flex justify-end gap-3">
          <Button variant="ghost">Cancelar</Button>
          <Button variant="danger">Eliminar plan</Button>
        </div>
      </div>
    </Modal>
  ),
};

export const Interactive: Story = {
  args: { isOpen: false, onClose: () => {}, children: null },
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="p-8">
        <Button onClick={() => setIsOpen(true)}>Abrir modal</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal interactivo">
          <Text variant="secondary">Cierra con el botón ×, clic en el overlay o tecla Escape.</Text>
        </Modal>
      </div>
    );
  },
};
