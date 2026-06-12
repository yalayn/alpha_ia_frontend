import type { Meta, StoryObj } from '@storybook/react';
import { TextLink } from './TextLink';
import { Text } from '../Text';

const meta = {
  title: 'Atoms/TextLink',
  component: TextLink,
  tags: ['autodocs'],
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { href: '#', children: 'Ver detalle del plan' },
};

export const InlineInText: Story = {
  args: { children: 'Regístrate' },
  render: () => (
    <Text variant="secondary">
      ¿Aún no tienes cuenta? <TextLink href="#">Regístrate</TextLink>
    </Text>
  ),
};
