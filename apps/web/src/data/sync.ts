import {
  ApiError,
  createCell,
  createFolder,
  createNotebook,
  deleteCell,
  deleteFolder,
  deleteNotebook,
  updateCell,
  updateFolder,
  updateNotebook,
} from "@axioma/db"
import type {
  CreateCellRequest,
  CreateFolderRequest,
  CreateNotebookRequest,
  UpdateCellRequest,
  UpdateFolderRequest,
  UpdateNotebookRequest,
} from "@axioma/db"
import { countPendingSync, dequeueSync, listSyncQueue, markSyncConflict } from "./syncQueue"

let syncing = false

export { ApiError }

export async function processSyncQueue(): Promise<void> {
  const queue = await listSyncQueue()
  for (const item of queue) {
    if (item.conflict) continue
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
        if (error.status >= 500) {
          break
        }
        if (error.status >= 400 && error.status < 500) {
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
    // Ignored; queue items remain for retry.
  } finally {
    syncing = false
  }
}
