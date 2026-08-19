import type { ID } from "./constants.ts";

export function notebookPath(id: ID): string {
  return `/notebooks/${id}`;
}

export function publicNotebookPath(slug: string): string {
  return `/s/${slug}`;
}

export function isPublicNotebook<N extends { isPublic: boolean; publicSlug?: string | null }>(
  nb: N,
): boolean {
  return nb.isPublic === true && Boolean(nb.publicSlug);
}