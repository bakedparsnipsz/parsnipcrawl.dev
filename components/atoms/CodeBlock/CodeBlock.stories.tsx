import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CodeBlock } from './CodeBlock';

const meta = {
  title: 'Components/Atoms/CodeBlock',
  component: CodeBlock,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'text' },
    code: { control: 'text' },
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rust: Story = {
  args: {
    lang: 'rust',
    code: `enum Node {
    Ident(String),
    BinOp { lhs: Box<Node>, op: Op },
    Literal(i64),   // the simple case
}

fn parse_expr(tokens: &mut Peekable<Lexer>) -> Node {
    let x = 42;
    let s = "hello world";
    parse_primary(tokens)
}`,
  },
};

export const TypeScript: Story = {
  args: {
    lang: 'typescript',
    code: `interface DungeonRoom {
  id: string;
  floor: number;
  enemies: Enemy[];
  cleared: boolean;
}

async function enterRoom(room: DungeonRoom): Promise<void> {
  const encounter = room.enemies.find(e => !e.defeated);
  if (!encounter) return;
  await startCombat(encounter);
}`,
  },
};

export const CSS: Story = {
  args: {
    lang: 'css',
    code: `:root {
  --purple: #c040ff;
  --bg: #0a0008;
}

/* Dungeon tile */
.tile {
  background: var(--bg);
  border: 1px solid var(--border);
  width: 16px;
  height: 16px;
}`,
  },
};

export const PlainText: Story = {
  args: {
    lang: 'bash',
    code: `npm run storybook
npm run dev
npm run build`,
  },
};
