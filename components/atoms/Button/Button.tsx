export type ButtonProps = React.ComponentProps<'button'> & {
  label: string;
  variant: 'primary' | 'secondary' | 'boss' | 'combat' | 'destructive' | 'success';
  size: 'small' | 'medium' | 'large';
};

import styles from './Button.module.css';

export function Button({ label, variant = 'primary', size = 'medium', ...props }: ButtonProps) {
  const classes = [
    styles.btn,
    styles[`btn--${variant}`],
    styles[`btn--${size}`],
    props.className,
  ].join(' ');
  return (
    <button className={classes} {...props}>
      {label}
    </button>
  );
}
