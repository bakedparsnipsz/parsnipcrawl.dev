'use client';

import { useGameStore } from '@/lib/store';
import { PostCard } from './PostCard';
import type { Post } from '@/lib/types';
import styles from '@/app/page.module.css';

interface Props {
  posts: Post[];
}

export function BlogFeedClient({ posts }: Props) {
  const { clearedRooms } = useGameStore();

  const floors = [...new Set(posts.map((p) => p.floor))].sort();

  return (
    <div className={styles.feed}>
      {floors.map((floor, fi) => {
        const floorPosts = posts.filter((p) => p.floor === floor);
        return (
          <div key={floor}>
            {fi > 0 && (
              <div className={styles.floorDivider}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerLabel}>FLOOR {floor}</span>
                <div className={styles.dividerLine} />
              </div>
            )}
            {fi === 0 && (
              <div className={styles.floorDivider}>
                <div className={styles.dividerLine} />
                <span className={styles.dividerLabel}>FLOOR {floor} · ENTRANCE</span>
                <div className={styles.dividerLine} />
              </div>
            )}
            {floorPosts.map((post) => (
              <PostCard key={post.slug} post={post} cleared={clearedRooms.has(post.slug)} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
