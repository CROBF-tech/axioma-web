import type { Folder } from "./index.ts";
import type { ID } from "./constants.ts";

export type FolderNode<F = Folder> = { folder: F; children: FolderNode<F>[] };

export function buildFolderTree<F extends { id: ID; parentId?: ID | null }>(
  folders: readonly F[],
): FolderNode<F>[] {
  const byId = new Map<ID, FolderNode<F>>();
  for (const folder of folders) {
    byId.set(folder.id, { folder, children: [] });
  }
  const roots: FolderNode<F>[] = [];
  for (const folder of folders) {
    const node = byId.get(folder.id);
    if (!node) continue;
    const parentId = folder.parentId ?? null;
    if (parentId && byId.has(parentId)) {
      byId.get(parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function flattenFolderTree<F>(nodes: readonly FolderNode<F>[]): F[] {
  const out: F[] = [];
  const stack: FolderNode<F>[] = [...nodes];
  while (stack.length > 0) {
    const node = stack.shift();
    if (!node) break;
    out.push(node.folder);
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.unshift(node.children[i] as FolderNode<F>);
    }
  }
  return out;
}

export function getFolderChildren<F extends { id: ID; parentId?: ID | null }>(
  folders: readonly F[],
  parentId: ID | null,
): F[] {
  return folders.filter((f) => (f.parentId ?? null) === parentId);
}

export function getFolderAncestors<F extends { id: ID; parentId?: ID | null }>(
  folders: readonly F[],
  folderId: ID,
): F[] {
  const byId = new Map<ID, F>();
  for (const f of folders) byId.set(f.id, f);
  const out: F[] = [];
  let current = byId.get(folderId);
  const visited = new Set<ID>([folderId]);
  while (current && (current.parentId ?? null) !== null) {
    const pid = current.parentId as ID;
    if (visited.has(pid)) break;
    visited.add(pid);
    const parent = byId.get(pid);
    if (!parent) break;
    out.push(parent);
    current = parent;
  }
  return out;
}

export function isFolderDescendant<F extends { id: ID; parentId?: ID | null }>(
  folders: readonly F[],
  folderId: ID,
  ancestorId: ID,
): boolean {
  return getFolderAncestors(folders, folderId).some((f) => f.id === ancestorId);
}

export function notebooksInFolder<N extends { folderId?: ID | null }>(
  notebooks: readonly N[],
  folderId: ID | null,
): N[] {
  return notebooks.filter((n) => (n.folderId ?? null) === folderId);
}