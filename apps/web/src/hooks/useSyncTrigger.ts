import { useEffect, useRef } from "react"
import { countPendingSync } from "../data/syncQueue"
import { triggerSync } from "../data/sync"
import { useOnlineStatus } from "./useOnlineStatus"

export function useSyncTrigger(): void {
  const online = useOnlineStatus()
  const previousOnline = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    async function maybeSync() {
      const pending = await countPendingSync()
      if (pending > 0) {
        await triggerSync()
      }
    }

    if (previousOnline.current === undefined && online) {
      void maybeSync()
    } else if (previousOnline.current === false && online) {
      void maybeSync()
    }
    previousOnline.current = online
  }, [online])
}
