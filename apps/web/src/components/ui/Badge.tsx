import type { HTMLAttributes } from "react"
import "./Badge.css"

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "warning" | "danger"
}

const variantClass: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "ax-badge--default",
  warning: "ax-badge--warning",
  danger: "ax-badge--danger",
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  const classes = ["ax-badge", variantClass[variant]]
  if (className !== undefined && className.length > 0) classes.push(className)
  return <span className={classes.join(" ")} {...props} />
}
