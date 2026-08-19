# Task 02-T07 — Definir `.env.example` por app/paquete

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 15 min
- **Depende de:** nada

## Contexto

Plan paso 02 líneas 63-80.

## Alcance

- **No** crear `.env` ni `.env.example` en la raíz del monorepo.
- Crear archivos `.env.example` individuales en:
  - `apps/api/.env.example`
  - `apps/web/.env.example`
  - `packages/db/.env.example`
  - `packages/shared/.env.example`
- Variables a incluir:
  - **apps/api**: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `TEST_DATABASE_URL`, `TEST_DATABASE_AUTH_TOKEN`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `PORT`, `NODE_ENV`, `CORS_ORIGIN`.
  - **apps/web**: `VITE_API_URL`.
  - **packages/db**: `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `TEST_DATABASE_URL`, `TEST_DATABASE_AUTH_TOKEN`.
  - **packages/shared**: vacío o placeholder si no aplica.
- Asegurar `.gitignore` ignore `.env` y `.env.*` excepto `!.env.example`.
- Documentar que cada app/paquete lee variables solo de su entorno (Vite usa `import.meta.env`, Node usa `process.env`).

## Entregable

- `.env.example` en `apps/api`, `apps/web`, `packages/db`, `packages/shared`.
- `.gitignore` actualizado.

## Criterios de aceptación

- [ ] No existe `.env.example` en la raíz.
- [ ] Cada `.env.example` está commiteado.
- [ ] Las variables de Turso no aparecen en el build del frontend (`import.meta.env` no las expone).
- [ ] `.env` no está commiteado.
- [ ] Cada app/paquete lee sus vars usando el loader correspondiente.
