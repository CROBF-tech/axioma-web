# Task 10-T06 — Resolución de conflictos por `updated_at`

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 3 horas
- **Depende de:** 10-T04

## Contexto

Plan paso 10 línea 17.

## Alcance

- Backend: `PATCH /api/cells/:id` con header `If-Match: <updatedAt>`. Si difiere, 412 Precondition Failed.
- Client: al recibir 412, recargar versión servidor y aplicar merge (last-write-wins por `updated_at`).
- Mostrar toast "Conflicto resuelto: la versión más reciente ganó".

## Entregable

- Resolución end-to-end.

## Criterios de aceptación

- [ ] Editar la misma celda en dos tabs y guardar → el más reciente gana.
- [ ] Sync no pierde datos silenciosamente.
- [ ] Conflictos visibles al usuario.