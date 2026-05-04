import styles from './Popup.module.css';

export type PopupVariant = 'xp' | 'gold' | 'combat' | 'encounter';

export type PopupProps = {
  children: React.ReactNode;
  variant?: PopupVariant;
}

export function Popup({ children, variant = 'xp' }: PopupProps) {
  return (
    <div
      className={[styles.popup, styles[`popup--${variant}`]].join(' ')}
      role="status"
      aria-live="polite"
    >
      {children}
    </div>
  );
}
