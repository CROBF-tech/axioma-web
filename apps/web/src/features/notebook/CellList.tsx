import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useNotebookStore } from "../../store/notebook.ts"
import { EmptyState } from "../../components/ui/index.ts"
import Cell from "./Cell.tsx"
import "./CellList.css"

export type CellListProps = {
  readOnly?: boolean
}

export default function CellList({ readOnly = false }: CellListProps) {
  const cells = useNotebookStore((s) => s.cells)
  const activeCellId = useNotebookStore((s) => s.activeCellId)
  const setActiveCell = useNotebookStore((s) => s.setActiveCell)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  })
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  })
  const sensors = useSensors(pointerSensor, touchSensor)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = cells.findIndex((c) => c.id === active.id)
    const newIndex = cells.findIndex((c) => c.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const newOrder = arrayMove(cells.map((c) => c.id), oldIndex, newIndex)
    useNotebookStore.getState().reorderCells(newOrder)
  }

  if (cells.length === 0) {
    return (
      <EmptyState
        icon="🧮"
        title="Notebook vacío"
        message="Añadí una celda para empezar a calcular o escribir."
      />
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cells.map((c) => c.id)} strategy={verticalListSortingStrategy}>
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
      </SortableContext>
    </DndContext>
  )
}
