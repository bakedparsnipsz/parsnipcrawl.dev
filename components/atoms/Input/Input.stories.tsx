import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Atoms/Input',
  component: Input,
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
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Character name...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'CHARACTER NAME',
    placeholder: 'Character name...',
  },
};

export const Focused: Story = {
  args: {
    label: 'CHARACTER NAME',
    defaultValue: 'The Parsnip',
    autoFocus: true,
  },
};

export const Error: Story = {
  args: {
    label: 'CHARACTER NAME',
    variant: 'error',
    defaultValue: 'invalid input',
  },
};

export const Disabled: Story = {
  args: {
    label: 'CHARACTER NAME',
    disabled: true,
    defaultValue: 'locked',
  },
};

export const Password: Story = {
  args: {
    label: 'SECRET PASSPHRASE',
    type: 'password',
    placeholder: '••••••••',
  },
};
