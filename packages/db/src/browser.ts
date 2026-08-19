import type { Cell, NewCell, NewNotebook, Notebook } from "./types.ts";
import { getApiUrl } from "./env.ts";

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
    throw new Error(`API error ${response.status}: ${body}`);
  }
  return response.json() as Promise<T>;
}

export function getNotebook(id: string): Promise<Notebook> {
  return fetchJson<Notebook>(`/notebooks/${id}`, { method: "GET" });
}

export function listNotebooks(): Promise<Notebook[]> {
  return fetchJson<Notebook[]>("/notebooks", { method: "GET" });
}

export function createNotebook(data: NewNotebook): Promise<Notebook> {
  return fetchJson<Notebook>("/notebooks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateNotebook(id: string, data: Partial<NewNotebook>): Promise<Notebook> {
  return fetchJson<Notebook>(`/notebooks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteNotebook(id: string): Promise<void> {
  return fetchJson<void>(`/notebooks/${id}`, { method: "DELETE" });
}

export function getCells(notebookId: string): Promise<Cell[]> {
  return fetchJson<Cell[]>(`/notebooks/${notebookId}/cells`, { method: "GET" });
}

export function createCell(data: NewCell): Promise<Cell> {
  return fetchJson<Cell>("/cells", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateCell(id: string, data: Partial<NewCell>): Promise<Cell> {
  return fetchJson<Cell>(`/cells/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCell(id: string): Promise<void> {
  return fetchJson<void>(`/cells/${id}`, { method: "DELETE" });
}
