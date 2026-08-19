import { useState } from "react"
import { Badge } from "../../components/ui/Badge.tsx"
import type { SyncQueueEntry } from "@axioma/shared"
import "./OfflineBadge.css"

export type OfflineBadgeProps = {
  count: number
  online: boolean
  items?: SyncQueueEntry[]
}

export function OfflineBadge({ count, online, items = [] }: OfflineBadgeProps) {
  const [open, setOpen] = useState(false)

  if (online && count === 0) return null

  const label = online
    ? `Cambios pendientes`
    : `Sin conexión — ${count} cambios pendientes`

  return (
    <div className="offline-badge">
      <button
        type="button"
        className="offline-badge__trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="offline-badge__label">{label}</span>
        <Badge variant={online ? "default" : "warning"}>{count}</Badge>
      </button>
      {open && items.length > 0 && (
        <ul className="offline-badge__list">
          {items.map((item) => (
            <li key={item.id ?? `${item.entity}-${item.entityId}`} className="offline-badge__item">
              {item.op} {item.entity} {item.entityId}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
