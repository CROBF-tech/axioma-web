# Task 05-T01 — Configurar paquete `@axioma/db` con cliente dual (Turso backend / fetch frontend)

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 2 horas
- **Depende de:** 02-T06, 04-T02

## Contexto

Plan paso 02 (monorepo) y paso 05 (DB). El paquete `@axioma/db` vive en `packages/db` y es importado tanto por `apps/api` como por `apps/web`. Internamente detecta el entorno de ejecución: en Node usa `@libsql/client` + Drizzle; en el navegador expone funciones que hacen `fetch` al backend. Esto evita que las variables de Turso lleguen al frontend, mientras ambas apps comparten el mismo contrato de datos y schema.

## Alcance

- `packages/db/package.json` ya existe. Asegurar:
  - `dependencies`: `drizzle-orm`, `@libsql/client`.
  - `exports`: `.` (runtime dual), `./schema` (types + schema). Nada más expone el driver directamente desde el punto de entrada público.
- `packages/db/src/env.ts` (type-safe, entorno dual):
  ```ts
  // En backend: lee process.env.DATABASE_URL / DATABASE_AUTH_TOKEN.
  // En frontend: lee import.meta.env.VITE_API_URL (no toca Turso).
  ```
- `packages/db/src/client/index.ts`:
  - Exporta `createDb({ url, authToken })` que retorna `{ db, client }` usando `@libsql/client`.
  - Exporta `isBrowser: boolean` / `isServer: boolean` helpers.
- `packages/db/src/index.ts` (entry point):
  - En servidor: re-exporta `createDb`, `schema`, y tipos.
  - En navegador: exporta funciones asíncronas (`getNotebook`, `listNotebooks`, `saveCell`, etc.) que hacen `fetch` a `VITE_API_URL`.
  - No importa `@libsql/client` en el bundle de frontend (el bundler debe tree-shake la rama server).

## Entregable

- `packages/db/src/index.ts` con split por entorno.
- `packages/db/src/client/index.ts` con inicialización de Turso.
- `packages/db/src/env.ts` que lea las variables correctas según `typeof window` / `process`.
- Script de verificación `packages/db/scripts/ping.ts` que conecte e imprima `"ok"`.

## Criterios de aceptación

- [ ] `bun --filter @axioma/db typecheck` pasa sin errores.
- [ ] `bun --filter @axioma/db db:ping` conecta a Turso dev/local y retorna `"ok"`.
- [ ] Importar `@axioma/db` desde `apps/web` no arrastra `@libsql/client` al bundle (verificar con `vite-bundle-visualizer` o inspección de `dist/assets`).
- [ ] Importar `@axioma/db` desde `apps/api` expone `createDb` y permite queries reales.
- [ ] `DATABASE_URL`/`DATABASE_AUTH_TOKEN` solo se leen en el backend; `VITE_API_URL` solo en el frontend.
