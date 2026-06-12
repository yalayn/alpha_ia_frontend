import type { Meta, StoryObj } from '@storybook/react';
import { CheckList } from './CheckList';

const meta = {
  title: 'Molecules/CheckList',
  component: CheckList,
  tags: ['autodocs'],
} satisfies Meta<typeof CheckList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: ['ai_chat', 'image_gen', 'soporte prioritario'],
  },
};

export const SingleItem: Story = {
  args: { items: ['Plan adaptado a profesionales'] },
};
