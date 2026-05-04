import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Toast } from './Toast';

const meta = {
  title: 'Components/Atoms/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['encounter', 'success', 'loot'],
    },
  },
  args: { onDismiss: fn() },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Encounter: Story = {
  args: {
    variant: 'encounter',
    title: '⚔ ENEMY ENCOUNTERED',
    message: 'A Syntax Wraith blocks your path!',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Room Cleared',
    message: '+850 XP earned',
  },
};

export const Loot: Story = {
  args: {
    variant: 'loot',
    title: 'Loot Dropped',
    message: "Borrow Checker's Seal (Rare)",
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'success',
    title: 'Checkpoint Reached',
  },
};

export const NoDismiss: Story = {
  args: {
    variant: 'encounter',
    title: '⚔ ENEMY ENCOUNTERED',
    message: 'A Syntax Wraith blocks your path!',
    onDismiss: undefined,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Toast variant="encounter" title="⚔ ENEMY ENCOUNTERED" message="A Syntax Wraith blocks your path!" />
      <Toast variant="success"   title="Room Cleared"        message="+850 XP earned" />
      <Toast variant="loot"      title="Loot Dropped"        message="Borrow Checker's Seal (Rare)" />
    </div>
  ),
};
