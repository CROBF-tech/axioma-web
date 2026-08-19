# Task 12-T02 — CRUD de folders (rename/move/delete)

- **Paso:** 12 — Pulido, sharing, a11y
- **Tiempo estimado:** 3 horas
- **Depende de:** 12-T01

## Contexto

Plan paso 12 línea 10.

## Alcance

- Endpoints: `POST /api/folders`, `PATCH /api/folders/:id`, `DELETE /api/folders/:id`.
- Frontend: menú contextual en cada folder (right-click o kebab).

## Entregable

- CRUD completo.

## Criterios de aceptación

- [ ] Crear folder nuevo aparece en árbol.
- [ ] Renombrar actualiza sin recargar.
- [ ] Borrar pide confirmación; notebooks huérfanos se mueven a raíz.
- [ ] Mover folder a otro parent actualiza `parentId`.