import type { ID } from "./constants.ts";

const REF_RE = /\$\$([A-Za-z0-9_-]+)/g;

export function reorderCells<C extends { id: ID; orderIdx: number }>(
  cells: readonly C[],
  newOrder: ID[],
): C[] {
  const byId = new Map<ID, C>();
  for (const c of cells) byId.set(c.id, c);

  const ordered: C[] = [];
  const seen = new Set<ID>();
  for (const id of newOrder) {
    const c = byId.get(id);
    if (!c || seen.has(id)) continue;
    seen.add(id);
    ordered.push(c);
  }
  for (const c of cells) {
    if (seen.has(c.id)) continue;
    seen.add(c.id);
    ordered.push(c);
  }

  return ordered.map((c, idx) => ({ ...c, orderIdx: idx }));
}

export function parseRefs(
  input: string,
): Array<{ raw: string; cellId: string; start: number; end: number }> {
  const out: Array<{ raw: string; cellId: string; start: number; end: number }> = [];
  REF_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = REF_RE.exec(input)) !== null) {
    const match = m[0];
    const cellId = m[1];
    if (match === undefined || cellId === undefined) continue;
    out.push({
      raw: match,
      cellId,
      start: m.index,
      end: m.index + match.length,
    });
  }
  return out;
}

export function extractRefIds(input: string): ID[] {
  const refs = parseRefs(input);
  const seen = new Set<ID>();
  const out: ID[] = [];
  for (const r of refs) {
    if (seen.has(r.cellId)) continue;
    seen.add(r.cellId);
    out.push(r.cellId);
  }
  return out;
}

export function previousCellIds<C extends { id: ID }>(
  cells: readonly C[],
  currentCellId: ID,
): ID[] {
  const idx = cells.findIndex((c) => c.id === currentCellId);
  if (idx <= 0) return [];
  return cells.slice(0, idx).map((c) => c.id);
}