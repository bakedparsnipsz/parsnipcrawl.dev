'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { useGameStore } from '@/lib/store';
import { ArticleProse } from '@/components/ArticleProse';
import { CombatOverlay } from '@/components/CombatOverlay';
import { EncounterFlash } from '@/components/EncounterFlash';
import { RoomClearScreen } from '@/components/RoomClearScreen';
import { Sidebar } from '@/components/Sidebar';
import styles from './page.module.css';

const TRIGGER_POINTS = [0.20, 0.55, 0.85];
const XP_PER_SCROLL_MILESTONE = 25;
const PASSIVE_XP_INTERVAL = 20;

interface Props {
  post: Post;
}

export function ArticleClient({ post }: Props) {
  const { gainXp, setCurrentSlug, clearedRooms } = useGameStore();
  const articleRef = useRef<HTMLElement>(null);

  const [triggered, setTriggered] = useState<Set<number>>(new Set());
  const [scrollMilestones, setScrollMilestones] = useState<Set<number>>(new Set());
  const [currentEnemy, setCurrentEnemy] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [flashEnemyIdx, setFlashEnemyIdx] = useState(0);
  const [showClear, setShowClear] = useState(false);
  const [scrollXp, setScrollXp] = useState(0);

  const isCleared = clearedRooms.has(post.slug);

  /* Set current slug for minimap highlight */
  useEffect(() => {
    setCurrentSlug(post.slug);
    return () => setCurrentSlug(null);
  }, [post.slug, setCurrentSlug]);

  /* Passive XP every 20s */
  useEffect(() => {
    const t = setInterval(() => gainXp(5), PASSIVE_XP_INTERVAL * 1000);
    return () => clearInterval(t);
  }, [gainXp]);

  /* Scroll-based combat triggers */
  const handleScroll = useCallback(() => {
    const el = articleRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el.closest('[data-scroll]') as HTMLElement ?? document.documentElement;
    const depth = (window.scrollY) / (document.body.scrollHeight - window.innerHeight || 1);
    const clampedDepth = Math.min(1, depth);

    /* Scroll milestone XP */
    const milestones = [0.25, 0.5, 0.75, 1.0];
    milestones.forEach((m, i) => {
      if (clampedDepth >= m && !scrollMilestones.has(i)) {
        setScrollMilestones(prev => new Set([...prev, i]));
        setScrollXp(prev => prev + XP_PER_SCROLL_MILESTONE);
        gainXp(XP_PER_SCROLL_MILESTONE);
      }
    });

    /* Enemy triggers */
    if (post.enemies.length === 0 || isCleared) return;
    TRIGGER_POINTS.forEach((point, idx) => {
      if (clampedDepth >= point && !triggered.has(idx)) {
        const enemyIdx = idx % post.enemies.length;
        setTriggered(prev => new Set([...prev, idx]));
        setFlashEnemyIdx(enemyIdx);
        setShowFlash(true);
      }
    });
  }, [triggered, scrollMilestones, post.enemies, gainXp, isCleared]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* Time-based fallback trigger */
  useEffect(() => {
    if (post.enemies.length === 0 || isCleared || triggered.size > 0) return;
    const t = setTimeout(() => {
      setFlashEnemyIdx(0);
      setShowFlash(true);
    }, 40000);
    return () => clearTimeout(t);
  }, [post.enemies, triggered, isCleared]);

  const diffClass = styles[`diff-${post.difficulty}` as keyof typeof styles] ?? '';

  return (
    <>
      <div className={styles.shell}>
        <main className={styles.main}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">HOME</Link>
            <span className={styles.sep}>/</span>
            <span>FLOOR {post.floor}</span>
            <span className={styles.sep}>/</span>
            <span>{post.roomName.toUpperCase()}</span>
          </nav>

          {/* Article header */}
          <header className={styles.header}>
            <div className={styles.meta}>
              <span className={`${styles.difficulty} ${diffClass}`}>{post.difficulty}</span>
              <span className={styles.floor}>Floor {post.floor} · Room {post.room} · {post.readingTime}m read</span>
            </div>
            <h1 className={`${styles.title}${post.isBoss ? ` ${styles.boss}` : ''}`}>
              {post.title}
            </h1>
            <div className={styles.tags}>
              {post.tags.map(t => (
                <span key={t} className={styles.tag}>#{t}</span>
              ))}
            </div>
          </header>

          {/* Sword divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <SwordDividerSvg />
            <div className={styles.dividerLine} />
          </div>

          {/* Prose */}
          <ArticleProse content={post.content} />

          {/* Footer */}
          <footer className={styles.footer} ref={articleRef}>
            {!isCleared ? (
              <>
                <button
                  className={`${styles.collectBtn}${post.isBoss ? ` ${styles.boss}` : ''}`}
                  onClick={() => setShowClear(true)}
                >
                  {post.isBoss ? '[ DEFEAT BOSS · COLLECT LOOT ]' : '[ COLLECT LOOT ]'}
                </button>
                <span className={styles.xpPreview}>+{post.xp} XP on completion</span>
              </>
            ) : (
              <span className={styles.xpPreview} style={{ color: 'var(--green)' }}>
                ✓ Room cleared · +{post.xp} XP collected
              </span>
            )}
          </footer>
        </main>

        <Sidebar mode="article" currentSlug={post.slug} />
      </div>

      {/* Encounter flash */}
      {showFlash && !isCleared && (
        <EncounterFlash
          enemy={post.enemies[flashEnemyIdx]}
          onFight={() => {
            setShowFlash(false);
            setCurrentEnemy(flashEnemyIdx);
          }}
          onDismiss={() => setShowFlash(false)}
        />
      )}

      {/* Combat overlay */}
      {currentEnemy !== null && !isCleared && (
        <CombatOverlay
          enemy={post.enemies[currentEnemy]}
          onClose={() => setCurrentEnemy(null)}
        />
      )}

      {/* Room clear screen */}
      {showClear && (
        <RoomClearScreen post={post} scrollXp={scrollXp} />
      )}
    </>
  );
}

function SwordDividerSvg() {
  return (
    <svg viewBox="0 0 30 5" width={60} height={10} style={{ imageRendering: 'pixelated' }} aria-hidden>
      <rect x="0"  y="2" width="10" height="1" fill="#4a1060" />
      <rect x="10" y="1" width="10" height="3" fill="#8020cc" />
      <rect x="13" y="0" width="4"  height="5" fill="#ff3a7a" />
      <rect x="20" y="2" width="10" height="1" fill="#4a1060" />
    </svg>
  );
}
