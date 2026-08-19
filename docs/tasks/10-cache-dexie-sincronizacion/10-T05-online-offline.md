# Task 10-T05 — Detección online/offline y trigger de sync

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 1 hora
- **Depende de:** 10-T04

## Contexto

Plan paso 10 líneas 40-43.

## Alcance

- `useOnlineStatus()` hook: `window.online`/`offline` events + `navigator.onLine`.
- `useSyncTrigger()`: llama a `processSyncQueue()` al pasar de offline a online.
- Llamada inicial al cargar la app.

## Entregable

- Hook + sync boot.

## Criterios de aceptación

- [ ] Al volver online, la cola se vacía automáticamente.
- [ ] Si no hay queue al volver online, no pasa nada (no error).
- [ ] Sync no se dispara si está online y la cola está vacía.