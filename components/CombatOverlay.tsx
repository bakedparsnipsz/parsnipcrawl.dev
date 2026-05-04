'use client';

import { useState } from 'react';
import type { Enemy } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { PlayerSprite, ImpSprite, SkeletonSprite } from './atoms/Sprites/ItemSprite';
import styles from './CombatOverlay.module.css';

interface Props {
  enemy: Enemy;
  onClose: () => void;
}

type Phase = 'question' | 'resolved';

export function CombatOverlay({ enemy, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('question');
  const [chosen, setChosen] = useState<number | null>(null);
  const { gainXp, takeDamage, incrementSlain } = useGameStore();

  const correct = chosen === enemy.correctIndex;

  function handleAnswer(idx: number) {
    if (phase !== 'question') return;
    setChosen(idx);
    setPhase('resolved');
    if (idx === enemy.correctIndex) {
      gainXp(enemy.xpReward);
      incrementSlain();
    } else {
      takeDamage(Math.round(enemy.hp * 0.3));
    }
  }

  const hpPct = phase === 'resolved' && correct ? 0 : 100;
  const EnemySprite = enemy.name.toLowerCase().includes('skeleton') ? SkeletonSprite : ImpSprite;

  return (
    <div className={styles.overlay} role="dialog" aria-modal>
      <div className={styles.box}>
        <div className={styles.header}>
          <span className={styles.enemyName}>{enemy.name}</span>
          <div className={styles.enemyHpWrap}>
            <span className={styles.enemyHpLabel}>HP</span>
            <div className={styles.enemyHpBar}>
              <div className={styles.enemyHpFill} style={{ width: `${hpPct}%` }} />
            </div>
          </div>
        </div>

        <div className={styles.arena}>
          <div className={styles.spriteCol}>
            <div className={styles.spriteBox}>
              <PlayerSprite size={36} />
            </div>
            <span className={styles.spriteLabel}>YOU</span>
          </div>

          <div>
            <p className={styles.question}>{enemy.question}</p>
            <div className={styles.answers}>
              {enemy.answers.map((ans, i) => {
                let cls = styles.ansBtn;
                if (phase === 'resolved') {
                  if (i === enemy.correctIndex) cls += ` ${styles.correct}`;
                  else if (i === chosen) cls += ` ${styles.wrong}`;
                }
                return (
                  <button
                    key={i}
                    className={cls}
                    onClick={() => handleAnswer(i)}
                    disabled={phase === 'resolved'}
                  >
                    {String.fromCharCode(65 + i)}. {ans}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.spriteCol}>
            <div className={styles.spriteBox}>
              <EnemySprite size={36} />
            </div>
            <span className={styles.spriteLabel}>{enemy.name.split(' ')[0].toUpperCase()}</span>
          </div>
        </div>

        {phase === 'resolved' && (
          <div className={styles.feedback}>
            <span className={`${styles.feedbackMsg} ${correct ? styles.win : styles.lose}`}>
              {correct
                ? `Correct! +${enemy.xpReward} XP`
                : `Wrong. You take ${Math.round(enemy.hp * 0.3)} damage.`}
            </span>
            {correct && <span className={styles.xpPop}>+{enemy.xpReward}</span>}
            <button className={styles.continueBtn} onClick={onClose}>
              [ CONTINUE ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
