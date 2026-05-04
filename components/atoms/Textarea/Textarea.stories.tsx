import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    rows: {
      control: { type: 'number' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Write your character\'s lore here...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'CHARACTER LORE',
    placeholder: 'Write your character\'s lore here...',
    rows: 4,
  },
};

export const Error: Story = {
  args: {
    label: 'CHARACTER LORE',
    variant: 'error',
    defaultValue: 'Too short.',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'CHARACTER LORE',
    disabled: true,
    defaultValue: 'This scroll is sealed.',
    rows: 4,
  },
};

export const Tall: Story = {
  args: {
    label: 'DUNGEON NOTES',
    placeholder: 'Document your discoveries...',
    rows: 8,
  },
};
