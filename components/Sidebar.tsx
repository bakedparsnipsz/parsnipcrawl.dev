'use client';

import { useGameStore } from '@/lib/store';
import { Minimap } from './Minimap';
import styles from './Sidebar.module.css';

interface Props {
  mode: 'blog' | 'dungeon' | 'article';
  currentSlug?: string;
}

export function Sidebar({ mode, currentSlug }: Props) {
  const { hp, maxHp, xp, xpToNext, level, roomsCleared, slain, clearedRooms } = useGameStore();

  const hpPct = (hp / maxHp) * 100;
  const xpPct = (xp / xpToNext) * 100;

  return (
    <aside className={styles.sidebar}>
      {/* Minimap */}
      <div className={styles.panel}>
        <div className={styles.panelTitle}>MINIMAP</div>
        <Minimap currentSlug={currentSlug ?? null} />
      </div>

      {/* Character */}
      <div className={styles.panel}>
        <div className={styles.panelTitle}>CHARACTER</div>
        <div className={styles.charRows}>
          <div className={styles.charRow}>
            <span className={styles.charLabel}>LVL</span>
            <span className={styles.charVal} style={{ color: 'var(--gold)' }}>
              {level}
            </span>
          </div>
          <div className={styles.charRow}>
            <span className={styles.charLabel}>HP</span>
            <div className={styles.charBar}>
              <div className={`${styles.charFill} ${styles.hp}`} style={{ width: `${hpPct}%` }} />
            </div>
            <span className={styles.charVal} style={{ fontSize: 9 }}>
              {hp}/{maxHp}
            </span>
          </div>
          <div className={styles.charRow}>
            <span className={styles.charLabel}>XP</span>
            <div className={styles.charBar}>
              <div className={`${styles.charFill} ${styles.xp}`} style={{ width: `${xpPct}%` }} />
            </div>
            <span className={styles.charVal} style={{ fontSize: 9 }}>
              {xp}/{xpToNext}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.panel}>
        <div className={styles.panelTitle}>STATS</div>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <div className={styles.statNum}>{roomsCleared}</div>
            <div className={styles.statLbl}>ROOMS</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statNum}>{slain}</div>
            <div className={styles.statLbl}>SLAIN</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statNum}>{clearedRooms.size}</div>
            <div className={styles.statLbl}>CLEARED</div>
          </div>
          <div className={styles.statBox}>
            <div className={styles.statNum} style={{ fontSize: 12 }}>
              {level * 10}%
            </div>
            <div className={styles.statLbl}>EXPLORED</div>
          </div>
        </div>
      </div>

      {/* Controls (dungeon mode only) */}
      {mode === 'dungeon' && (
        <div className={styles.panel}>
          <div className={styles.panelTitle}>CONTROLS</div>
          <div className={styles.controls}>
            <div className={styles.controlRow}>
              <span className={styles.key}>W A S D</span>
              <span className={styles.controlDesc}>move</span>
            </div>
            <div className={styles.controlRow}>
              <span className={styles.key}>E</span>
              <span className={styles.controlDesc}>enter room</span>
            </div>
            <div className={styles.controlRow}>
              <span className={styles.key}>ESC</span>
              <span className={styles.controlDesc}>close</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
