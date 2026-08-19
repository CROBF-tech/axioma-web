# Task 10-T03 — Repositorio con lectura Dexie-first y write-through

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 3 horas
- **Depende de:** 10-T02

## Contexto

Plan paso 10 línea 33-37. Toda la app usa el repositorio, **no** fetch directo.

## Alcance

- `apps/web/src/data/repository.ts` usa `@axioma/db` para las operaciones de backend (en el navegador estas funciones hacen fetch automáticamente):
  ```ts
  import { getNotebook as apiGetNotebook, updateCell } from '@axioma/db';

  export async function getNotebook(id: string) {
    const cached = await db.notebooks.get(id);
    if (cached && Date.now() - cached.cachedAt < STALE_MS) return cached;
    const fresh = await apiGetNotebook(id);
    await db.notebooks.put({ ...fresh, cachedAt: Date.now() });
    return fresh;
  }

  export async function saveCell(cell: Cell) {
    await db.cells.put(cell);              // optimistic
    await db.syncQueue.add({ entity: 'cell', entityId: cell.id, op: 'update', payload: cell, createdAt: Date.now() });
    triggerSync();
  }
  // La sync real invoca updateCell(cell) de @axioma/db, que en el navegador hace PATCH al backend.
  ```

## Entregable

- API del repositorio.

## Criterios de aceptación

- [ ] Lectura cuando hay cache: <50ms.
- [ ] Lectura cuando no hay: `@axioma/db` fetch + cache.
- [ ] Escritura actualiza cache y encola.