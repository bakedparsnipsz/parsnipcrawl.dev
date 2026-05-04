'use client';

import { useId } from 'react';
import styles from './Input.module.css';

export type InputProps = React.ComponentProps<'input'> & {
  label?: string;
  variant?: 'default' | 'error';
}

export function Input({ label, variant = 'default', id, className, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? (label ? generatedId : undefined);

  const inputClasses = [
    styles.input,
    variant === 'error' && styles['input--error'],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={inputClasses} {...props} />
    </div>
  );
}
