# Task 10-T04 — Cola de sincronización con persistencia

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 3 horas
- **Depende de:** 10-T03

## Contexto

Plan paso 10 línea 36, 47. La cola vive en IndexedDB.

## Alcance

- `apps/web/src/data/sync.ts`:
  - `processSyncQueue()` itera cola en orden.
  - Por cada item: `api.patch(...)` o `api.post(...)` con el payload.
  - Si éxito: borrar de cola.
  - Si falla (5xx, network): dejar en cola, reintentar.
  - Si 4xx (conflicto): marcar con flag `conflict`.

## Entregable

- Sync processor.

## Criterios de aceptación

- [ ] Cola vacía tras sync exitoso.
- [ ] Fallo de red no borra el item.
- [ ] Conflictos se identifican y quedan visibles al usuario.