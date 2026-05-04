import { ComponentProps, ReactNode } from "react"
import { Slot } from "@radix-ui/react-slot"

import styles from './Typography.module.css';

export type TypographyProps = ComponentProps<'p'> & {
  variant: "display-primary-large" | "display-secondary-large" | "display-secondary-medium" | "display-secondary-small" | "display-secondary-xsmall" | "body" | "body-small" | "body--xsmall";
  asChild: boolean;
  children: ReactNode;
}

export function Typography({
  className,
  variant = "body",
  asChild = false,
  children,
  ...props
}: TypographyProps) {
  const Comp = asChild ? Slot : "p"

  const classes = [styles.type, styles[`type--${variant}`]].join(' ');

  return (
    <Comp
      className={classes}
      {...props}
    >{children}</Comp>
  )
}