# Task 08-T06 — Drag & drop con `@dnd-kit`

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 3 horas
- **Depende de:** 08-T03

## Contexto

Plan paso 08 línea 42.

## Alcance

- `CellList` con `DndContext` y `SortableContext`.
- Cada `Cell` envuelta en `useSortable`.
- onDragEnd llama `reorder(newIds)`.
- Persistir vía el store.

## Entregable

- Reordenamiento funcional.

## Criterios de aceptación

- [ ] Drag muestra placeholder.
- [ ] Soltar reordena y persiste.
- [ ] `order_idx` se actualiza en backend.