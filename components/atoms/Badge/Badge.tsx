export type BadgeProps = React.ComponentProps<'span'> & {
  label: string;
  variant: 'default' | 'outlined' | 'gold' | 'red' | 'green' | 'boss';
  textVariant: 'uppercase' | 'capitalised' | 'lowercase';
};

import styles from './Badge.module.css';

export function Badge({
  label,
  variant = 'default',
  textVariant = 'uppercase',
  ...props
}: BadgeProps) {
  const classes = [
    styles.bdg,
    styles[`bdg--${variant}`],
    styles[`bdg--${textVariant}`],
    props.className,
  ].join(' ');
  return (
    <span className={classes} {...props}>
      {label}
    </span>
  );
}
