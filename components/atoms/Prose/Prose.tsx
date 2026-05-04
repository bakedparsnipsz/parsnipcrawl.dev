import styles from './Prose.module.css';

export type ProseProps = {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <article className={[styles.prose, className].filter(Boolean).join(' ')}>
      {children}
    </article>
  );
}
