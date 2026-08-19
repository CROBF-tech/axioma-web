import { create } from "zustand"
import type { Cell, CellKind, Notebook } from "@axioma/db"
import {
  createCell,
  deleteCell,
  getNotebook,
  reorderCells as reorderCellsApi,
  updateCell,
} from "@axioma/db"
import { compute } from "@axioma/engine"
import type { EngineResult } from "@axioma/engine"

const SAVE_DEBOUNCE_MS = 800
const DEFAULT_COMPUTE_KIND = "simplify"

type CellRuntime = {
  running: boolean
  error: string | null
  result: EngineResult | null
}

type CellRuntimeMap = Record<string, CellRuntime>

export type NotebookStore = {
  notebook: Notebook | null
  cells: Cell[]
  loading: boolean
  error: string | null
  activeCellId: string | null
  runtimes: CellRuntimeMap

  loadNotebook(id: string): Promise<void>
  addCell(kind: CellKind): string
  updateCellInput(id: string, input: string): void
  updateCellOutput(id: string, output: string | null): void
  removeCell(id: string): void
  reorderCells(order: string[]): void
  runCell(id: string): Promise<void>
  save(): Promise<void>
  setActiveCell(id: string | null): void
  setRunning(id: string, running: boolean): void
  setOutput(id: string, out: EngineResult | string | null): void
}

const newCellIds = new Set<string>()
const dirtyCellIds = new Set<string>()
const deletedCellIds = new Set<string>()
let reorderDirty = false
let saveTimer: ReturnType<typeof setTimeout> | null = null
let pendingSave: Promise<void> | null = null
let flushResolve: (() => void) | null = null
let flushReject: ((e: unknown) => void) | null = null

function nowDates(): { createdAt: Date; updatedAt: Date } {
  const t = new Date()
  return { createdAt: t, updatedAt: new Date(t.getTime()) }
}

function emptyRuntime(): CellRuntime {
  return { running: false, error: null, result: null }
}

function flushPending(get: () => NotebookStore): Promise<void> {
  const state = get()
  const notebook = state.notebook
  const tasks: Promise<unknown>[] = []

  for (const id of newCellIds) {
    const cell = state.cells.find((c) => c.id === id)
    if (!cell || !notebook) continue
    tasks.push(
      createCell(notebook.id, {
        kind: cell.kind,
        input: cell.input,
        orderIdx: cell.orderIdx,
      }).then((created) => {
        state.cells = state.cells.map((c) =>
          c.id === id ? { ...c, id: created.id, createdAt: created.createdAt, updatedAt: created.updatedAt } : c,
        )
      }),
    )
  }

  for (const id of dirtyCellIds) {
    const cell = state.cells.find((c) => c.id === id)
    if (!cell) continue
    tasks.push(
      updateCell(id, {
        input: cell.input,
        output: cell.output ?? null,
        orderIdx: cell.orderIdx,
      }).then((updated) => {
        state.cells = state.cells.map((c) =>
          c.id === id ? { ...c, updatedAt: updated.updatedAt } : c,
        )
      }),
    )
  }

  for (const id of deletedCellIds) {
    tasks.push(deleteCell(id))
  }

  if (reorderDirty && notebook) {
    tasks.push(reorderCellsApi(notebook.id, { order: state.cells.map((c) => c.id) }))
  }

  return Promise.all(tasks).then(() => {
    newCellIds.clear()
    dirtyCellIds.clear()
    deletedCellIds.clear()
    reorderDirty = false
  })
}

function scheduleSave(get: () => NotebookStore): Promise<void> {
  if (!pendingSave) {
    pendingSave = new Promise<void>((resolve, reject) => {
      flushResolve = resolve
      flushReject = reject
    })
  }
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveTimer = null
    void flushPending(get)
      .then(() => {
        if (flushResolve) flushResolve()
      })
      .catch((e: unknown) => {
        if (flushReject) flushReject(e)
      })
      .finally(() => {
        pendingSave = null
        flushResolve = null
        flushReject = null
      })
  }, SAVE_DEBOUNCE_MS)
  return pendingSave
}

function markDirty(id: string): void {
  if (!newCellIds.has(id)) dirtyCellIds.add(id)
}

export const useNotebookStore = create<NotebookStore>((set, get) => ({
  notebook: null,
  cells: [],
  loading: false,
  error: null,
  activeCellId: null,
  runtimes: {},

  loadNotebook(id) {
    set({ loading: true, error: null })
    newCellIds.clear()
    dirtyCellIds.clear()
    deletedCellIds.clear()
    reorderDirty = false
    return getNotebook(id)
      .then((res) => {
        const runtimes: CellRuntimeMap = {}
        for (const c of res.cells) runtimes[c.id] = emptyRuntime()
        set({
          notebook: res.notebook,
          cells: res.cells,
          runtimes,
          loading: false,
          error: null,
        })
      })
      .catch((e: unknown) => {
        set({ loading: false, error: e instanceof Error ? e.message : "Error al cargar notebook" })
        throw e
      })
  },

  addCell(kind) {
    const id = crypto.randomUUID()
    const { createdAt, updatedAt } = nowDates()
    const notebook = get().notebook
    const cells = get().cells
    const cell: Cell = {
      id,
      notebookId: notebook?.id ?? "",
      orderIdx: cells.length,
      kind,
      input: "",
      output: null,
      references: null,
      createdAt,
      updatedAt,
    }
    newCellIds.add(id)
    set((s) => ({
      cells: [...s.cells, cell],
      runtimes: { ...s.runtimes, [id]: emptyRuntime() },
      activeCellId: id,
    }))
    void scheduleSave(get)
    return id
  },

  updateCellInput(id, input) {
    set((s) => ({
      cells: s.cells.map((c) => (c.id === id ? { ...c, input } : c)),
    }))
    markDirty(id)
    void scheduleSave(get)
  },

  updateCellOutput(id, output) {
    set((s) => ({
      cells: s.cells.map((c) => (c.id === id ? { ...c, output } : c)),
    }))
    markDirty(id)
    void scheduleSave(get)
  },

  removeCell(id) {
    if (newCellIds.has(id)) {
      newCellIds.delete(id)
    } else if (dirtyCellIds.has(id)) {
      dirtyCellIds.delete(id)
      deletedCellIds.add(id)
    } else {
      deletedCellIds.add(id)
    }
    set((s) => {
      const nextRuntimes = { ...s.runtimes }
      delete nextRuntimes[id]
      const nextCells = s.cells
        .filter((c) => c.id !== id)
        .map((c, idx) => ({ ...c, orderIdx: idx }))
      return {
        cells: nextCells,
        runtimes: nextRuntimes,
        activeCellId: s.activeCellId === id ? null : s.activeCellId,
      }
    })
    reorderDirty = true
    void scheduleSave(get)
  },

  reorderCells(order) {
    set((s) => {
      const byId = new Map<string, Cell>()
      for (const c of s.cells) byId.set(c.id, c)
      const ordered: Cell[] = []
      const seen = new Set<string>()
      for (const id of order) {
        const c = byId.get(id)
        if (!c || seen.has(id)) continue
        seen.add(id)
        ordered.push(c)
      }
      for (const c of s.cells) {
        if (seen.has(c.id)) continue
        seen.add(c.id)
        ordered.push(c)
      }
      const reindexed = ordered.map((c, idx) => ({ ...c, orderIdx: idx }))
      return { cells: reindexed }
    })
    reorderDirty = true
    void scheduleSave(get)
  },

  runCell(id) {
    const cell = get().cells.find((c) => c.id === id)
    if (!cell) return Promise.resolve()
    set((s) => ({
      runtimes: {
        ...s.runtimes,
        [id]: { running: true, error: null, result: null },
      },
    }))
    return compute({ kind: DEFAULT_COMPUTE_KIND, expr: cell.input })
      .then((result) => {
        set((s) => ({
          runtimes: {
            ...s.runtimes,
            [id]: { running: false, error: result.ok ? null : (result.error?.message ?? null), result },
          },
          cells: s.cells.map((c) =>
            c.id === id ? { ...c, output: result.latex ?? c.output } : c,
          ),
        }))
        markDirty(id)
        void scheduleSave(get)
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Error al ejecutar celda"
        set((s) => ({
          runtimes: {
            ...s.runtimes,
            [id]: { running: false, error: message, result: null },
          },
        }))
      })
  },

  save() {
    return scheduleSave(get)
  },

  setActiveCell(id) {
    set({ activeCellId: id })
  },

  setRunning(id, running) {
    set((s) => ({
      runtimes: {
        ...s.runtimes,
        [id]: { ...(s.runtimes[id] ?? emptyRuntime()), running },
      },
    }))
  },

  setOutput(id, out) {
    if (typeof out === "string") {
      set((s) => ({
        cells: s.cells.map((c) => (c.id === id ? { ...c, output: out } : c)),
      }))
    } else if (out === null) {
      set((s) => ({
        cells: s.cells.map((c) => (c.id === id ? { ...c, output: null } : c)),
        runtimes: {
          ...s.runtimes,
          [id]: { ...(s.runtimes[id] ?? emptyRuntime()), result: null },
        },
      }))
    } else {
      set((s) => ({
        cells: s.cells.map((c) =>
          c.id === id ? { ...c, output: out.latex ?? c.output } : c,
        ),
        runtimes: {
          ...s.runtimes,
          [id]: { ...(s.runtimes[id] ?? emptyRuntime()), result: out },
        },
      }))
    }
    markDirty(id)
    void scheduleSave(get)
  },
}))