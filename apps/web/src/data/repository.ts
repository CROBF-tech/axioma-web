import type {
  Cell,
  CreateCellRequest,
  CreateFolderRequest,
  Folder,
  Notebook,
  UpdateCellRequest,
  UpdateFolderRequest,
  UpdateNotebookRequest,
} from "@axioma/db"
import {
  createFolder as apiCreateFolder,
  createNotebook as apiCreateNotebook,
  deleteFolder as apiDeleteFolder,
  deleteNotebook as apiDeleteNotebook,
  getNotebook as apiGetNotebook,
  getPublicNotebook as apiGetPublicNotebook,
  listFolders as apiListFolders,
  listNotebooks as apiListNotebooks,
  updateCell as apiUpdateCell,
  updateFolder as apiUpdateFolder,
  updateNotebook as apiUpdateNotebook,
} from "@axioma/db"
import { enqueueSync } from "./syncQueue"
import {
  deleteCellFromCache,
  deleteFolderFromCache,
  getCellsFromCache,
  getFoldersFromCache,
  getNotebookFromCache,
  saveCellToCache,
  saveCellsToCache,
  saveFolderToCache,
  saveNotebookToCache,
} from "./cache"

const STALE_MS = 5 * 60 * 1000

function normalizeNotebook(notebook: Notebook): Notebook {
  return {
    ...notebook,
    folderId: notebook.folderId ?? null,
    accent: notebook.accent ?? null,
    publicSlug: notebook.publicSlug ?? null,
  }
}

function normalizeFolder(folder: Folder): { id: string; ownerId: string; name: string; parentId: string | null; createdAt: Date } {
  return {
    id: folder.id,
    ownerId: folder.ownerId,
    name: folder.name,
    parentId: folder.parentId ?? null,
    createdAt: folder.createdAt,
  }
}

function cacheToNotebook(cache: Awaited<ReturnType<typeof getNotebookFromCache>>): Notebook | null {
  if (!cache) return null
  return {
    id: cache.id,
    ownerId: cache.ownerId,
    title: cache.title,
    folderId: cache.folderId ?? null,
    accent: cache.accent ?? null,
    isPublic: cache.isPublic,
    publicSlug: cache.publicSlug ?? null,
    createdAt: new Date(cache.createdAt),
    updatedAt: new Date(cache.updatedAt),
  }
}

function cacheToCell(cache: Awaited<ReturnType<typeof getCellsFromCache>>[number]): Cell {
  return {
    id: cache.id,
    notebookId: cache.notebookId,
    orderIdx: cache.orderIdx,
    kind: cache.kind,
    input: cache.input,
    output: cache.output ?? null,
    references: cache.references ?? null,
    createdAt: new Date(cache.createdAt),
    updatedAt: new Date(cache.updatedAt),
  }
}

export async function getNotebook(id: string): Promise<{ notebook: Notebook; cells: Cell[] }> {
  const cached = await getNotebookFromCache(id)
  if (cached) {
    const age = Date.now() - cached.updatedAt
    if (age < STALE_MS) {
      const cells = await getCellsFromCache(id)
      return {
        notebook: cacheToNotebook(cached)!,
        cells: cells.map(cacheToCell),
      }
    }
  }

  const fresh = await apiGetNotebook(id)
  await saveNotebookToCache(fresh.notebook)
  await saveCellsToCache(fresh.cells)
  return {
    notebook: normalizeNotebook(fresh.notebook),
    cells: fresh.cells,
  }
}

export async function listNotebooks(cursor?: string): Promise<{ items: Notebook[]; nextCursor: string | null }> {
  const response = await apiListNotebooks(cursor)
  for (const notebook of response.items) {
    await saveNotebookToCache(notebook)
  }
  return {
    items: response.items.map(normalizeNotebook),
    nextCursor: response.nextCursor,
  }
}

export async function createNotebook(data: { title?: string; accent?: string; folderId?: string | null }): Promise<Notebook> {
  const created = await apiCreateNotebook(data)
  await saveNotebookToCache(created)
  return normalizeNotebook(created)
}

export async function updateNotebookMeta(id: string, data: UpdateNotebookRequest): Promise<Notebook> {
  const updated = await apiUpdateNotebook(id, data)
  await saveNotebookToCache(updated)
  return normalizeNotebook(updated)
}

export async function deleteNotebook(id: string): Promise<void> {
  await apiDeleteNotebook(id)
}

export async function saveCell(cell: Cell): Promise<void> {
  await saveCellToCache(cell)
  await enqueueSync({
    entity: "cell",
    entityId: cell.id,
    op: "update",
    payload: {
      notebookId: cell.notebookId,
      input: cell.input,
      output: cell.output ?? null,
      references: cell.references ?? null,
      orderIdx: cell.orderIdx,
    } as UpdateCellRequest & { notebookId: string },
    createdAt: Date.now(),
  })
}

export async function createCellLocal(
  notebookId: string,
  cellData: CreateCellRequest,
): Promise<Cell> {
  const id = crypto.randomUUID()
  const now = new Date()
  const cell: Cell = {
    id,
    notebookId,
    orderIdx: cellData.orderIdx ?? 0,
    kind: cellData.kind,
    input: cellData.input ?? "",
    output: null,
    references: null,
    createdAt: now,
    updatedAt: now,
  }
  await saveCellToCache(cell)
  await enqueueSync({
    entity: "cell",
    entityId: id,
    op: "create",
    payload: { notebookId, ...cellData } as CreateCellRequest & { notebookId: string },
    createdAt: Date.now(),
  })
  return cell
}

export async function deleteCellLocal(id: string): Promise<void> {
  await deleteCellFromCache(id)
  await enqueueSync({
    entity: "cell",
    entityId: id,
    op: "delete",
    payload: null,
    createdAt: Date.now(),
  })
}

export async function flushDirtyCell(id: string, data: UpdateCellRequest): Promise<Cell> {
  const updated = await apiUpdateCell(id, data)
  await saveCellToCache(updated)
  return updated
}



export async function listFolders(): Promise<{ items: Folder[] }> {
  const response = await apiListFolders()
  for (const folder of response.items) {
    await saveFolderToCache(normalizeFolder(folder))
  }
  return {
    items: response.items.map(normalizeFolder),
  }
}

export async function createFolder(data: CreateFolderRequest): Promise<Folder> {
  const created = await apiCreateFolder(data)
  const normalized = normalizeFolder(created)
  await saveFolderToCache(normalized)
  return normalized
}

export async function updateFolder(id: string, data: UpdateFolderRequest): Promise<Folder> {
  const updated = await apiUpdateFolder(id, data)
  const normalized = normalizeFolder(updated)
  await saveFolderToCache(normalized)
  return normalized
}

export async function deleteFolder(id: string): Promise<void> {
  await apiDeleteFolder(id)
  await deleteFolderFromCache(id)
}

export async function toggleShare(notebookId: string, enabled: boolean): Promise<{ isPublic: boolean; publicSlug: string | null; publicUrl: string | null }> {
  const { toggleShare: apiToggleShare } = await import("@axioma/db")
  return apiToggleShare(notebookId, enabled)
}

export async function getPublicNotebook(slug: string): Promise<{ notebook: Pick<Notebook, "id" | "title" | "accent">; cells: Cell[] }> {
  return apiGetPublicNotebook(slug)
}

export async function getCachedCells(notebookId: string): Promise<Cell[]> {
  const cells = await getCellsFromCache(notebookId)
  return cells.map(cacheToCell)
}

export async function getCachedFolders(): Promise<Folder[]> {
  const folders = await getFoldersFromCache("")
  return folders.map((folder) => ({
    id: folder.id,
    ownerId: folder.ownerId,
    name: folder.name,
    parentId: folder.parentId ?? null,
    createdAt: new Date(folder.createdAt),
  }))
}
