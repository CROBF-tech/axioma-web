# Paso 05 — Base de datos Turso + schema

## Objetivo

Configurar Turso (libSQL), Drizzle ORM, migraciones y el schema completo que soporta el producto.

## Skills usadas

- `turso-db` (instalada, oficial `tursodatabase/agent-skills`).
- `drizzle` (instalada) — ORM principal.

## Configuración

- Crear DB Turso (dev local con `libsql` server o `file:local.db` vía `@libsql/client`).
- El schema y el cliente dual viven en `packages/db`:
  - `packages/db/src/client/index.ts`: inicialización de `@libsql/client` + Drizzle (solo backend).
  - `packages/db/src/index.ts`: entry point que, según entorno, exporta el cliente real o funciones que hacen `fetch` al backend.
  - `packages/db/drizzle.config.ts` para migraciones.
- En el backend se hace:
  ```ts
  import { createDb } from '@axioma/db';
  const { db } = createDb({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
  ```
- En el frontend se importa el mismo paquete, pero usa la API fetch interna:
  ```ts
  import { getNotebook, saveCell } from '@axioma/db';
  ```

> **Seguridad:** las variables `DATABASE_URL` y `DATABASE_AUTH_TOKEN` solo se leen en `apps/api`. El frontend nunca las recibe; su env es `VITE_API_URL`.

## Schema (tablas)

### `users`
Delegado a better-auth (paso 06). Tablas `user`, `session`, `account`, `verification` las crea el adaptador.

### `notebooks`
| col | tipo |
|-----|------|
| id | text PK |
| owner_id | text FK users.id |
| title | text |
| folder_id | text? FK folders.id |
| accent | text? (override) |
| is_public | int (0/1) |
| public_slug | text? unique |
| created_at | int |
| updated_at | int |

### `folders`
| col | tipo |
|-----|------|
| id | text PK |
| owner_id | text FK |
| name | text |
| parent_id | text? (auto-referencia, árbol) |
| created_at | int |

### `cells`
| col | tipo |
|-----|------|
| id | text PK |
| notebook_id | text FK notebooks.id (cascade) |
| order_idx | int |
| kind | text ('math' \| 'text' \| 'plot') |
| input | text (LaTeX / markdown / función) |
| output | text? (resultado serializado) |
| references | text? (JSON array de cell ids referenciadas) |
| created_at | int |
| updated_at | int |

> `order_idx` se gestiona en el frontend (zustand) y se persiste al mover.

### `subscriptions`
| col | tipo |
|-----|------|
| id | text PK |
| user_id | text FK |
| plan | text ('monthly' \| 'annual') |
| status | text ('active' \| 'pending' \| 'cancelled' \| 'expired') |
| mp_preapproval_id | text? |
| current_period_end | int? |
| created_at | int |
| updated_at | int |

### `share_links` (alternativa a `is_public` en notebook)
Se decide: usar campos en `notebooks` (más simple). Tabla separada queda descartada salvo necesidad futura.

## Índices
- `notebooks(owner_id, updated_at)`.
- `cells(notebook_id, order_idx)`.
- `subscriptions(user_id, status)`.

## Entregables

- `packages/db/src/schema.ts` con todas las tablas.
- `packages/db/drizzle.config.ts` y `packages/db/drizzle/migrations/` (generadas por `drizzle-kit`).
- Script `db:push` (dev) y `db:migrate` (prod) en `packages/db`.
- Seed mínimo: 1 usuario + 1 notebook de ejemplo (script en `packages/db/scripts/seed.ts`, ejecutable desde backend).
- API pública de `@axioma/db` usable desde frontend (fetch) y backend (Turso).

## Criterios de aceptación

- [ ] `bun --filter @axioma/db db:push` crea el schema en Turso dev.
- [ ] Query desde `apps/api` usando `@axioma/db` retorna datos de prueba.
- [ ] Llaves foráneas con `ON DELETE CASCADE` en `cells`.
- [ ] Tipos compartidos exportados a `packages/shared`.
- [ ] Importar `@axioma/db` en `apps/web` no expone `DATABASE_URL`/`DATABASE_AUTH_TOKEN` ni `@libsql/client`.
- [ ] `packages/db/src/index.ts` tiene rama browser con funciones `fetch` a `VITE_API_URL`.