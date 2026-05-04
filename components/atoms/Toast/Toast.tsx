import styles from './Toast.module.css';

export type ToastVariant = 'encounter' | 'success' | 'loot';

export type ToastProps = {
  title: string;
  message?: string;
  variant?: ToastVariant;
  onDismiss?: () => void;
};

const ARIA_ROLE: Record<ToastVariant, 'alert' | 'status'> = {
  encounter: 'alert',
  success: 'status',
  loot: 'status',
};

export function Toast({ title, message, variant = 'success', onDismiss }: ToastProps) {
  return (
    <div
      className={[styles.toast, styles[`toast--${variant}`]].join(' ')}
      role={ARIA_ROLE[variant]}
      aria-live={variant === 'encounter' ? 'assertive' : 'polite'}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {onDismiss && (
          <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
            ×
          </button>
        )}
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
