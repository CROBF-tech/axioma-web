# Task 08-T08 — Atajos de teclado (`Ctrl+Enter` ejecutar, flechas navegar)

- **Paso:** 08 — Notebook UI celdas
- **Tiempo estimado:** 1 hora
- **Depende de:** 08-T03

## Contexto

Plan paso 12 línea 22 (se adelanta aquí para consistencia de UX).

## Alcance

- Listener global en `NotebookView`:
  - `Ctrl/Cmd+Enter` → ejecuta celda enfocada.
  - `ArrowDown` desde input → enfoca siguiente celda.
  - `ArrowUp` → anterior.
  - `Esc` → blur input.
- Indicador visual en hover.

## Entregable

- Hook `useNotebookShortcuts()`.

## Criterios de aceptación

- [ ] `Ctrl+Enter` ejecuta sin tocar el mouse.
- [ ] Flechas navegan entre celdas.
- [ ] Atajos no interfieren con edición de mathlive.