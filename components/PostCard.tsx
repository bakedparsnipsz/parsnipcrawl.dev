import Link from 'next/link';
import type { Post } from '@/lib/types';
import { TomeSprite } from './atoms/Sprites/ItemSprite';
import styles from './PostCard.module.css';

interface Props {
  post: Post;
  cleared?: boolean;
}

export function PostCard({ post, cleared = false }: Props) {
  const cardClass = [styles.card, post.isBoss ? styles.boss : '', cleared ? styles.cleared : '']
    .filter(Boolean)
    .join(' ');

  const diffClass = styles[`diff-${post.difficulty}` as keyof typeof styles] ?? '';

  return (
    <Link href={`/blog/${post.slug}`} className={cardClass}>
      <div className={styles.left}>
        <TomeSprite type={post.sprite} boss={post.isBoss} />
        <span className={styles.spriteLabel}>{post.sprite}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.meta}>
          <span className={`${styles.difficulty} ${diffClass}`}>{post.difficulty}</span>
          <span className={styles.roomName}>{post.roomName}</span>
          {cleared && <span className={styles.clearedBadge}>CLEARED</span>}
        </div>

        <h2 className={styles.title}>{post.title}</h2>

        <p className={styles.excerpt}>{post.excerpt}</p>

        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.readTime}>{post.readingTime}m read</span>
          <div className={styles.xpBar}>
            <div
              className={`${styles.xpFill}${post.isBoss ? ` ${styles.boss}` : ''}`}
              style={{ width: '100%' }}
            />
          </div>
          <span className={styles.xpLabel}>{post.xp} XP</span>
          <span className={styles.roomLoc}>
            Floor {post.floor} · Room {post.room}
          </span>
        </div>
      </div>
    </Link>
  );
}
