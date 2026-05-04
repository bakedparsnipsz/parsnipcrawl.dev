import styles from './ProgressBar.module.css';

export type ProgressBarProps = {
  value: number;
  variant?: 'hp' | 'xp' | 'progress' | 'gold' | 'green';
  size?: 'thin' | 'medium' | 'thick';
  label?: string;
  valueLabel?: string;
};

export function ProgressBar({
  value,
  variant = 'xp',
  size = 'medium',
  label,
  valueLabel,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const trackClasses = [styles.track, styles[`track--${size}`]].join(' ');
  const fillClasses = [styles.fill, styles[`fill--${variant}`]].join(' ');

  return (
    <div className={styles.wrapper}>
      {(label || valueLabel) && (
        <div className={styles.labelRow}>
          {label && <span className={styles.label}>{label}</span>}
          {valueLabel && <span className={styles.valueLabel}>{valueLabel}</span>}
        </div>
      )}
      <div
        className={trackClasses}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={fillClasses} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
