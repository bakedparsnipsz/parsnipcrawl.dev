import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Popup } from './Popup';

const meta = {
  title: 'Components/Atoms/Popup',
  component: Popup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['xp', 'gold', 'combat', 'encounter'],
    },
    children: { control: 'text' },
  },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const XP: Story = {
  args: {
    variant: 'xp',
    children: '+850 XP',
  },
};

export const Gold: Story = {
  args: {
    variant: 'gold',
    children: '+240 Gold',
  },
};

export const Combat: Story = {
  args: {
    variant: 'combat',
    children: '-35 HP',
  },
};

export const Encounter: Story = {
  args: {
    variant: 'encounter',
    children: '! AMBUSH',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
      <Popup variant="xp">+850 XP</Popup>
      <Popup variant="gold">+240 Gold</Popup>
      <Popup variant="combat">-35 HP</Popup>
      <Popup variant="encounter">! AMBUSH</Popup>
    </div>
  ),
};
