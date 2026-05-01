'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { LogoIcon } from './sprites/LogoIcon';
import styles from './TopBar.module.css';

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hp, maxHp, xp, xpToNext, level, viewMode, setViewMode } = useGameStore();

  const hpPct = (hp / maxHp) * 100;
  const xpPct = (xp / xpToNext) * 100;

  function handleModeToggle() {
    if (viewMode === 'blog') {
      setViewMode('dungeon');
      router.push('/dungeon');
    } else {
      setViewMode('blog');
      router.push('/');
    }
  }

  const displayPath = pathname === '/' ? 'parsnipcrawl.dev/' : `parsnipcrawl.dev${pathname}`;

  return (
    <header className={styles.topbar}>
      <Link href="/" className={styles.logoWrap}>
        <LogoIcon size={14} />
        <span className={styles.logoText}>parsnipcrawl.dev</span>
      </Link>

      <div className={styles.urlBar}>{displayPath}</div>

      <div className={styles.stats}>
        <div className={styles.statGroup}>
          <span className={styles.statLabel}>HP</span>
          <div className={styles.hpBar}>
            <div className={styles.hpFill} style={{ width: `${hpPct}%` }} />
          </div>
        </div>

        <div className={styles.statGroup}>
          <span className={styles.statLabel}>XP</span>
          <div className={styles.xpBar}>
            <div className={styles.xpFill} style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        <span className={styles.lvl}>LV{level}</span>
      </div>

      <button className={styles.modeBtn} onClick={handleModeToggle}>
        {viewMode === 'blog' ? '[ DUNGEON ]' : '[ BLOG ]'}
      </button>
    </header>
  );
}
