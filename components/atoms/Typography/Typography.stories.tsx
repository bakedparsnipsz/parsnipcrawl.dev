import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Typography, TypographyProps } from './Typography';

const meta = {
  title: 'Components/Atoms/Typography',
  component: Typography,
  render: (args: TypographyProps) => (<Typography {...args}>Parsnip Crawl</Typography>),
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {},
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
};
