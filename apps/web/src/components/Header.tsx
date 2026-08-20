import { useEffect, useState } from "react"
import type { SyncQueueEntry } from "@axioma/shared"
import { useOnlineStatus } from "../hooks/useOnlineStatus.ts"
import { OfflineBadge } from "../features/sync/OfflineBadge.tsx"
import { countPendingSync, listSyncQueue } from "../data/syncQueue.ts"
import SkipLink from "./SkipLink.tsx"
import "./Header.css"

export function Header() {
  const online = useOnlineStatus()
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<SyncQueueEntry[]>([])

  useEffect(() => {
    let mounted = true
    async function refresh() {
      const pending = await countPendingSync()
      const queue = await listSyncQueue()
      if (!mounted) return
      setCount(pending)
      setItems(queue)
    }
    void refresh()
    const interval = setInterval(refresh, 2000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [online])

  return (
    <header className="app-header" role="banner">
      <SkipLink />
      <div className="app-header__brand">
        <a href="/" className="app-header__logo">Axioma</a>
      </div>
      <div className="app-header__actions">
        <OfflineBadge count={count} online={online} items={items} />
      </div>
    </header>
  )
}
