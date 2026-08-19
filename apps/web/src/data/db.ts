import Dexie, { type Table } from "dexie"
import type { CellKind, SyncQueueEntry } from "@axioma/shared"

export type NotebookCache = {
  id: string
  ownerId: string
  title: string
  folderId: string | null
  accent: string | null
  isPublic: boolean
  publicSlug: string | null
  createdAt: number
  updatedAt: number
}

export type CellCache = {
  id: string
  notebookId: string
  orderIdx: number
  kind: CellKind
  input: string
  output: string | null
  references: string[] | null
  createdAt: number
  updatedAt: number
}

export type FolderCache = {
  id: string
  ownerId: string
  name: string
  parentId: string | null
  createdAt: number
}

export type { SyncQueueEntry }

class AxiomaDB extends Dexie {
  notebooks!: Table<NotebookCache, string>
  cells!: Table<CellCache, string>
  folders!: Table<FolderCache, string>
  syncQueue!: Table<SyncQueueEntry, number>

  constructor() {
    super("axioma")
    this.version(1).stores({
      notebooks: "id",
      cells: "id, notebookId",
      folders: "id, ownerId",
      syncQueue: "++id, entity, entityId",
    })
  }
}

export const db: AxiomaDB | null =
  typeof window === "undefined" ? null : new AxiomaDB()