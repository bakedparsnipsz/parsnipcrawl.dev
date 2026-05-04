import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SkillPips } from './SkillPips';

const meta = {
  title: 'Components/Atoms/SkillPips',
  component: SkillPips,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['purple', 'gold', 'red'],
    },
    filled: {
      control: { type: 'range', min: 0, max: 10 },
    },
    total: {
      control: { type: 'range', min: 1, max: 10 },
    },
  },
} satisfies Meta<typeof SkillPips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Purple: Story = {
  args: {
    variant: 'purple',
    filled: 3,
    total: 5,
    label: 'ARCANE MASTERY',
  },
};

export const Gold: Story = {
  args: {
    variant: 'gold',
    filled: 5,
    total: 5,
    label: 'MASTERY',
  },
};

export const Red: Story = {
  args: {
    variant: 'red',
    filled: 2,
    total: 5,
    label: 'DAMAGE',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <SkillPips variant="gold" filled={5} total={5} label="MASTERY" />
      <SkillPips variant="purple" filled={3} total={5} label="ARCANE" />
      <SkillPips variant="red" filled={2} total={5} label="DAMAGE" />
    </div>
  ),
};

export const WideRow: Story = {
  args: {
    variant: 'purple',
    filled: 7,
    total: 10,
    label: 'EXPERIENCE',
  },
};

export const Empty: Story = {
  args: {
    variant: 'purple',
    filled: 0,
    total: 5,
    label: 'LOCKED',
  },
};
