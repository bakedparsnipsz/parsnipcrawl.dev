import { T, type TileType, type Room } from './types';
import { POSTS } from './posts';

export const MAP_W = 25;
export const MAP_H = 22;
export const TILE = 16;

type Grid = TileType[][];

function emptyGrid(): Grid {
  return Array.from({ length: MAP_H }, () => Array(MAP_W).fill(T.VOID));
}

function fillRect(grid: Grid, x: number, y: number, w: number, h: number, tile: TileType) {
  for (let row = y; row < y + h; row++) {
    for (let col = x; col < x + w; col++) {
      if (row >= 0 && row < MAP_H && col >= 0 && col < MAP_W) {
        grid[row][col] = tile;
      }
    }
  }
}

function wallRoom(grid: Grid, x: number, y: number, w: number, h: number, boss = false) {
  const floor = boss ? T.BOSS_FLOOR : T.FLOOR;
  fillRect(grid, x, y, w, h, T.WALL);
  fillRect(grid, x + 1, y + 1, w - 2, h - 2, floor);
}

function corridor(grid: Grid, x1: number, y1: number, x2: number, y2: number) {
  let cx = x1;
  while (cx !== x2) {
    if (grid[y1][cx] === T.VOID) grid[y1][cx] = T.FLOOR;
    cx += cx < x2 ? 1 : -1;
  }
  let cy = y1;
  while (cy !== y2) {
    if (grid[cy][x2] === T.VOID) grid[cy][x2] = T.FLOOR;
    cy += cy < y2 ? 1 : -1;
  }
}

/* ─── Static room definitions matching posts ─────────────────────────────── */

export const DUNGEON_ROOMS: Room[] = POSTS.map((post, i) => {
  const cols = [2, 13, 2, 13, 2, 13, 2, 13];
  const rows = [1, 1, 8, 8, 15, 15, 15, 8];
  const widths = [9, 10, 9, 10, 9, 10, 9, 10];
  const heights = [5, 5, 5, 5, 5, 5, 5, 5];

  return {
    id: i,
    x: cols[i % 8],
    y: rows[i % 8],
    w: widths[i % 8],
    h: heights[i % 8],
    type: post.isBoss ? 'boss' : 'unread',
    name: post.roomName,
    diff: post.difficulty,
    xp: post.xp,
    time: `${post.readingTime}m`,
    floor: `Floor ${post.floor}`,
    desc: post.excerpt.slice(0, 60) + '…',
    slug: post.slug,
  };
});

export function buildMap(clearedRooms: Set<string>, currentSlug: string | null): Grid {
  const grid = emptyGrid();

  DUNGEON_ROOMS.forEach((room) => {
    const boss = room.diff === 'BOSS';
    wallRoom(grid, room.x, room.y, room.w, room.h, boss);

    if (clearedRooms.has(room.slug)) room.type = 'cleared';
    else if (room.slug === currentSlug) room.type = 'current';
    else if (boss) room.type = 'boss';
    else room.type = 'unread';

    /* Torch in top-left corner of each room */
    grid[room.y + 1][room.x + 1] = T.TORCH;

    /* Chest for uncleared rooms */
    if (!clearedRooms.has(room.slug)) {
      const cx = room.x + Math.floor(room.w / 2);
      const cy = room.y + Math.floor(room.h / 2);
      grid[cy][cx] = T.CHEST;
    }
  });

  /* Corridors connecting rooms in sequence */
  for (let i = 0; i < DUNGEON_ROOMS.length - 1; i++) {
    const a = DUNGEON_ROOMS[i];
    const b = DUNGEON_ROOMS[i + 1];
    const ax = a.x + Math.floor(a.w / 2);
    const ay = a.y + Math.floor(a.h / 2);
    const bx = b.x + Math.floor(b.w / 2);
    const by = b.y + Math.floor(b.h / 2);
    corridor(grid, ax, ay, bx, by);
  }

  /* Pillars in void areas near room corners */
  DUNGEON_ROOMS.forEach((room) => {
    if (
      room.x + room.w + 1 < MAP_W &&
      room.y + 1 < MAP_H &&
      grid[room.y + 1][room.x + room.w + 1] === T.VOID
    ) {
      grid[room.y + 1][room.x + room.w + 1] = T.PILLAR;
    }
  });

  return grid;
}

export function getRoomAtTile(tx: number, ty: number): Room | undefined {
  return DUNGEON_ROOMS.find(
    (r) => tx >= r.x + 1 && tx < r.x + r.w - 1 && ty >= r.y + 1 && ty < r.y + r.h - 1,
  );
}

export function getPlayerStartPos() {
  const first = DUNGEON_ROOMS[0];
  return {
    x: first.x + Math.floor(first.w / 2) + 0.5,
    y: first.y + Math.floor(first.h / 2) + 0.5,
  };
}
