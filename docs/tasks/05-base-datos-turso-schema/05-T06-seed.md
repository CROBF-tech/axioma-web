# Task 05-T06 — Seed mínimo (usuario + notebook demo)

- **Paso:** 05 — Base de datos Turso + schema
- **Tiempo estimado:** 1 hora
- **Depende de:** 05-T05

## Contexto

Plan paso 05 línea 90.

## Alcance

- Script `packages/db/scripts/seed.ts` que crea:
  - 1 folder raíz.
  - 1 notebook con 3 celdas (math/text/plot).
  - 1 suscripción de prueba en `active`.
- Idempotente: si existe, no duplica.

## Entregable

- `scripts/seed.ts` ejecutable con `bun --filter @axioma/db db:seed`.

## Criterios de aceptación

- [ ] Correr el seed 2 veces no duplica registros.
- [ ] Query posterior encuentra 1 notebook + 3 cells.
- [ ] Output confirma IDs creados.