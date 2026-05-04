'use client';

import { useId } from 'react';
import styles from './Textarea.module.css';

export type TextareaProps = React.ComponentProps<'textarea'> & {
  label?: string;
  variant?: 'default' | 'error';
};

export function Textarea({ label, variant = 'default', id, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? (label ? generatedId : undefined);

  const textareaClasses = [
    styles.textarea,
    variant === 'error' && styles['textarea--error'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea id={textareaId} className={textareaClasses} {...props} />
    </div>
  );
}
