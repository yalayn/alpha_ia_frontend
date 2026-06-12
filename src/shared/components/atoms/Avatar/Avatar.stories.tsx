import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'Juan Toro' },
};

export const SingleName: Story = {
  args: { name: 'Admin' },
};

export const AllSizes: Story = {
  args: { name: 'Juan Toro' },
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="Juan Toro" size="sm" />
      <Avatar name="Juan Toro" size="md" />
      <Avatar name="Juan Toro" size="lg" />
    </div>
  ),
};
