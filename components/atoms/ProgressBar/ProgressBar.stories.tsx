import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  title: 'Components/Atoms/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['hp', 'xp', 'progress', 'gold', 'green'],
    },
    size: {
      control: { type: 'select' },
      options: ['thin', 'medium', 'thick'],
    },
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HP: Story = {
  args: {
    variant: 'hp',
    size: 'medium',
    value: 80,
    label: 'HP',
    valueLabel: '80/100',
  },
};

export const XP: Story = {
  args: {
    variant: 'xp',
    size: 'medium',
    value: 62,
    label: 'XP',
    valueLabel: 'Lv7',
  },
};

export const Progress: Story = {
  args: {
    variant: 'progress',
    size: 'thin',
    value: 34,
    label: 'READING',
  },
};

export const Gold: Story = {
  args: {
    variant: 'gold',
    size: 'thin',
    value: 100,
    label: 'GOLD',
    valueLabel: '2400',
  },
};

export const Green: Story = {
  args: {
    variant: 'green',
    size: 'medium',
    value: 55,
    label: 'STAMINA',
    valueLabel: '55/100',
  },
};

export const Thick: Story = {
  args: {
    variant: 'xp',
    size: 'thick',
    value: 72,
    label: 'XP TRACK',
    valueLabel: '72%',
  },
};

export const AllVariants: Story = {
  render: () => (
    <>
      <ProgressBar variant="hp"       size="medium" value={80}  label="HP"       valueLabel="80/100" />
      <ProgressBar variant="xp"       size="medium" value={62}  label="XP"       valueLabel="Lv7" />
      <ProgressBar variant="progress" size="thin"   value={34}  label="PROGRESS" />
      <ProgressBar variant="gold"     size="thin"   value={100} label="GOLD"     valueLabel="2400" />
      <ProgressBar variant="green"    size="thick"  value={72}  label="STAMINA"  valueLabel="72/100" />
    </>
  ),
};
