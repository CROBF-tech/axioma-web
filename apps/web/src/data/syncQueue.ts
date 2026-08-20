import type { SyncQueueEntry } from "@axioma/shared"
import { db } from "./db"

type SyncQueueListener = () => void
const listeners = new Set<SyncQueueListener>()

function emitSyncQueueChanged() {
  for (const fn of listeners) {
    try {
      fn()
    } catch {
      // ignore listener errors
    }
  }
}

if (db) {
  db.syncQueue.hook("creating", emitSyncQueueChanged)
  db.syncQueue.hook("updating", emitSyncQueueChanged)
  db.syncQueue.hook("deleting", emitSyncQueueChanged)
}

export function onSyncQueueChanged(listener: SyncQueueListener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function getSyncQueueSummary(): Promise<{
  items: SyncQueueEntry[]
  pending: number
  conflicts: number
}> {
  if (!db) return { items: [], pending: 0, conflicts: 0 }
  const items = await db.syncQueue.toArray()
  items.sort((a, b) => a.createdAt - b.createdAt)
  const pending = items.length
  const conflicts = items.filter((entry) => entry.conflict).length
  return { items, pending, conflicts }
}

export async function countSyncConflicts(): Promise<number> {
  if (!db) return 0
  return db.syncQueue.where("conflict").equals(1).count()
}

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