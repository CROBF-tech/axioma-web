import { CACHE_STALE_MS_DEFAULT } from "./constants.ts";

export function mergeByUpdatedAt<T extends { updatedAt: number | Date }>(local: T, remote: T): T {
  return isServerNewer(local, remote) ? remote : local;
}

export function isServerNewer<T extends { updatedAt: number | Date }>(local: T, remote: T): boolean {
  const lt = local.updatedAt instanceof Date ? local.updatedAt.getTime() : local.updatedAt;
  const rt = remote.updatedAt instanceof Date ? remote.updatedAt.getTime() : remote.updatedAt;
  return rt > lt;
}

export function isCacheFresh(
  cachedAt: number,
  now: number = Date.now(),
  staleMs: number = CACHE_STALE_MS_DEFAULT,
): boolean {
  return now - cachedAt < staleMs;
}

export function classifySyncFailure(status: number): "ok" | "conflict" | "retry" | "fatal" {
  if (status >= 200 && status < 300) return "ok";
  if (status === 409 || status === 412) return "conflict";
  if (status === 401 || status === 403 || status === 404) return "fatal";
  if (status >= 500) return "retry";
  return "fatal";
}