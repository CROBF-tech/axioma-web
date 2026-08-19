import {
  ApiError,
  createCell,
  createFolder,
  createNotebook,
  deleteCell,
  deleteFolder,
  deleteNotebook,
  getNotebook,
  updateCell,
  updateFolder,
  updateNotebook,
} from "@axioma/db"
import type {
  Cell,
  CreateCellRequest,
  CreateFolderRequest,
  CreateNotebookRequest,
  Notebook,
  UpdateCellRequest,
  UpdateFolderRequest,
  UpdateNotebookRequest,
} from "@axioma/db"
import type { SyncQueueEntry } from "@axioma/shared"
import { mergeByUpdatedAt } from "@axioma/shared"
import { countPendingSync, dequeueSync, enqueueSync, listSyncQueue, markSyncConflict } from "./syncQueue"
import { getNotebookFromCache, saveCellToCache, saveNotebookToCache } from "./cache"

let syncing = false

export { ApiError }

function classifySyncFailure(status: number): "conflict" | "fatal" | "retry" {
  if (status === 409 || status === 412) return "conflict"
  if (status >= 500) return "retry"
  return "fatal"
}

export async function getConflicts(): Promise<SyncQueueEntry[]> {
  const queue = await listSyncQueue()
  return queue.filter((item) => item.conflict)
}

export async function tryResolveConflict(entry: SyncQueueEntry): Promise<boolean> {
  if (entry.id === undefined) return false
  if (entry.op !== "update") return false
  if (entry.entity === "cell") {
    return resolveCellConflict(entry)
  }
  if (entry.entity === "notebook") {
    return resolveNotebookConflict(entry)
  }
  return false
}

function assertId(entry: SyncQueueEntry): asserts entry is SyncQueueEntry & { id: number } {
  if (entry.id === undefined) throw new Error("SyncQueueEntry missing id")
}

async function resolveCellConflict(entry: SyncQueueEntry): Promise<boolean> {
  assertId(entry)
  const payload = entry.payload as UpdateCellRequest & { notebookId?: string }
  const notebookId = payload.notebookId
  if (!notebookId) return false
  try {
    const fresh = await getNotebook(notebookId)
    const remote = fresh.cells.find((c) => c.id === entry.entityId)
    if (!remote) {
      await dequeueSync(entry.id)
      return true
    }
    const cached = await getNotebookFromCache(notebookId)
    const localUpdatedAt = cached ? new Date(cached.updatedAt) : new Date(entry.createdAt)
    const local: Cell = {
      id: entry.entityId,
      notebookId,
      orderIdx: payload.orderIdx ?? remote.orderIdx,
      kind: remote.kind,
      input: payload.input ?? remote.input,
      output: payload.output ?? remote.output ?? null,
      references: payload.references ?? remote.references ?? null,
      createdAt: remote.createdAt,
      updatedAt: localUpdatedAt,
    }
    const winner = mergeByUpdatedAt(local, remote)
    const winnerCell: Cell = winner.id === remote.id ? remote : local
    await saveCellToCache(winnerCell)
    if (winner.id === remote.id) {
      await dequeueSync(entry.id)
      return true
    }
    await dequeueSync(entry.id)
    await enqueueSync({
      entity: "cell",
      entityId: entry.entityId,
      op: "update",
      payload,
      createdAt: Date.now(),
    })
    return true
  } catch (e) {
    if (e instanceof ApiError && classifySyncFailure(e.status) === "fatal") {
      await markSyncConflict(entry.id)
    }
    return false
  }
}

async function resolveNotebookConflict(entry: SyncQueueEntry): Promise<boolean> {
  assertId(entry)
  try {
    const fresh = await getNotebook(entry.entityId)
    const remote = fresh.notebook
    const payload = entry.payload as UpdateNotebookRequest
    const local: Notebook = {
      id: entry.entityId,
      ownerId: remote.ownerId,
      title: payload.title ?? remote.title,
      folderId: payload.folderId ?? remote.folderId ?? null,
      accent: payload.accent ?? remote.accent ?? null,
      isPublic: remote.isPublic,
      publicSlug: remote.publicSlug ?? null,
      createdAt: remote.createdAt,
      updatedAt: new Date(entry.createdAt),
    }
    const winner = mergeByUpdatedAt(local, remote)
    const winnerNotebook: Notebook = winner.id === remote.id ? remote : local
    await saveNotebookToCache(winnerNotebook)
    if (winner.id === remote.id) {
      await dequeueSync(entry.id)
      return true
    }
    await dequeueSync(entry.id)
    await enqueueSync({
      entity: "notebook",
      entityId: entry.entityId,
      op: "update",
      payload,
      createdAt: Date.now(),
    })
    return true
  } catch (e) {
    if (e instanceof ApiError && classifySyncFailure(e.status) === "fatal") {
      await markSyncConflict(entry.id)
    }
    return false
  }
}

export async function processSyncQueue(): Promise<void> {
  const queue = await listSyncQueue()
  for (const item of queue) {
    if (item.conflict) {
      await tryResolveConflict(item)
      continue
    }
    try {
      if (item.entity === "notebook") {
        if (item.op === "create") {
          await createNotebook(item.payload as CreateNotebookRequest)
        } else if (item.op === "update") {
          await updateNotebook(item.entityId, item.payload as UpdateNotebookRequest)
        } else if (item.op === "delete") {
          await deleteNotebook(item.entityId)
        }
      } else if (item.entity === "cell") {
        if (item.op === "create") {
          const payload = item.payload as CreateCellRequest & { notebookId: string }
          await createCell(payload.notebookId, payload)
        } else if (item.op === "update") {
          await updateCell(item.entityId, item.payload as UpdateCellRequest)
        } else if (item.op === "delete") {
          await deleteCell(item.entityId)
        }
      } else if (item.entity === "folder") {
        if (item.op === "create") {
          await createFolder(item.payload as CreateFolderRequest)
        } else if (item.op === "update") {
          await updateFolder(item.entityId, item.payload as UpdateFolderRequest)
        } else if (item.op === "delete") {
          await deleteFolder(item.entityId)
        }
      }
      await dequeueSync(item.id!)
    } catch (error) {
      if (error instanceof ApiError) {
        const failure = classifySyncFailure(error.status)
        if (failure === "retry") {
          break
        }
        if (failure === "conflict") {
          await markSyncConflict(item.id!)
          continue
        }
        await markSyncConflict(item.id!)
        continue
      }
      break
    }
  }
}

export async function triggerSync(): Promise<void> {
  if (syncing) return
  const pending = await countPendingSync()
  if (pending === 0) return
  syncing = true
  try {
    await processSyncQueue()
  } catch {
  } finally {
    syncing = false
  }
}
