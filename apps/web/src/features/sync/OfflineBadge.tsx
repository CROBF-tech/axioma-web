import { useState } from "react"
import { Badge } from "../../components/ui/Badge.tsx"
import type { SyncQueueEntry } from "@axioma/shared"
import "./OfflineBadge.css"

export type OfflineBadgeProps = {
  count: number
  conflicts: number
  online: boolean
  items?: SyncQueueEntry[]
}

export function OfflineBadge({ count, conflicts, online, items = [] }: OfflineBadgeProps) {
  const [open, setOpen] = useState(false)

  if (online && count === 0) return null

  const hasConflicts = conflicts > 0
  const label = online
    ? hasConflicts ? `Cambios pendientes con conflictos` : `Cambios pendientes`
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
        <Badge variant={!online || hasConflicts ? "warning" : "default"}>{count}</Badge>
        {hasConflicts && <Badge variant="danger">{conflicts}</Badge>}
      </button>
      {open && items.length > 0 && (
        <ul className="offline-badge__list">
          {items.map((item) => (
            <li
              key={item.id ?? `${item.entity}-${item.entityId}`}
              className={["offline-badge__item", item.conflict ? "offline-badge__item--conflict" : ""].filter(Boolean).join(" ")}
            >
              {item.op} {item.entity} {item.entityId}
              {item.conflict && <span className="offline-badge__conflict-mark"> — conflicto</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
