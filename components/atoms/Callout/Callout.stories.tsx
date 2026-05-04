import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Callout } from './Callout';

const meta = {
  title: 'Components/Atoms/Callout',
  component: Callout,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['lore', 'warn', 'danger', 'info'],
    },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '480px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lore: Story = {
  args: {
    variant: 'lore',
    children:
      'Cache-friendly data layout matters more than algorithmic complexity at this scale. A cache miss costs ~200 CPU cycles.',
  },
};

export const Warn: Story = {
  args: {
    variant: 'warn',
    children:
      "Don't reach for Box<dyn Trait> as your first instinct. An enum handles 90% of AST node cases.",
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'This approach causes undefined behaviour if the pointer outlives the allocation.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children:
      'The borrow checker enforces these rules entirely at compile time — zero runtime cost.',
  },
};

export const CustomHeading: Story = {
  args: {
    variant: 'lore',
    heading: '[ BOSS LORE ]',
    children: 'The Lifetime Lich was once a mortal compiler, until it tried to outlive the stack.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Callout variant="lore">
        Cache-friendly data layout matters more than algorithmic complexity.
      </Callout>
      <Callout variant="warn">Don't reach for Box{'<dyn Trait>'} as your first instinct.</Callout>
      <Callout variant="danger">
        This approach causes undefined behaviour if the pointer outlives the allocation.
      </Callout>
      <Callout variant="info">
        The borrow checker enforces these rules entirely at compile time.
      </Callout>
    </div>
  ),
};
