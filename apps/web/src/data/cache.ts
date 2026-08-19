import type { Cell, Notebook } from "@axioma/db"
import type { Folder } from "@axioma/shared"
import { db, type CellCache, type FolderCache, type NotebookCache } from "./db"

export function notebookToCache(notebook: Notebook): NotebookCache {
  return {
    id: notebook.id,
    ownerId: notebook.ownerId,
    title: notebook.title,
    folderId: notebook.folderId ?? null,
    accent: notebook.accent ?? null,
    isPublic: notebook.isPublic,
    publicSlug: notebook.publicSlug ?? null,
    createdAt: notebook.createdAt.getTime(),
    updatedAt: notebook.updatedAt.getTime(),
  }
}

export function cellToCache(cell: Cell): CellCache {
  return {
    id: cell.id,
    notebookId: cell.notebookId,
    orderIdx: cell.orderIdx,
    kind: cell.kind,
    input: cell.input,
    output: cell.output ?? null,
    references: cell.references ?? null,
    createdAt: cell.createdAt.getTime(),
    updatedAt: cell.updatedAt.getTime(),
  }
}

export function folderToCache(folder: Folder): FolderCache {
  return {
    id: folder.id,
    ownerId: folder.ownerId,
    name: folder.name,
    parentId: folder.parentId ?? null,
    createdAt: folder.createdAt.getTime(),
  }
}

export async function getNotebookFromCache(
  id: string,
): Promise<NotebookCache | undefined> {
  if (!db) return undefined
  return db.notebooks.get(id)
}

export async function saveNotebookToCache(notebook: Notebook): Promise<void> {
  if (!db) return
  await db.notebooks.put(notebookToCache(notebook))
}

export async function getCellsFromCache(
  notebookId: string,
): Promise<CellCache[]> {
  if (!db) return []
  return db.cells.where("notebookId").equals(notebookId).toArray()
}

export async function saveCellToCache(cell: Cell): Promise<void> {
  if (!db) return
  await db.cells.put(cellToCache(cell))
}

export async function saveCellsToCache(cells: Cell[]): Promise<void> {
  if (!db || cells.length === 0) return
  await db.cells.bulkPut(cells.map(cellToCache))
}

export async function deleteCellFromCache(id: string): Promise<void> {
  if (!db) return
  await db.cells.delete(id)
}

export async function getFoldersFromCache(
  ownerId: string,
): Promise<FolderCache[]> {
  if (!db) return []
  return db.folders.where("ownerId").equals(ownerId).toArray()
}

export async function saveFolderToCache(folder: Folder): Promise<void> {
  if (!db) return
  await db.folders.put(folderToCache(folder))
}

export async function deleteFolderFromCache(id: string): Promise<void> {
  if (!db) return
  await db.folders.delete(id)
}

export async function clearNotebookCache(notebookId: string): Promise<void> {
  if (!db) return
  const local = db
  const cellIds = await local.cells
    .where("notebookId")
    .equals(notebookId)
    .primaryKeys()
  await local.transaction("rw", local.notebooks, local.cells, async () => {
    await local.cells.bulkDelete(cellIds as string[])
    await local.notebooks.delete(notebookId)
  })
}