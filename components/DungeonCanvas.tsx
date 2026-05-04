'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { buildMap, getPlayerStartPos, getRoomAtTile, MAP_W, MAP_H, TILE } from '@/lib/dungeonMap';
import { useGameStore } from '@/lib/store';
import { T, type Room } from '@/lib/types';
import styles from './DungeonCanvas.module.css';

const SPEED = 0.06;
const MARGIN = 0.35;

/* ─── Tile colours ───────────────────────────────────────────────────────── */
const TILE_COLORS = {
  floor: '#140020',
  bossFloor: '#160a00',
  wallSide: '#2a0048',
  wallTop: '#3a0060',
  grid: '#1c0028',
};

/* ─── Collision ──────────────────────────────────────────────────────────── */
function canMoveTo(map: number[][], nx: number, ny: number): boolean {
  const corners = [
    [nx - MARGIN, ny - MARGIN],
    [nx + MARGIN, ny - MARGIN],
    [nx - MARGIN, ny + MARGIN],
    [nx + MARGIN, ny + MARGIN],
  ];
  return corners.every(([cx, cy]) => {
    const t = map[Math.floor(cy)]?.[Math.floor(cx)];
    return t !== undefined && t !== T.VOID && t !== T.WALL && t !== T.PILLAR;
  });
}

export function DungeonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerRef = useRef(getPlayerStartPos());
  const camRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);
  const torchAnimRef = useRef(0);
  const playerAnimRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const router = useRouter();
  const { clearedRooms, setCurrentSlug } = useGameStore();

  const [hoveredRoom, setHoveredRoom] = useState<Room | null>(null);
  const [overlayRoom, setOverlayRoom] = useState<Room | null>(null);

  const mapRef = useRef(buildMap(clearedRooms, null));

  /* Rebuild map when cleared rooms change */
  useEffect(() => {
    mapRef.current = buildMap(clearedRooms, null);
  }, [clearedRooms]);

  /* Key handlers */
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key.toLowerCase());
      if (e.key === 'e' || e.key === 'E') {
        const p = playerRef.current;
        const room = getRoomAtTile(Math.floor(p.x), Math.floor(p.y));
        if (room) setOverlayRoom(room);
      }
      if (e.key === 'Escape') setOverlayRoom(null);
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key.toLowerCase());

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const handleEnterRoom = useCallback(() => {
    if (!overlayRoom) return;
    setCurrentSlug(overlayRoom.slug);
    router.push(`/blog/${overlayRoom.slug}`);
  }, [overlayRoom, router, setCurrentSlug]);

  /* ─── Render loop ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas = canvasEl;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      const parent = canvas.parentElement!;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);

    function drawTile(x: number, y: number, tile: number, ta: number) {
      const px = x * TILE;
      const py = y * TILE;

      if (tile === T.VOID) return;

      if (tile === T.WALL) {
        ctx.fillStyle = TILE_COLORS.wallTop;
        ctx.fillRect(px, py, TILE, TILE * 0.4);
        ctx.fillStyle = TILE_COLORS.wallSide;
        ctx.fillRect(px, py + TILE * 0.4, TILE, TILE * 0.6);
        return;
      }

      const floor = tile === T.BOSS_FLOOR ? TILE_COLORS.bossFloor : TILE_COLORS.floor;
      ctx.fillStyle = floor;
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = TILE_COLORS.grid;
      ctx.fillRect(px, py, TILE, 1);
      ctx.fillRect(px, py, 1, TILE);

      if (tile === T.TORCH) {
        const flicker = Math.sin(ta * 3 + (x + y)) * 0.5 + 0.5;
        const r = Math.round(0xd4 + flicker * (0xff - 0xd4));
        const g = Math.round(0xa0 + flicker * (0xcc - 0xa0));
        const b = Math.round(0x30 * (1 - flicker * 0.5));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px + 5, py + 2, 6, 8);
        ctx.fillStyle = `rgba(212,160,48,${0.12 + flicker * 0.1})`;
        ctx.beginPath();
        ctx.arc(px + 8, py + 6, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      if (tile === T.PILLAR) {
        ctx.fillStyle = '#2a0045';
        ctx.fillRect(px + 3, py + 1, 10, 14);
        ctx.fillStyle = '#3a0060';
        ctx.fillRect(px + 3, py + 1, 10, 3);
      }

      if (tile === T.CHEST) {
        ctx.fillStyle = '#5a3010';
        ctx.fillRect(px + 3, py + 5, 10, 7);
        ctx.fillStyle = '#d4a030';
        ctx.fillRect(px + 3, py + 7, 10, 2);
        ctx.fillStyle = '#ffcc60';
        ctx.fillRect(px + 7, py + 7, 2, 2);
      }
    }

    function drawPlayer(wx: number, wy: number, anim: number) {
      const bob = Math.sin(anim * 8) * 0.6;
      const px = Math.round((wx - 0.5) * TILE);
      const py = Math.round((wy - 0.6 + bob / TILE) * TILE);

      /* Body */
      ctx.fillStyle = '#4a0080';
      ctx.fillRect(px + 3, py + 5, 10, 7);
      /* Head */
      ctx.fillStyle = '#e8c8f0';
      ctx.fillRect(px + 4, py + 1, 8, 5);
      /* Eyes */
      ctx.fillStyle = '#0a0008';
      ctx.fillRect(px + 5, py + 2, 2, 2);
      ctx.fillRect(px + 9, py + 2, 2, 2);
      /* Legs */
      ctx.fillStyle = '#2a0048';
      ctx.fillRect(px + 3, py + 12, 3, 4);
      ctx.fillRect(px + 10, py + 12, 3, 4);
      /* Sword */
      ctx.fillStyle = '#a070c0';
      ctx.fillRect(px + 14, py + 4, 2, 7);
      ctx.fillStyle = '#ff3a7a';
      ctx.fillRect(px + 13, py + 9, 4, 2);
    }

    function frame(ts: number) {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const dt = Math.min((ts - lastTimeRef.current) / (1000 / 60), 3);
      lastTimeRef.current = ts;

      torchAnimRef.current += 0.04 * dt;
      const map = mapRef.current;

      /* Input */
      const keys = keysRef.current;
      let dx = 0;
      let dy = 0;
      if (keys.has('w') || keys.has('arrowup')) dy = -1;
      if (keys.has('s') || keys.has('arrowdown')) dy = 1;
      if (keys.has('a') || keys.has('arrowleft')) dx = -1;
      if (keys.has('d') || keys.has('arrowright')) dx = 1;

      if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
      }

      const p = playerRef.current;
      if (dx !== 0 || dy !== 0) {
        playerAnimRef.current += dt;
        const nx = p.x + dx * SPEED * dt;
        const ny = p.y + dy * SPEED * dt;
        if (canMoveTo(map, nx, p.y)) p.x = nx;
        if (canMoveTo(map, p.x, ny)) p.y = ny;
      }

      /* Camera smooth follow */
      const targetCamX = p.x - canvas.width / (2 * TILE);
      const targetCamY = p.y - canvas.height / (2 * TILE);
      camRef.current.x += (targetCamX - camRef.current.x) * 0.12 * dt;
      camRef.current.y += (targetCamY - camRef.current.y) * 0.12 * dt;

      const cam = camRef.current;

      /* Clamp camera to map */
      cam.x = Math.max(0, Math.min(cam.x, MAP_W - canvas.width / TILE));
      cam.y = Math.max(0, Math.min(cam.y, MAP_H - canvas.height / TILE));

      /* Draw */
      ctx.fillStyle = '#0a0008';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(-cam.x * TILE, -cam.y * TILE);

      /* Tiles */
      const startX = Math.max(0, Math.floor(cam.x));
      const endX = Math.min(MAP_W, Math.ceil(cam.x + canvas.width / TILE + 1));
      const startY = Math.max(0, Math.floor(cam.y));
      const endY = Math.min(MAP_H, Math.ceil(cam.y + canvas.height / TILE + 1));

      for (let ty = startY; ty < endY; ty++) {
        for (let tx = startX; tx < endX; tx++) {
          drawTile(tx, ty, map[ty][tx], torchAnimRef.current);
        }
      }

      /* Player */
      drawPlayer(p.x, p.y, playerAnimRef.current);

      /* Vignette */
      const cx2 = cam.x * TILE + canvas.width / 2;
      const cy2 = cam.y * TILE + canvas.height / 2;
      const vigR = Math.max(canvas.width, canvas.height) * 0.7;
      const vig = ctx.createRadialGradient(cx2, cy2, vigR * 0.3, cx2, cy2, vigR);
      vig.addColorStop(0, 'transparent');
      vig.addColorStop(1, 'rgba(0,0,0,0.75)');
      ctx.fillStyle = vig;
      ctx.fillRect(cam.x * TILE, cam.y * TILE, canvas.width, canvas.height);

      ctx.restore();

      /* Current room highlight hint */
      const currentRoom = getRoomAtTile(Math.floor(p.x), Math.floor(p.y));
      if (currentRoom !== hoveredRoom) setHoveredRoom(currentRoom ?? null);

      animRef.current = requestAnimationFrame(frame);
    }

    animRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} tabIndex={0} />

      {hoveredRoom && !overlayRoom && (
        <div className={styles.hint}>PRESS E TO ENTER · {hoveredRoom.name.toUpperCase()}</div>
      )}

      {overlayRoom && (
        <div className={styles.roomOverlay}>
          <p className={styles.roDiff}>
            {overlayRoom.floor} · {overlayRoom.diff}
          </p>
          <h2
            className={`${styles.roTitle}${overlayRoom.diff === 'BOSS' ? ` ${styles.boss}` : ''}`}
          >
            {overlayRoom.name}
          </h2>
          <p className={styles.roDesc}>{overlayRoom.desc}</p>
          <div className={styles.roMeta}>
            <span>{overlayRoom.time} read</span>
            <span>+{overlayRoom.xp} XP</span>
          </div>
          <button
            className={`${styles.roBtn}${overlayRoom.diff === 'BOSS' ? ` ${styles.boss}` : ''}`}
            onClick={handleEnterRoom}
          >
            {overlayRoom.diff === 'BOSS' ? '[ ENTER BOSS ROOM ]' : '[ ENTER ROOM ]'}
          </button>
          <button
            className={styles.roBtn}
            onClick={() => setOverlayRoom(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text3)',
              fontSize: 9,
            }}
          >
            [ ESC ] cancel
          </button>
        </div>
      )}
    </div>
  );
}
