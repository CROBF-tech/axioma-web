import type { Cell, Folder, Notebook } from "./types.ts";
import { getApiUrl } from "./env.ts";

export type CellKind = Cell["kind"];

export type CreateNotebookRequest = {
  title?: string;
  accent?: string;
  folderId?: string | null;
};

export type UpdateNotebookRequest = {
  title?: string;
  accent?: string;
  folderId?: string | null;
};

export type CreateCellRequest = {
  kind: CellKind;
  input?: string;
  orderIdx?: number;
};

export type UpdateCellRequest = {
  input?: string;
  output?: string | null;
  references?: string[];
  orderIdx?: number;
};

export type ReorderRequest = {
  order: string[];
};

export type CreateFolderRequest = {
  name: string;
  parentId: string | null;
};

export type UpdateFolderRequest = {
  name?: string;
  parentId?: string | null;
};

export type NotebookWithCells = {
  notebook: Notebook;
  cells: Cell[];
};

export type PublicNotebook = {
  notebook: Pick<Notebook, "id" | "title" | "accent">;
  cells: Cell[];
};

export type ListNotebooksResponse = {
  items: Notebook[];
  nextCursor: string | null;
};

export type ListFoldersResponse = {
  items: Folder[];
};

export type ShareToggleResponse = {
  isPublic: boolean;
  publicSlug: string | null;
  publicUrl: string | null;
};

export type CheckoutResponse = {
  init_point: string;
};

export type SubscriptionStatusResponse = {
  status: "active" | "pending" | "cancelled" | "expired" | "none";
  plan: "monthly" | "annual" | null;
  current_period_end: string | null;
};

export type MeResponse = {
  id: string;
  email: string;
  name: string;
};

function apiUrl(path: string): string {
  const base = getApiUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base.replace(/\/$/, "")}${normalized}`;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new ApiError(response.status, body);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API error ${status}: ${body}`);
    this.name = "ApiError";
  }
}

export function getMe(): Promise<MeResponse> {
  return fetchJson<MeResponse>("/api/me", { method: "GET" });
}

export function listNotebooks(cursor?: string): Promise<ListNotebooksResponse> {
  const qs = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  return fetchJson<ListNotebooksResponse>(`/api/notebooks${qs}`, { method: "GET" });
}

export function createNotebook(data: CreateNotebookRequest): Promise<Notebook> {
  return fetchJson<Notebook>("/api/notebooks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getNotebook(id: string): Promise<NotebookWithCells> {
  return fetchJson<NotebookWithCells>(`/api/notebooks/${id}`, { method: "GET" });
}

export function updateNotebook(
  id: string,
  data: UpdateNotebookRequest,
): Promise<Notebook> {
  return fetchJson<Notebook>(`/api/notebooks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteNotebook(id: string): Promise<void> {
  return fetchJson<void>(`/api/notebooks/${id}`, { method: "DELETE" });
}

export function createCell(
  notebookId: string,
  data: CreateCellRequest,
): Promise<Cell> {
  return fetchJson<Cell>(`/api/notebooks/${notebookId}/cells`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCell(id: string, data: UpdateCellRequest): Promise<Cell> {
  return fetchJson<Cell>(`/api/cells/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCell(id: string): Promise<void> {
  return fetchJson<void>(`/api/cells/${id}`, { method: "DELETE" });
}

export function reorderCells(
  notebookId: string,
  data: ReorderRequest,
): Promise<{ ok: boolean }> {
  return fetchJson<{ ok: boolean }>(`/api/notebooks/${notebookId}/reorder`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listFolders(): Promise<ListFoldersResponse> {
  return fetchJson<ListFoldersResponse>("/api/folders", { method: "GET" });
}

export function createFolder(data: CreateFolderRequest): Promise<Folder> {
  return fetchJson<Folder>("/api/folders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateFolder(
  id: string,
  data: UpdateFolderRequest,
): Promise<Folder> {
  return fetchJson<Folder>(`/api/folders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteFolder(id: string): Promise<void> {
  return fetchJson<void>(`/api/folders/${id}`, { method: "DELETE" });
}

export function toggleShare(
  notebookId: string,
  enabled: boolean,
): Promise<ShareToggleResponse> {
  return fetchJson<ShareToggleResponse>(`/api/notebooks/${notebookId}/share`, {
    method: "POST",
    body: JSON.stringify({ enabled }),
  });
}

export function getPublicNotebook(slug: string): Promise<PublicNotebook> {
  return fetchJson<PublicNotebook>(`/public/notebooks/${slug}`, {
    method: "GET",
  });
}

export function checkout(plan: "monthly" | "annual"): Promise<CheckoutResponse> {
  return fetchJson<CheckoutResponse>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

export function getSubscriptionStatus(): Promise<SubscriptionStatusResponse> {
  return fetchJson<SubscriptionStatusResponse>("/billing/status", {
    method: "GET",
  });
}

export function cancelSubscription(): Promise<SubscriptionStatusResponse> {
  return fetchJson<SubscriptionStatusResponse>("/billing/cancel", {
    method: "POST",
  });
}