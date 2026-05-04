'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, LootItem, ViewMode } from './types';

interface GameStore extends GameState {
  setViewMode: (mode: ViewMode) => void;
  setCurrentSlug: (slug: string | null) => void;
  gainXp: (amount: number) => void;
  takeDamage: (amount: number) => void;
  healHp: (amount: number) => void;
  clearRoom: (slug: string) => void;
  addLoot: (item: LootItem) => void;
  incrementSlain: () => void;
}

const XP_PER_LEVEL = 1000;

function xpToNext(level: number) {
  return level * XP_PER_LEVEL;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      hp: 100,
      maxHp: 100,
      xp: 0,
      level: 1,
      xpToNext: XP_PER_LEVEL,
      clearedRooms: new Set<string>(),
      inventory: [],
      currentSlug: null,
      viewMode: 'blog' as ViewMode,
      floor: 1,
      roomsCleared: 0,
      slain: 0,

      setViewMode: (mode) => set({ viewMode: mode }),

      setCurrentSlug: (slug) => set({ currentSlug: slug }),

      gainXp: (amount) =>
        set((state) => {
          let xp = state.xp + amount;
          let level = state.level;
          let threshold = xpToNext(level);

          while (xp >= threshold) {
            xp -= threshold;
            level += 1;
            threshold = xpToNext(level);
          }

          return { xp, level, xpToNext: threshold };
        }),

      takeDamage: (amount) => set((state) => ({ hp: Math.max(0, state.hp - amount) })),

      healHp: (amount) => set((state) => ({ hp: Math.min(state.maxHp, state.hp + amount) })),

      clearRoom: (slug) =>
        set((state) => ({
          clearedRooms: new Set([...state.clearedRooms, slug]),
          roomsCleared: state.roomsCleared + 1,
        })),

      addLoot: (item) => set((state) => ({ inventory: [...state.inventory, item] })),

      incrementSlain: () => set((state) => ({ slain: state.slain + 1 })),
    }),
    {
      name: 'dungeon-dev-state',
      partialize: (state) => ({
        hp: state.hp,
        maxHp: state.maxHp,
        xp: state.xp,
        level: state.level,
        xpToNext: state.xpToNext,
        clearedRooms: Array.from(state.clearedRooms),
        inventory: state.inventory,
        viewMode: state.viewMode,
        floor: state.floor,
        roomsCleared: state.roomsCleared,
        slain: state.slain,
      }),
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<GameStore> & { clearedRooms?: string[] };
        return {
          ...current,
          ...p,
          clearedRooms: new Set(p.clearedRooms ?? []),
        };
      },
    },
  ),
);
