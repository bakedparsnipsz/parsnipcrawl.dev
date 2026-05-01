'use client';

import { useEffect } from 'react';
import type { Enemy } from '@/lib/types';
import styles from './EncounterFlash.module.css';

interface Props {
  enemy: Enemy;
  onFight: () => void;
  onDismiss: () => void;
}

export function EncounterFlash({ enemy, onFight, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 8000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className={styles.flash} role="alert">
      <div className={styles.title}>⚔ ENCOUNTER</div>
      <div className={styles.enemyName}>{enemy.name}</div>
      <div className={styles.sub}>HP {enemy.hp} · +{enemy.xpReward} XP</div>
      <button className={styles.fightBtn} onClick={onFight}>
        [ FIGHT ]
      </button>
    </div>
  );
}
