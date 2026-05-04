'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/store';
import { DUNGEON_ROOMS } from '@/lib/dungeonMap';
import type { Room } from '@/lib/types';

const CELL = 6;
const MAP_W = 25;
const MAP_H = 22;

interface Props {
  currentSlug: string | null;
}

export function Minimap({ currentSlug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const { clearedRooms } = useGameStore();

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;

    function getRoomColor(room: Room): { fill: string; border: string } {
      if (room.slug === currentSlug) return { fill: '#ff3a7a', border: '#ff6aa0' };
      if (clearedRooms.has(room.slug)) return { fill: '#6020a0', border: '#8020cc' };
      if (room.diff === 'BOSS') return { fill: '#d4a030', border: '#ffcc60' };
      return { fill: '#2a0040', border: '#3a0060' };
    }

    let tick = 0;
    function draw() {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#08000f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      DUNGEON_ROOMS.forEach((room) => {
        const { fill, border } = getRoomColor(room);

        ctx.fillStyle = fill;
        ctx.fillRect(room.x * CELL, room.y * CELL, room.w * CELL, room.h * CELL);

        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(
          room.x * CELL + 0.5,
          room.y * CELL + 0.5,
          room.w * CELL - 1,
          room.h * CELL - 1,
        );
      });

      /* Current room indicator — pulsing dot */
      if (currentSlug) {
        const room = DUNGEON_ROOMS.find((r) => r.slug === currentSlug);
        if (room) {
          const cx = (room.x + room.w / 2) * CELL;
          const cy = (room.y + room.h / 2) * CELL;
          const alpha = 0.4 + Math.sin(tick * 0.08) * 0.3;
          ctx.fillStyle = `rgba(255, 106, 160, ${alpha})`;
          ctx.fillRect(cx - 4, cy - 4, 9, 9);
          ctx.fillStyle = '#ff3a7a';
          ctx.fillRect(cx - 2, cy - 2, 5, 5);
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [clearedRooms, currentSlug]);

  return (
    <canvas
      ref={canvasRef}
      width={MAP_W * CELL}
      height={MAP_H * CELL}
      style={{ imageRendering: 'pixelated', display: 'block', border: '1px solid var(--border)' }}
    />
  );
}
