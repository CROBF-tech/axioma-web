import { Button } from "./Button.tsx"
import "./styles.css"

export type EmptyStateProps = {
  icon?: string
  title: string
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon = "📦", title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="ax-empty-state">
      <span className="ax-empty-state__icon" aria-hidden="true">{icon}</span>
      <h3 className="ax-empty-state__title">{title}</h3>
      {message && <p className="ax-empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} aria-label={actionLabel}>{actionLabel}</Button>
      )}
    </div>
  )
}
