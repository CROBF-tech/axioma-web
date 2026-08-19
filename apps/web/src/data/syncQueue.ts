import type { SyncQueueEntry } from "@axioma/shared"
import { db } from "./db"

export async function enqueueSync(
  entry: Omit<SyncQueueEntry, "id">,
): Promise<number> {
  if (!db) return -1
  return db.syncQueue.add(entry)
}

export async function dequeueSync(id: number): Promise<void> {
  if (!db) return
  await db.syncQueue.delete(id)
}

export async function listSyncQueue(): Promise<SyncQueueEntry[]> {
  if (!db) return []
  const entries = await db.syncQueue.toArray()
  entries.sort((a, b) => a.createdAt - b.createdAt)
  return entries
}

export async function markSyncConflict(id: number): Promise<void> {
  if (!db) return
  await db.syncQueue.update(id, { conflict: true })
}

export async function clearSyncQueue(): Promise<void> {
  if (!db) return
  await db.syncQueue.clear()
}

export async function countPendingSync(): Promise<number> {
  if (!db) return 0
  return db.syncQueue.count()
}