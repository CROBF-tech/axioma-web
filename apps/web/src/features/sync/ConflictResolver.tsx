import { useState } from "react"
import type { SyncQueueEntry } from "@axioma/shared"
import type { UpdateCellRequest } from "@axioma/db"
import { getNotebook, ApiError } from "@axioma/db"
import { dequeueSync, unmarkSyncConflict } from "../../data/syncQueue.ts"
import { saveCellToCache, saveNotebookToCache } from "../../data/cache.ts"
import { Button } from "../../components/ui/Button.tsx"
import "./ConflictResolver.css"

export type ConflictResolverProps = {
  entry: SyncQueueEntry
  onResolved?: () => void
}

export function ConflictResolver({ entry, onResolved }: ConflictResolverProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRemote() {
    if (entry.id === undefined) return
    setLoading(true)
    setError(null)
    try {
      if (entry.entity === "notebook") {
        const fresh = await getNotebook(entry.entityId)
        await saveNotebookToCache(fresh.notebook)
      } else if (entry.entity === "cell") {
        const payload = entry.payload as UpdateCellRequest & { notebookId?: string }
        const notebookId = payload.notebookId
        if (!notebookId) {
          setError("Falta notebookId en la celda")
          setLoading(false)
          return
        }
        const fresh = await getNotebook(notebookId)
        const remote = fresh.cells.find((c) => c.id === entry.entityId)
        if (remote) {
          await saveCellToCache(remote)
        }
      }
      await dequeueSync(entry.id)
      onResolved?.()
    } catch (e) {
      setError(e instanceof ApiError ? `Error ${e.status}: ${e.body}` : "No se pudo cargar la versión remota")
    } finally {
      setLoading(false)
    }
  }

  async function handleLocal() {
    if (entry.id === undefined) return
    setLoading(true)
    setError(null)
    try {
      await unmarkSyncConflict(entry.id)
      onResolved?.()
    } catch {
      setError("No se pudo mantener la versión local")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="conflict-resolver">
      <div className="conflict-resolver__header">
        <span className="conflict-resolver__entity">{entry.entity}</span>
        <span className="conflict-resolver__op">{entry.op}</span>
        <span className="conflict-resolver__id">{entry.entityId}</span>
      </div>
      <p className="conflict-resolver__message">
        La operación entró en conflicto con una versión más nueva en el servidor.
      </p>
      {error && <p className="conflict-resolver__error">{error}</p>}
      <div className="conflict-resolver__actions">
        <Button onClick={handleLocal} disabled={loading} variant="secondary">
          Mantener versión local
        </Button>
        <Button onClick={handleRemote} disabled={loading}>
          Mantener versión remota
        </Button>
      </div>
      {loading && (
        <div className="conflict-resolver__loading">
          <span className="conflict-resolver__loading-text">Resolviendo...</span>
        </div>
      )}
    </div>
  )
}
