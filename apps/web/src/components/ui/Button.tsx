import { forwardRef, type ButtonHTMLAttributes } from "react"
import "./styles.css"

export type ButtonVariant = "primary" | "secondary" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const sizeClass: Record<ButtonSize, string> = {
  sm: "ax-button--sm",
  md: "ax-button--md",
  lg: "ax-button--lg",
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "ax-button--primary",
  secondary: "ax-button--secondary",
  ghost: "ax-button--ghost",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, type = "button", ...props },
  ref,
) {
  const classes = ["ax-button", variantClass[variant], sizeClass[size]]
  if (className !== undefined && className.length > 0) classes.push(className)
  return <button ref={ref} type={type} className={classes.join(" ")} {...props} />
})