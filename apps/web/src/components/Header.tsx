import { useEffect, useState } from "react"
import type { SyncQueueEntry } from "@axioma/shared"
import { useOnlineStatus } from "../hooks/useOnlineStatus.ts"
import { OfflineBadge } from "../features/sync/OfflineBadge.tsx"
import { getSyncQueueSummary, onSyncQueueChanged } from "../data/syncQueue.ts"
import SkipLink from "./SkipLink.tsx"
import "./Header.css"

export function Header() {
  const online = useOnlineStatus()
  const [count, setCount] = useState(0)
  const [conflicts, setConflicts] = useState(0)
  const [items, setItems] = useState<SyncQueueEntry[]>([])

  useEffect(() => {
    let mounted = true
    async function refresh() {
      const summary = await getSyncQueueSummary()
      if (!mounted) return
      setCount(summary.pending)
      setConflicts(summary.conflicts)
      setItems(summary.items)
    }
    void refresh()
    const unsubscribe = onSyncQueueChanged(() => void refresh())
    return () => {
      mounted = false
      unsubscribe()
    }
  }, [])

  return (
    <header className="app-header" role="banner">
      <SkipLink />
      <div className="app-header__brand">
        <a href="/" className="app-header__logo">Axioma</a>
      </div>
      <div className="app-header__actions">
        <OfflineBadge count={count} conflicts={conflicts} online={online} items={items} />
      </div>
    </header>
  )
}
