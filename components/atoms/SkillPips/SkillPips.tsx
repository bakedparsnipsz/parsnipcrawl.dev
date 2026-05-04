import styles from './SkillPips.module.css';

export type SkillPipsProps = {
  total?: number;
  filled: number;
  variant?: 'purple' | 'gold' | 'red';
  label?: string;
}

export function SkillPips({ total = 5, filled, variant = 'purple', label }: SkillPipsProps) {
  const clamped = Math.min(total, Math.max(0, filled));

  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.row} role="meter" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={total} aria-label={label}>
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className={[
              styles.pip,
              i < clamped && styles[`pip--${variant}`],
            ].filter(Boolean).join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
