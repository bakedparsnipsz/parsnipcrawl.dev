'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Post } from '@/lib/types';
import { POSTS } from '@/lib/posts';
import { useGameStore } from '@/lib/store';
import { TomeSprite, PotionSprite } from './atoms/Sprites/ItemSprite';
import styles from './RoomClearScreen.module.css';

interface Props {
  post: Post;
  scrollXp: number;
}

export function RoomClearScreen({ post, scrollXp }: Props) {
  const router = useRouter();
  const { xp, xpToNext, level, inventory, gainXp, clearRoom } = useGameStore();
  const [animated, setAnimated] = useState(false);

  const combatXp = post.enemies.reduce((s, e) => s + e.xpReward, 0);
  const readXp   = scrollXp;
  const totalXp  = post.xp + readXp;
  const xpPct    = Math.min(100, (xp / xpToNext) * 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    gainXp(post.xp);
    clearRoom(post.slug);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const idx = POSTS.findIndex(p => p.slug === post.slug);
  const nextPost = POSTS[idx + 1] ?? null;

  const lootItems = [
    { id: 'read', name: `${post.sprite === 'tome' ? 'Ancient Tome' : 'Worn Scroll'}: ${post.title.split(':')[0]}`, descriptor: 'KNOWLEDGE RELIC', rare: post.isBoss },
    ...(post.isBoss ? [{ id: 'boss-loot', name: 'Boss Seal', descriptor: 'LEGENDARY', rare: true }] : []),
  ];

  return (
    <div className={styles.screen}>
      {/* Left panel */}
      <div className={styles.left}>
        <div>
          <div className={styles.clearLabel}>ROOM CLEARED</div>
          <h1 className={`${styles.roomTitle}${post.isBoss ? ` ${styles.boss}` : ''}`}>
            {post.roomName}
          </h1>
        </div>

        {/* XP Breakdown */}
        <div className={styles.xpTable}>
          <div className={styles.xpRow}>
            <span>Room completion</span>
            <span className={styles.xpVal}>+{post.xp}</span>
          </div>
          <div className={styles.xpRow}>
            <span>Scroll depth bonus</span>
            <span className={styles.xpVal}>+{readXp}</span>
          </div>
          <div className={styles.xpRow}>
            <span>Encounters cleared</span>
            <span className={styles.xpVal}>+{combatXp}</span>
          </div>
          <div className={`${styles.xpRow} ${styles.total}`}>
            <span>Total</span>
            <span className={`${styles.xpVal} ${styles.gold}`}>+{totalXp + combatXp}</span>
          </div>
        </div>

        {/* XP bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressLabel}>
            <span>LVL {level} XP</span>
            <span>{xp} / {xpToNext}</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill}${animated ? ` ${styles.animated}` : ''}`}
              style={{ '--xp-pct': `${xpPct}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Loot */}
        <div className={styles.lootSection}>
          <div className={styles.lootTitle}>LOOT DROPS</div>
          {lootItems.map(item => (
            <div key={item.id} className={`${styles.lootItem}${item.rare ? ` ${styles.rare}` : ''}`}>
              <div className={styles.lootIcon}>
                <TomeSprite type={post.sprite} boss={item.rare} size={32} />
              </div>
              <div>
                <div className={styles.lootName}>{item.name}</div>
                <div className={styles.lootDesc}>{item.descriptor}</div>
              </div>
            </div>
          ))}
          <div className={`${styles.lootItem}`}>
            <div className={styles.lootIcon}><PotionSprite size={14} /></div>
            <div>
              <div className={styles.lootName}>Health Potion</div>
              <div className={styles.lootDesc}>CONSUMABLE · +20 HP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className={styles.right}>
        {nextPost && (
          <div>
            <div className={styles.nextLabel}>NEXT ROOM</div>
            <div className={styles.nextCard} onClick={() => router.push(`/blog/${nextPost.slug}`)}>
              <div className={styles.nextTitle}>{nextPost.title}</div>
              <div className={styles.nextMeta}>{nextPost.roomName} · {nextPost.difficulty} · +{nextPost.xp} XP</div>
            </div>
          </div>
        )}

        {/* Inventory */}
        <div className={styles.inventory}>
          <div className={styles.invTitle}>INVENTORY ({inventory.length}/18)</div>
          <div className={styles.invGrid}>
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className={styles.invSlot}>
                {inventory[i] && (
                  <TomeSprite type={inventory[i].sprite} size={18} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          {nextPost && (
            <button className={styles.actionBtn} onClick={() => router.push(`/blog/${nextPost.slug}`)}>
              [ NEXT ROOM ]
            </button>
          )}
          <button className={styles.actionBtn} onClick={() => router.push('/dungeon')}>
            [ RETURN TO DUNGEON ]
          </button>
          <button className={`${styles.actionBtn} ${styles.secondary}`} onClick={() => router.push('/')}>
            [ VIEW BLOG ]
          </button>
        </div>
      </div>
    </div>
  );
}
