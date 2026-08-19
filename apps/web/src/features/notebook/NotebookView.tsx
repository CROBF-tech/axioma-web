import { useEffect, useState } from "react"
import { useNotebookStore } from "../../store/notebook.ts"
import type { CellKind } from "@axioma/db"
import { Button } from "../../components/ui/index.ts"
import { updateNotebook } from "@axioma/db"
import CellList from "./CellList.tsx"
import { useNotebookShortcuts } from "./useNotebookShortcuts.ts"
import "./NotebookView.css"

export type NotebookViewProps = {
  notebookId: string
  readOnly?: boolean
}

export default function NotebookView({ notebookId, readOnly = false }: NotebookViewProps) {
  useNotebookShortcuts()
  const store = useNotebookStore()
  const { notebook, cells, loading, error } = store
  const [title, setTitle] = useState("")

  useEffect(() => {
    void store.loadNotebook(notebookId)
  }, [notebookId])

  useEffect(() => {
    if (notebook) setTitle(notebook.title)
  }, [notebook?.title])

  function handleTitleBlur() {
    if (!notebook || readOnly || title === notebook.title) return
    void updateNotebook(notebookId, { title })
  }

  function addCell(kind: CellKind) {
    store.addCell(kind)
  }

  if (loading && !notebook) {
    return <div className="notebook-view__empty">Cargando notebook...</div>
  }

  if (error) {
    return <div className="notebook-view__error">{error}</div>
  }

  if (!notebook) {
    return <div className="notebook-view__empty">Notebook no encontrado.</div>
  }

  return (
    <div className="notebook-view">
      <header className="notebook-view__header">
        <input
          className="notebook-view__title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          readOnly={readOnly}
          aria-label="Título del notebook"
        />
        {!readOnly && (
          <div className="notebook-view__actions">
            <Button size="sm" variant="secondary" onClick={() => addCell("math")}>
              + Celda
            </Button>
            <Button size="sm" variant="secondary" onClick={() => addCell("text")}>
              + Texto
            </Button>
            <Button size="sm" variant="secondary" onClick={() => addCell("plot")}>
              + Gráfico
            </Button>
          </div>
        )}
      </header>
      <CellList readOnly={readOnly} />
      {!readOnly && cells.length > 0 && (
        <div className="notebook-view__footer">
          <Button size="md" variant="primary" onClick={() => addCell("math")}>
            + Añadir celda
          </Button>
        </div>
      )}
    </div>
  )
}
