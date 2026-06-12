import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';

const meta = {
  title: 'Molecules/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BodyOnly: Story = {
  args: { children: null },
  render: () => (
    <Card className="w-96">
      <CardBody>
        <Text>Contenido simple de una card sin header ni footer.</Text>
      </CardBody>
    </Card>
  ),
};

// DESIGN_SYSTEM.md §8.1 — anatomía completa: header + body + footer
export const FullAnatomy: Story = {
  args: { children: null },
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Heading size="lg" as="h2">Mi Suscripción</Heading>
          <Badge variant="success">Activa</Badge>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-2">
        <Text><Text variant="label" as="span">Plan:</Text> Pro — 10 USD/mes</Text>
        <Text><Text variant="label" as="span">Renovación:</Text> 10 jul 2026</Text>
      </CardBody>
      <CardFooter className="flex gap-3">
        <Button variant="secondary" size="sm">Cambiar plan</Button>
        <Button variant="danger" size="sm">Cancelar</Button>
      </CardFooter>
    </Card>
  ),
};
