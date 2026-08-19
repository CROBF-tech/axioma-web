export type SkeletonProps = {
  variant?: "rect" | "circle" | "text"
  width?: string
  height?: string
  className?: string
}

export function Skeleton({ variant = "rect", width, height, className = "" }: SkeletonProps) {
  return (
    <span
      className={["ax-skeleton", `ax-skeleton--${variant}`, className].filter(Boolean).join(" ")}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
