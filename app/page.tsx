import { POSTS } from '@/lib/posts';
import { Sidebar } from '@/components/Sidebar';
import { BlogFeedClient } from '@/components/BlogFeedClient';
import styles from './page.module.css';

export default function BlogPage() {
  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>PARSNIPCRAWL.DEV · ENGINEERING LOG</span>
        </div>

        <BlogFeedClient posts={POSTS} />

        <footer className={styles.footer}>
          <span>// parsnipcrawl.dev</span>
          <span className="cursor-blink">_</span>
        </footer>
      </main>

      <Sidebar mode="blog" />
    </div>
  );
}
