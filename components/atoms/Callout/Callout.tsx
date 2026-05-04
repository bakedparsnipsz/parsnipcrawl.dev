import styles from './Callout.module.css';

export type CalloutVariant = 'lore' | 'warn' | 'danger' | 'info';

export type CalloutProps = {
  variant?: CalloutVariant;
  heading?: string;
  children: React.ReactNode;
}

const DEFAULT_HEADINGS: Record<CalloutVariant, string> = {
  lore:   '[ LORE DROP ]',
  warn:   '[ TRAP AHEAD ]',
  danger: '[ DANGER ]',
  info:   '[ ARCANE NOTE ]',
};

export function Callout({ variant = 'info', heading, children }: CalloutProps) {
  const resolvedHeading = heading ?? DEFAULT_HEADINGS[variant];

  return (
    <div className={[styles.callout, styles[`callout--${variant}`]].join(' ')}>
      <p className={styles.heading}>{resolvedHeading}</p>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
