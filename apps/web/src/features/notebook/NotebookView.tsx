import { useEffect, useState } from "react"
import { useNotebookStore } from "../../store/notebook.ts"
import type { CellKind } from "@axioma/db"
import { Button } from "../../components/ui/index.ts"
import { EmptyState } from "../../components/ui/EmptyState.tsx"
import { updateNotebook } from "@axioma/db"
import CellList from "./CellList.tsx"
import { useNotebookShortcuts } from "./useNotebookShortcuts.ts"
import NotebookSkeleton from "./NotebookSkeleton.tsx"
import SharePanel from "./SharePanel.tsx"
import "./NotebookView.css"

function useNotebookView(notebookId: string, readOnly: boolean) {
  const store = useNotebookStore()
  useEffect(() => {
    if (!readOnly) {
      void store.loadNotebook(notebookId)
    }
  }, [notebookId, readOnly, store])
  return store
}

export type NotebookViewProps = {
  notebookId: string
  readOnly?: boolean
}

export default function NotebookView({ notebookId, readOnly = false }: NotebookViewProps) {
  if (!readOnly) useNotebookShortcuts()
  const store = useNotebookView(notebookId, readOnly)
  const { notebook, cells, loading, error } = store
  const [title, setTitle] = useState("")

  useEffect(() => {
    if (notebook) setTitle(notebook.title)
  }, [notebook?.title])

  function handleTitleBlur() {
    if (!notebook || readOnly || title === notebook.title) return
    void updateNotebook(notebookId, { title })
  }

  function addCell(kind: CellKind) {
    if (readOnly) return
    store.addCell(kind)
  }

  if (loading && !notebook) {
    return <NotebookSkeleton />
  }

  if (error) {
    return (
      <EmptyState
        icon="⚠️"
        title="No se pudo cargar el notebook"
        message={error || "Ocurrió un error inesperado. Intentá de nuevo."}
      />
    )
  }

  if (!notebook) {
    return (
      <EmptyState
        icon="🔭"
        title="Notebook no encontrado"
        message="Puede haber sido eliminado o el enlace ser incorrecto."
      />
    )
  }

  return (
    <main className="notebook-view" role="main" id="main-content" tabIndex={-1}>
      <header className="notebook-view__header">
        <input
          className="notebook-view__title"
          value={title}
          onChange={(e) => readOnly ? undefined : setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          readOnly={readOnly}
          aria-label="Título del notebook"
        />
        {!readOnly && (
          <div className="notebook-view__actions">
            <Button size="sm" variant="secondary" onClick={() => addCell("math")} aria-label="Añadir celda matemática">
              + Celda
            </Button>
            <Button size="sm" variant="secondary" onClick={() => addCell("text")} aria-label="Añadir celda de texto">
              + Texto
            </Button>
            <Button size="sm" variant="secondary" onClick={() => addCell("plot")} aria-label="Añadir celda de gráfico">
              + Gráfico
            </Button>
          </div>
        )}
      </header>
      <CellList readOnly={readOnly} />
      {!readOnly && cells.length > 0 && (
        <div className="notebook-view__footer">
          <Button size="md" variant="primary" onClick={() => addCell("math")} aria-label="Añadir celda matemática">
            + Añadir celda
          </Button>
        </div>
      )}
      {!readOnly && notebook && (
        <SharePanel
          notebookId={notebook.id}
          initialPublic={notebook.isPublic}
          initialSlug={notebook.publicSlug}
        />
      )}
    </main>
  )
}
