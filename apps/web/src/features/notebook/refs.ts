import type { Cell } from "@axioma/db"

const REF_RE = /\$\$([A-Za-z0-9_-]+)/g
const REF_STUB_RE = /\$\$[a-zA-Z0-9\-]*$/

export function parseRefs(input: string): string[] {
  const ids: string[] = []
  const seen = new Set<string>()
  REF_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = REF_RE.exec(input)) !== null) {
    const id = m[1]
    if (id === undefined) continue
    if (seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

export function matchRefStub(input: string): string | null {
  const match = REF_STUB_RE.exec(input)
  return match ? match[0] : null
}

export function resolveRefs(
  input: string,
  cells: Cell[],
  byId?: Map<string, Cell>,
): string {
  const map = byId ?? buildById(cells)
  return input.replace(REF_RE, (raw, id: string) => {
    const cell = map.get(id)
    if (!cell) return raw
    const latex = cell.output ?? cell.input
    return `(${latex})`
  })
}

export function validateRefs(
  input: string,
  cells: Cell[],
  currentId: string,
): { ok: boolean; missing: string[]; cyclic?: boolean } {
  const byId = buildById(cells)
  const ids = parseRefs(input)
  const missing: string[] = []
  const cyclic = ids.some((id) => hasRefTo(id, currentId, byId, new Set<string>()))

  for (const id of ids) {
    if (!byId.has(id)) missing.push(id)
  }

  return { ok: missing.length === 0 && !cyclic, missing, cyclic }
}

function buildById(cells: Cell[]): Map<string, Cell> {
  const byId = new Map<string, Cell>()
  for (const c of cells) byId.set(c.id, c)
  return byId
}

function hasRefTo(
  startId: string,
  targetId: string,
  byId: Map<string, Cell>,
  visited: Set<string>,
): boolean {
  if (startId === targetId) return true
  if (visited.has(startId)) return false
  visited.add(startId)
  const cell = byId.get(startId)
  if (!cell || !cell.references || cell.references.length === 0) return false
  return cell.references.some((id) => hasRefTo(id, targetId, byId, visited))
}
