import { useNotebookStore } from "../../store/notebook.ts"
import Cell from "./Cell.tsx"
import "./CellList.css"

export type CellListProps = {
  readOnly?: boolean
}

export default function CellList({ readOnly = false }: CellListProps) {
  const cells = useNotebookStore((s) => s.cells)
  const activeCellId = useNotebookStore((s) => s.activeCellId)
  const setActiveCell = useNotebookStore((s) => s.setActiveCell)

  if (cells.length === 0) {
    return (
      <div className="cell-list__empty">
        <p>Este notebook está vacío. Añade una celda para empezar.</p>
      </div>
    )
  }

  return (
    <div className="cell-list">
      {cells.map((cell) => (
        <Cell
          key={cell.id}
          cell={cell}
          active={cell.id === activeCellId}
          readOnly={readOnly}
          onActivate={() => setActiveCell(cell.id)}
        />
      ))}
    </div>
  )
}
