# Task 08-T03 — Componente `NotebookView` y `CellList`

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 3 horas
- **Depende de:** 08-T02

## Contexto

Plan paso 08 líneas 38-50.

## Alcance

- `<NotebookView notebookId />` carga y monta el store.
- `<CellList />` itera cells y renderiza `<Cell />`.
- `<Cell />` es wrapper polimórfico por `kind`.
- Botón "+ Añadir celda" debajo de la última.
- Botones "▶ Ejecutar" y "⏹ Stop" por celda.

## Entregable

- Componentes + ruta `/notebooks/:id`.

## Criterios de aceptación

- [ ] Navegar a `/notebooks/:id` renderiza todas las cells.
- [ ] Añadir celda la coloca al final con un input vacío.
- [ ] Eliminar celda la quita sin afectar otras.
- [ ] Botón ejecutar dispara `runCell`.