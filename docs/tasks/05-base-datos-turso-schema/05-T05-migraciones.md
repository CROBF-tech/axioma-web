# Task 05-T05 — Migraciones con drizzle-kit + `db:push` / `db:migrate`

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T04

## Contexto

Plan paso 05 líneas 88-89.

## Alcance

- `packages/db/drizzle.config.ts` con `schema`, `out: './drizzle'`, `dialect: 'sqlite'`.
- Scripts en `packages/db/package.json`:
  ```
  db:push: drizzle-kit push
  db:generate: drizzle-kit generate
  db:migrate: drizzle-kit migrate
  ```
- Commitear carpeta `drizzle/*.sql` a git.

## Entregable

- Config + scripts + primera migración generada.

## Criterios de aceptación

- [ ] `bun --filter @axioma/db db:push` crea las tablas en Turso dev.
- [ ] `bun --filter @axioma/db db:generate` produce SQL commit-able.
- [ ] Aplicar migraciones desde SQL en una DB vacía reproduce el schema.