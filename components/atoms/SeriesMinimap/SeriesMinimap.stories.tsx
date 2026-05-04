import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { SeriesMinimap } from './SeriesMinimap';
import type { MinimapRoom } from './SeriesMinimap';

const meta = {
  title: 'Components/Atoms/SeriesMinimap',
  component: SeriesMinimap,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
  argTypes: {
    maxCols: { control: { type: 'range', min: 2, max: 6 } },
    showLegend: { control: 'boolean' },
    rooms: { table: { disable: true } },
  },
  args: { onRoomClick: fn() },
} satisfies Meta<typeof SeriesMinimap>;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Fixture data ───────────────────────────────────────────────────────────

function makeRooms(states: Array<MinimapRoom['state']>, titles?: string[]): MinimapRoom[] {
  return states.map((state, i) => ({
    slug: `post-${i + 1}`,
    title: titles?.[i] ?? `Room ${i + 1}`,
    state,
  }));
}

const SYSTEMS_SERIES = makeRooms(
  ['cleared', 'cleared', 'current', 'unread', 'unread', 'boss'],
  [
    'Why Allocators Matter',
    'Stack vs Heap Deep Dive',
    'Writing a Custom Allocator', // ← reading now
    'Arenas and Bump Allocation',
    'TLSF: Real-time Allocators',
    'The Allocator Boss Fight',
  ],
);

const SHORT_SERIES = makeRooms(
  ['cleared', 'current', 'boss'],
  ['Intro to Borrow Checking', 'Lifetimes Explained', 'The Borrow Checker Boss'],
);

const LONG_SERIES = makeRooms(
  [
    'cleared',
    'cleared',
    'cleared',
    'cleared',
    'cleared',
    'cleared',
    'current',
    'unread',
    'unread',
    'unread',
    'boss',
  ],
  [
    'Chapter I',
    'Chapter II',
    'Chapter III',
    'Chapter IV',
    'Chapter V',
    'Chapter VI',
    'Chapter VII',
    'Chapter VIII',
    'Chapter IX',
    'Chapter X',
    'The Final Boss',
  ],
);

const COMPLETE_SERIES = makeRooms(
  ['cleared', 'cleared', 'cleared', 'cleared', 'boss'],
  ['Part 1', 'Part 2', 'Part 3', 'Part 4', 'Capstone'],
);

// ── Stories ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    rooms: SYSTEMS_SERIES,
    maxCols: 4,
    showLegend: true,
  },
};

export const ShortSeries: Story = {
  args: {
    rooms: SHORT_SERIES,
    maxCols: 4,
    showLegend: true,
  },
};

export const LongSeries: Story = {
  args: {
    rooms: LONG_SERIES,
    maxCols: 4,
    showLegend: true,
  },
};

export const Completed: Story = {
  args: {
    rooms: COMPLETE_SERIES,
    maxCols: 4,
    showLegend: true,
  },
};

export const NarrowLayout: Story = {
  args: {
    rooms: SYSTEMS_SERIES,
    maxCols: 2,
    showLegend: true,
  },
};

export const AllAtStart: Story = {
  args: {
    rooms: makeRooms(['current', 'unread', 'unread', 'unread', 'boss']),
    maxCols: 4,
    showLegend: true,
  },
};
