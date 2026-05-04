'use client';

import { useId } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import styles from './Select.module.css';
import PixelChevronDown from '../Icons/PixelChevronDown';
import PixelChevronUp from '../Icons/PixelChevronUp';
import PixelSquare from '../Icons/PixelSquare';

// ── Sub-components ─────────────────────────────────────────────────────────

export type SelectItemProps = {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SelectItem({ value, children, disabled }: SelectItemProps) {
  return (
    <RadixSelect.Item value={value} disabled={disabled} className={styles.item}>
      <RadixSelect.ItemIndicator className={styles.itemIndicator}>
        <PixelSquare />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

export type SelectGroupProps = {
  label?: string;
  children: React.ReactNode;
}

export function SelectGroup({ label, children }: SelectGroupProps) {
  return (
    <RadixSelect.Group>
      {label && (
        <RadixSelect.Label className={styles.groupLabel}>{label}</RadixSelect.Label>
      )}
      {children}
    </RadixSelect.Group>
  );
}

export function SelectSeparator() {
  return <RadixSelect.Separator className={styles.separator} />;
}

// ── Root Select ────────────────────────────────────────────────────────────

export type SelectProps = {
  label?: string;
  variant?: 'default' | 'error';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  children: React.ReactNode;
}

export function Select({
  label,
  variant = 'default',
  placeholder,
  value,
  defaultValue,
  onValueChange,
  disabled,
  id,
  children,
}: SelectProps) {
  const generatedId = useId();
  const triggerId = id ?? (label ? generatedId : undefined);

  const triggerClasses = [
    styles.trigger,
    variant === 'error' && styles['trigger--error'],
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={triggerId}>
          {label}
        </label>
      )}
      <RadixSelect.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger id={triggerId} className={triggerClasses}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className={styles.triggerIcon}>
            <PixelChevronDown />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className={styles.content} position="popper" sideOffset={4}>
            <RadixSelect.ScrollUpButton className={styles.scrollButton}>
              <PixelChevronUp />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className={styles.viewport}>
              {children}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className={styles.scrollButton}>
              <PixelChevronDown />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}
