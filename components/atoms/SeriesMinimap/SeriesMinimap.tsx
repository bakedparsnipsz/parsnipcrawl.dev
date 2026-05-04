'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './SeriesMinimap.module.css';

// ── Types ──────────────────────────────────────────────────────────────────

export type RoomState = 'current' | 'cleared' | 'unread' | 'boss';

export type MinimapRoom = {
  slug: string;
  title?: string;
  state: RoomState;
};

export type SeriesMinimapProps = {
  rooms: MinimapRoom[];
  maxCols?: number;
  onRoomClick?: (room: MinimapRoom) => void;
};

// ── Layout constants ───────────────────────────────────────────────────────

const CELL_W = 20;
const CELL_H = 16;
const GAP = 8;
const PAD = 6;
const DOT_R = 1; // pulsing dot half-size

// ── Colours — mirrored as CSS tokens in globals.css ───────────────────────

const COLORS: Record<RoomState, { fill: string; border: string }> = {
  current: { fill: '#ff3a7a', border: '#ff6aa0' },
  cleared: { fill: '#2a0050', border: '#8020cc' },
  unread: { fill: '#120018', border: '#2a0040' },
  boss: { fill: '#3a1800', border: '#d4a030' },
};

// ── Geometry helpers ───────────────────────────────────────────────────────

function gridPos(idx: number, maxCols: number) {
  const row = Math.floor(idx / maxCols);
  // Snake: even rows go L→R, odd rows go R→L
  const col = row % 2 === 0 ? idx % maxCols : maxCols - 1 - (idx % maxCols);
  const x = PAD + col * (CELL_W + GAP);
  const y = PAD + row * (CELL_H + GAP);
  return { x, y, cx: x + CELL_W / 2, cy: y + CELL_H / 2 };
}

function canvasSize(count: number, maxCols: number) {
  const cols = Math.min(count, maxCols);
  const rows = Math.ceil(count / maxCols);
  return {
    w: PAD * 2 + cols * CELL_W + Math.max(0, cols - 1) * GAP,
    h: PAD * 2 + rows * CELL_H + Math.max(0, rows - 1) * GAP,
  };
}

function roomAtPoint(
  px: number,
  py: number,
  rooms: MinimapRoom[],
  maxCols: number,
): MinimapRoom | null {
  for (let i = 0; i < rooms.length; i++) {
    const { x, y } = gridPos(i, maxCols);
    if (px >= x && px <= x + CELL_W && py >= y && py <= y + CELL_H) {
      return rooms[i];
    }
  }
  return null;
}

// ── Component ──────────────────────────────────────────────────────────────

export function SeriesMinimap({ rooms, maxCols = 4, onRoomClick }: SeriesMinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const tickRef = useRef(0);
  const [hovered, setHovered] = useState<MinimapRoom | null>(null);

  const { w, h } = canvasSize(rooms.length, maxCols);

  // ── Draw loop ────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function draw() {
      tickRef.current++;
      const tick = tickRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = '#08000f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Corridors drawn first so rooms render on top
      ctx.strokeStyle = '#2a0040';
      ctx.lineWidth = 2;
      for (let i = 0; i < rooms.length - 1; i++) {
        const a = gridPos(i, maxCols);
        const b = gridPos(i + 1, maxCols);
        ctx.beginPath();
        ctx.moveTo(a.cx, a.cy);
        // L-shaped corridor: go horizontal then vertical
        ctx.lineTo(b.cx, a.cy);
        ctx.lineTo(b.cx, b.cy);
        ctx.stroke();
      }

      // Room cells
      for (let i = 0; i < rooms.length; i++) {
        const { x, y } = gridPos(i, maxCols);
        const { fill, border } = COLORS[rooms[i].state];

        ctx.fillStyle = fill;
        ctx.fillRect(x, y, CELL_W, CELL_H);

        ctx.strokeStyle = border;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL_W - 1, CELL_H - 1);

        // Room number label (tiny, pixel-art feel)
        ctx.fillStyle = border;
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(i + 1), x + CELL_W / 2, y + CELL_H / 2);
      }

      // Pulsing dot on current room
      const currentIdx = rooms.findIndex((r) => r.state === 'current');
      if (currentIdx >= 0) {
        const { cx, cy } = gridPos(currentIdx, maxCols);
        const alpha = 0.35 + Math.sin(tick * 0.08) * 0.3;
        ctx.fillStyle = `rgba(255, 106, 160, ${alpha})`;
        ctx.fillRect(cx - DOT_R - 2, cy - DOT_R - 2, (DOT_R + 2) * 2 + 1, (DOT_R + 2) * 2 + 1);
        ctx.fillStyle = '#ff3a7a';
        ctx.fillRect(cx - DOT_R, cy - DOT_R, DOT_R * 2 + 1, DOT_R * 2 + 1);
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    // Set current room as hovered
    setHovered(rooms.find((r) => r.state === 'current') ?? null);

    return () => cancelAnimationFrame(animRef.current);
  }, [rooms, maxCols]);

  // ── Mouse handlers ───────────────────────────────────────────────────────

  const getCanvasPoint = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = e.currentTarget.width / rect.width;
    const scaleY = e.currentTarget.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = getCanvasPoint(e);
    const room = roomAtPoint(x, y, rooms, maxCols);
    setHovered(room);
    e.currentTarget.style.cursor = room ? 'pointer' : 'default';
  }

  function handleMouseLeave() {
    setHovered(null);
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onRoomClick) return;
    const { x, y } = getCanvasPoint(e);
    const room = roomAtPoint(x, y, rooms, maxCols);
    if (room) onRoomClick(room);
  }

  // ── Legend ───────────────────────────────────────────────────────────────

  const presentStates = new Set(rooms.map((r) => r.state));
  const LEGEND_ITEMS: { state: RoomState; label: string }[] = [
    { state: 'current', label: 'Current' },
    { state: 'cleared', label: 'Cleared' },
    { state: 'unread', label: 'Unread' },
    { state: 'boss', label: 'Boss' },
  ];

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        width={w}
        height={h}
        className={styles.canvas}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        aria-label="Series minimap"
        role="img"
      />

      <p className={styles.tooltip}>
        {hovered?.title ?? rooms.find((r) => r.state === 'current')?.title ?? ''}
      </p>

      <div className={styles.legend}>
        {LEGEND_ITEMS.filter((item) => presentStates.has(item.state)).map(({ state, label }) => (
          <span key={state} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{
                background: COLORS[state].fill,
                borderColor: COLORS[state].border,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
