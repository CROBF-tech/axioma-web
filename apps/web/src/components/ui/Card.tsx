import type { ElementType, HTMLAttributes } from "react"
import "./styles.css"

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
}

export function Card({ as, className, ...props }: CardProps) {
  const Tag = as ?? "div"
  const classes = ["ax-card"]
  if (className !== undefined && className.length > 0) classes.push(className)
  return <Tag className={classes.join(" ")} {...props} />
}