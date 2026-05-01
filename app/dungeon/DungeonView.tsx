'use client';

import { useGameStore } from '@/lib/store';
import { DungeonCanvas } from '@/components/DungeonCanvas';
import { Sidebar } from '@/components/Sidebar';
import styles from './page.module.css';

export function DungeonView() {
  const { hp, maxHp, xp, xpToNext, level, roomsCleared, slain, floor } = useGameStore();

  const hpPct = (hp / maxHp) * 100;
  const xpPct = (xp / xpToNext) * 100;

  return (
    <div className={styles.shell}>
      <div className={styles.gameArea}>
        {/* HUD */}
        <div className={styles.hud}>
          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>HP</span>
            <div className={styles.hudBar}>
              <div className={`${styles.hudFill} ${styles.hp}`} style={{ width: `${hpPct}%` }} />
            </div>
            <span className={styles.hudStat}>{hp}/{maxHp}</span>
          </div>

          <div className={styles.hudSep} />

          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>XP</span>
            <div className={styles.hudBar}>
              <div className={`${styles.hudFill} ${styles.xp}`} style={{ width: `${xpPct}%` }} />
            </div>
            <span className={styles.hudStat}>{xp}/{xpToNext}</span>
          </div>

          <div className={styles.hudSep} />

          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>LVL</span>
            <span className={styles.hudStat} style={{ color: 'var(--gold)' }}>{level}</span>
          </div>

          <div className={styles.hudSep} />

          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>ROOMS</span>
            <span className={styles.hudStat}>{roomsCleared}</span>
          </div>

          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>SLAIN</span>
            <span className={styles.hudStat}>{slain}</span>
          </div>

          <div className={styles.hudGroup}>
            <span className={styles.hudLabel}>FLOOR</span>
            <span className={styles.hudStat}>{floor}</span>
          </div>
        </div>

        <DungeonCanvas />
      </div>

      <Sidebar mode="dungeon" />
    </div>
  );
}
