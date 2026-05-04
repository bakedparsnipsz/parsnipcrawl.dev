import type { SpriteType } from '@/lib/types';

interface Props {
  type: SpriteType;
  boss?: boolean;
  size?: number;
}

export function TomeSprite({ type, boss = false, size = 32 }: Props) {
  if (type === 'skull' || boss) return <SkullSprite size={size} />;
  if (type === 'scroll') return <ScrollSprite size={size} />;
  if (type === 'sword') return <SwordItemSprite size={size} />;
  if (type === 'gem') return <GemSprite size={size} />;
  return <TomeBookSprite size={size} />;
}

function TomeBookSprite({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Cover */}
      <rect x="2" y="1" width="12" height="14" fill="#4a0080" />
      {/* Spine */}
      <rect x="2" y="1" width="2" height="14" fill="#6a00b0" />
      {/* Pages */}
      <rect x="4" y="2" width="9" height="12" fill="#e8c8f0" />
      {/* Rune lines */}
      <rect x="5" y="4" width="7" height="1" fill="#c040ff" />
      <rect x="5" y="6" width="5" height="1" fill="#c040ff" />
      <rect x="5" y="8" width="7" height="1" fill="#c040ff" />
      <rect x="5" y="10" width="4" height="1" fill="#c040ff" />
      {/* Clasp */}
      <rect x="12" y="7" width="2" height="2" fill="#d4a030" />
    </svg>
  );
}

function ScrollSprite({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 14 16"
      width={size}
      height={(size * 16) / 14}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Top roller */}
      <rect x="1" y="0" width="12" height="2" fill="#8b6914" />
      {/* Bottom roller */}
      <rect x="1" y="14" width="12" height="2" fill="#8b6914" />
      {/* Parchment */}
      <rect x="2" y="2" width="10" height="12" fill="#d4b483" />
      {/* Text lines */}
      <rect x="3" y="4" width="8" height="1" fill="#6a3a2a" />
      <rect x="3" y="6" width="6" height="1" fill="#6a3a2a" />
      <rect x="3" y="8" width="8" height="1" fill="#6a3a2a" />
      <rect x="3" y="10" width="5" height="1" fill="#6a3a2a" />
      {/* End caps */}
      <rect x="0" y="0" width="1" height="2" fill="#5a4010" />
      <rect x="13" y="0" width="1" height="2" fill="#5a4010" />
      <rect x="0" y="14" width="1" height="2" fill="#5a4010" />
      <rect x="13" y="14" width="1" height="2" fill="#5a4010" />
    </svg>
  );
}

function SkullSprite({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Skull dome */}
      <rect x="3" y="2" width="12" height="10" fill="#8a0020" />
      {/* Sides taper */}
      <rect x="2" y="4" width="1" height="7" fill="#8a0020" />
      <rect x="15" y="4" width="1" height="7" fill="#8a0020" />
      {/* Eye sockets */}
      <rect x="4" y="5" width="3" height="3" fill="#0a0008" />
      <rect x="11" y="5" width="3" height="3" fill="#0a0008" />
      {/* Pink eye glow */}
      <rect x="5" y="6" width="1" height="1" fill="#ff3a7a" />
      <rect x="12" y="6" width="1" height="1" fill="#ff3a7a" />
      {/* Jaw */}
      <rect x="4" y="12" width="10" height="3" fill="#6a0018" />
      {/* Teeth */}
      <rect x="5" y="13" width="2" height="2" fill="#e8c8f0" />
      <rect x="8" y="13" width="2" height="2" fill="#e8c8f0" />
      <rect x="11" y="13" width="2" height="2" fill="#e8c8f0" />
    </svg>
  );
}

function SwordItemSprite({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Blade */}
      <rect x="7" y="1" width="2" height="10" fill="#a070c0" />
      {/* Tip */}
      <rect x="8" y="0" width="1" height="1" fill="#c040ff" />
      {/* Guard */}
      <rect x="4" y="11" width="8" height="2" fill="#ff3a7a" />
      {/* Handle */}
      <rect x="7" y="13" width="2" height="3" fill="#d4a030" />
    </svg>
  );
}

function GemSprite({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Diamond */}
      <rect x="4" y="2" width="6" height="1" fill="#c040ff" />
      <rect x="2" y="3" width="10" height="4" fill="#c040ff" />
      <rect x="3" y="7" width="8" height="3" fill="#8020cc" />
      <rect x="5" y="10" width="4" height="2" fill="#4a0080" />
      <rect x="6" y="12" width="2" height="1" fill="#4a0080" />
      {/* Shine */}
      <rect x="5" y="3" width="2" height="2" fill="#e8a0ff" />
    </svg>
  );
}

/* ─── Player sprite ──────────────────────────────────────────────────────── */
export function PlayerSprite({ size = 40 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 10 12"
      width={size}
      height={(size * 12) / 10}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Head */}
      <rect x="3" y="0" width="4" height="4" fill="#e8c8f0" />
      {/* Eyes */}
      <rect x="4" y="1" width="1" height="1" fill="#0a0008" />
      <rect x="6" y="1" width="1" height="1" fill="#0a0008" />
      {/* Body */}
      <rect x="2" y="4" width="6" height="5" fill="#4a0080" />
      {/* Legs */}
      <rect x="2" y="9" width="2" height="3" fill="#2a0048" />
      <rect x="6" y="9" width="2" height="3" fill="#2a0048" />
      {/* Sword arm (right) */}
      <rect x="8" y="4" width="2" height="5" fill="#a070c0" />
      <rect x="9" y="2" width="1" height="3" fill="#a070c0" />
    </svg>
  );
}

/* ─── Enemy sprites ──────────────────────────────────────────────────────── */
export function ImpSprite({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 12 10"
      width={size}
      height={(size * 10) / 12}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Body */}
      <rect x="3" y="2" width="6" height="6" fill="#4a0080" />
      {/* Head */}
      <rect x="4" y="0" width="4" height="4" fill="#6a00b0" />
      {/* Horns */}
      <rect x="4" y="0" width="1" height="2" fill="#ff3a7a" />
      <rect x="7" y="0" width="1" height="2" fill="#ff3a7a" />
      {/* Eyes — pink glow */}
      <rect x="5" y="1" width="1" height="1" fill="#ff3a7a" />
      <rect x="7" y="1" width="1" height="1" fill="#ff3a7a" />
      {/* Wings */}
      <rect x="0" y="3" width="3" height="3" fill="#2a0048" />
      <rect x="9" y="3" width="3" height="3" fill="#2a0048" />
      {/* Tail */}
      <rect x="5" y="8" width="1" height="2" fill="#4a0080" />
      <rect x="6" y="9" width="2" height="1" fill="#ff3a7a" />
    </svg>
  );
}

export function SkeletonSprite({ size = 48 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 12 16"
      width={size}
      height={(size * 16) / 12}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      {/* Skull */}
      <rect x="3" y="0" width="6" height="5" fill="#d4c0e0" />
      <rect x="2" y="1" width="1" height="4" fill="#d4c0e0" />
      <rect x="9" y="1" width="1" height="4" fill="#d4c0e0" />
      {/* Eye sockets */}
      <rect x="3" y="1" width="2" height="2" fill="#0a0008" />
      <rect x="7" y="1" width="2" height="2" fill="#0a0008" />
      {/* Jaw */}
      <rect x="4" y="5" width="4" height="2" fill="#b090c0" />
      {/* Spine */}
      <rect x="5" y="7" width="2" height="5" fill="#d4c0e0" />
      {/* Ribs */}
      <rect x="3" y="8" width="2" height="1" fill="#b090c0" />
      <rect x="7" y="8" width="2" height="1" fill="#b090c0" />
      <rect x="3" y="10" width="2" height="1" fill="#b090c0" />
      <rect x="7" y="10" width="2" height="1" fill="#b090c0" />
      {/* Arms */}
      <rect x="1" y="7" width="2" height="5" fill="#d4c0e0" />
      <rect x="9" y="7" width="2" height="5" fill="#d4c0e0" />
      {/* Legs */}
      <rect x="3" y="12" width="2" height="4" fill="#d4c0e0" />
      <rect x="7" y="12" width="2" height="4" fill="#d4c0e0" />
    </svg>
  );
}

/* ─── Health potion ──────────────────────────────────────────────────────── */
export function PotionSprite({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 7 9"
      width={size}
      height={(size * 9) / 7}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
    >
      <rect x="2" y="0" width="3" height="2" fill="#6a3a8a" />
      <rect x="1" y="2" width="5" height="6" fill="#2ad880" />
      <rect x="0" y="3" width="1" height="4" fill="#2ad880" />
      <rect x="6" y="3" width="1" height="4" fill="#2ad880" />
      <rect x="1" y="8" width="5" height="1" fill="#2ad880" />
      <rect x="2" y="3" width="3" height="2" fill="#80ffb0" />
    </svg>
  );
}
