import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Cell as CellType } from "@axioma/db"
import { useNotebookStore } from "../../store/notebook.ts"
import { Button } from "../../components/ui/index.ts"
import PlotCell from "./PlotCell.tsx"
import "./Cell.css"

export type CellProps = {
  cell: CellType
  active: boolean
  readOnly?: boolean
  onActivate: () => void
}

export default function Cell({ cell, active, readOnly = false, onActivate }: CellProps) {
  const store = useNotebookStore()
  const runtime = store.runtimes[cell.id]
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cell.id, disabled: readOnly })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleInputChange(value: string) {
    store.updateCellInput(cell.id, value)
  }

  function handleRun() {
    void store.runCell(cell.id)
  }

  function handleRemove() {
    if (readOnly) return
    store.removeCell(cell.id)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault()
      if (cell.kind === "math") void handleRun()
    }
  }

  return (
    <article
      ref={setNodeRef}
      className={["cell", active ? "cell--active" : "", isDragging ? "cell--dragging" : ""].filter(Boolean).join(" ")}
      style={style}
      data-cell-id={cell.id}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Celda ${cell.kind}`}
    >
      <div className="cell__toolbar">
        {!readOnly && (
          <span className="cell__drag-handle" {...attributes} {...listeners} aria-label="Reordenar celda" role="button" tabIndex={0}>
            ⋮⋮
          </span>
        )}
        {readOnly && <span className="cell__kind">{cell.kind}</span>}
        {!readOnly && (
          <div className="cell__actions">
            <span className="cell__kind">{cell.kind}</span>
            {cell.kind === "math" && (
              <Button size="sm" variant="primary" onClick={handleRun} disabled={runtime?.running}>
                {runtime?.running ? "Ejecutando..." : "▶ Ejecutar"}
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleRemove}>
              ×
            </Button>
          </div>
        )}
      </div>

      {cell.kind === "math" && (
        <div className="cell__body">
          <textarea
            className="cell__input"
            value={cell.input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            readOnly={readOnly || runtime?.running}
            placeholder="Escribe una expresión matemática..."
            rows={3}
          />
          {cell.output && (
            <div className="cell__output">
              <code>{cell.output}</code>
            </div>
          )}
        </div>
      )}

      {cell.kind === "text" && (
        <textarea
          className="cell__input cell__input--text"
          value={cell.input}
          onChange={(e) => handleInputChange(e.target.value)}
          readOnly={readOnly}
          placeholder="Escribe texto..."
          rows={4}
        />
      )}

      {cell.kind === "plot" && (
        <div className="cell__body">
          <input
            className="cell__input"
            type="text"
            value={cell.input}
            onChange={(e) => handleInputChange(e.target.value)}
            readOnly={readOnly}
            placeholder="f(x)=x^2"
          />
          <PlotCell cell={cell} readOnly={readOnly} />
        </div>
      )}

      {runtime?.error && (
        <div className="cell__error">
          <span>{runtime.error}</span>
        </div>
      )}

      {runtime?.result && runtime.result.ok && (
        <div className="cell__result">
          <code>{runtime.result.latex}</code>
        </div>
      )}
    </article>
  )
}
