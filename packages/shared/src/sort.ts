export function compareByUpdatedAt<T extends { updatedAt: number | Date }>(a: T, b: T): number {
  const at = a.updatedAt instanceof Date ? a.updatedAt.getTime() : a.updatedAt;
  const bt = b.updatedAt instanceof Date ? b.updatedAt.getTime() : b.updatedAt;
  return bt - at;
}

export function compareByOrderIdx<T extends { orderIdx: number }>(a: T, b: T): number {
  return a.orderIdx - b.orderIdx;
}

export function compareByName<T extends { name: string }>(a: T, b: T): number {
  return a.name.localeCompare(b.name);
}

export function sortCellsByOrderIdx<C extends { orderIdx: number }>(cells: readonly C[]): C[] {
  return [...cells].sort(compareByOrderIdx);
}

export function sortNotebooksByUpdatedDesc<N extends { updatedAt: number | Date }>(
  notebooks: readonly N[],
): N[] {
  return [...notebooks].sort(compareByUpdatedAt);
}

export function sortFoldersByName<F extends { name: string }>(folders: readonly F[]): F[] {
  return [...folders].sort(compareByName);
}