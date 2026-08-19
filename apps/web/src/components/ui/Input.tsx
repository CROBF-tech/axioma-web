import { forwardRef, type InputHTMLAttributes } from "react"
import "./styles.css"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  const classes = ["ax-input"]
  if (className !== undefined && className.length > 0) classes.push(className)
  return <input ref={ref} type={type} className={classes.join(" ")} {...props} />
})