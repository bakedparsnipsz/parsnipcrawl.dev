/* ─── Content / post types ───────────────────────────────────────────────── */

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'BOSS';
export type SpriteType = 'tome' | 'scroll' | 'skull' | 'sword' | 'gem';
export type RoomState = 'cleared' | 'current' | 'unread' | 'boss';

export interface Enemy {
  name: string;
  hp: number;
  xpReward: number;
  question: string;
  answers: string[];
  correctIndex: number;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  series: string;
  floor: number;
  room: number;
  roomName: string;
  difficulty: Difficulty;
  xp: number;
  sprite: SpriteType;
  tags: string[];
  readingTime: number;
  isBoss: boolean;
  enemies: Enemy[];
  publishedAt: string;
  content: string;
}

/* ─── Dungeon / map types ────────────────────────────────────────────────── */

export const T = {
  VOID:       0,
  FLOOR:      1,
  WALL:       2,
  TORCH:      6,
  PILLAR:     7,
  CHEST:      5,
  BOSS_FLOOR: 8,
} as const;

export type TileType = (typeof T)[keyof typeof T];

export interface Room {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  type: RoomState;
  name: string;
  diff: Difficulty;
  xp: number;
  time: string;
  floor: string;
  desc: string;
  slug: string;
}

export interface PlayerState {
  x: number;
  y: number;
}

/* ─── Loot / inventory types ─────────────────────────────────────────────── */

export interface LootItem {
  id: string;
  name: string;
  descriptor: string;
  sprite: SpriteType;
  rare: boolean;
}

/* ─── Game store shape (used by Zustand) ─────────────────────────────────── */

export type ViewMode = 'blog' | 'dungeon';

export interface GameState {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  xpToNext: number;
  clearedRooms: Set<string>;
  inventory: LootItem[];
  currentSlug: string | null;
  viewMode: ViewMode;
  floor: number;
  roomsCleared: number;
  slain: number;
}
