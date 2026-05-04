import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Prose } from './Prose';

const meta = {
  title: 'Components/Atoms/Prose',
  component: Prose,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: { table: { disable: true } },
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullSpecimen: Story = {
  render: () => (
    <Prose>
      <h1>Why I Rewrote My Parser in Rust</h1>
      <h2>The problem with the old parser</h2>
      <p>
        Three months ago my Python parser was taking 4 seconds on a 10 MB source
        file. I&apos;d profiled it, cached it, and convinced myself I&apos;d hit a wall.
        Then I rewrote it in Rust over a weekend.
      </p>
      <h3>The performance profile</h3>
      <p>
        Running <code>py-spy</code> showed 60% of time in dict lookups — not in
        my parsing logic, but in Python&apos;s own object machinery. That&apos;s the sign
        you&apos;ve outgrown the abstraction.
      </p>
      <p>
        The fix required <strong>zero algorithmic changes</strong>. Same logic,
        different substrate. The Rust version runs in <em>180ms</em>.
      </p>
      <h2>What the rewrite taught me</h2>
      <ul>
        <li>Ownership semantics force you to think about data flow</li>
        <li>The borrow checker is a design reviewer, not an obstacle</li>
        <li>Zero-cost abstractions are not marketing</li>
      </ul>
    </Prose>
  ),
};

export const Headings: Story = {
  render: () => (
    <Prose>
      <h1>H1 — Article Title</h1>
      <h2>H2 — Section Heading</h2>
      <h3>H3 — Sub-section</h3>
    </Prose>
  ),
};

export const InlineElements: Story = {
  render: () => (
    <Prose>
      <p>
        Body text with <strong>bold emphasis</strong>, <em>italics</em>,{' '}
        <code>inline code</code>, and a{' '}
        <a href="#">link to somewhere</a>.
      </p>
      <blockquote>
        The borrow checker enforces these rules entirely at compile time — zero runtime cost.
      </blockquote>
    </Prose>
  ),
};

export const Lists: Story = {
  render: () => (
    <Prose>
      <h2>Unordered</h2>
      <ul>
        <li>Rustacean — memory-safe systems programmer</li>
        <li>TypeWitch — conjures types from thin air</li>
        <li>Shell Sorcerer — wields pipelines as spells</li>
      </ul>
      <h2>Ordered</h2>
      <ol>
        <li>Profile before optimising</li>
        <li>Understand the allocator</li>
        <li>Rewrite in Rust</li>
      </ol>
    </Prose>
  ),
};
