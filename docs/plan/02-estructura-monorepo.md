# Paso 02 — Estructura del monorepo

## Objetivo

Definir el workspace, tooling base y convenciones. Frontend y backend viven separados pero comparten tipos.

## Layout propuesto

```
axioma/
├── apps/
│   ├── web/                  # Frontend React (Vite, sin boilerplate)
│   │   ├── src/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── package.json
│   └── api/                  # Backend Hono
│       ├── src/
│       │   ├── index.ts      # entrada
│       │   ├── routes/
│       │   ├── auth/
│       │   ├── db/
│       │       ├── schema.ts
│       │       └── client.ts
│       │   ├── services/
│       │       └── env.ts
│       └── package.json
├── packages/
│   ├── shared/               # tipos compartidos (Notebook, Cell, etc.)
│   │   ├── src/
│   │   └── package.json
│   └── db/                   # paquete dual: Turso en backend, fetch en frontend
│       ├── src/
│       │   ├── client/       # cliente libSQL + Drizzle (server only)
│       │   ├── schema/
│       │   ├── env.ts
│       │   └── index.ts    # split runtime según entorno
│       ├── drizzle.config.ts
│       └── package.json
├── tools/
│   └── validate-engine.ts   # del paso 01
├── plan/
├── producto.md
├── package.json              # workspace root (bun)
├── tsconfig.base.json
├── biome.json | eslint+prettier  # decidir
├── apps/api/.env.example
├── apps/web/.env.example
├── packages/db/.env.example
└── packages/shared/.env.example
```

> La raíz ya tiene `bun.lock`; se mantiene **bun** como gestor.

## Decisiones de tooling

- **Bundler frontend:** Vite (recomendado instalar skill `antfu/skills@vite`).
- **Bundler backend:** `tsx` para dev, `tsup` o bundle Hono para prod (definir en paso 04).
- **TS config:** `tsconfig.base.json` con `strict: true`, `moduleResolution: bundler`.
- **Lint/format:** Biome (unificado, rápido) o ESLint+Prettier. Recomendado **Biome** por simplicidad.
- **Path aliases:** `@web/*`, `@api/*`, `@shared/*`.

## Variables de entorno

Cada app/paquete tiene su propio `.env.example` (sin secretos reales). No hay `.env` en la raíz para evitar confusiones. El backend recibe credenciales de Turso; el frontend solo la URL pública de la API.

**apps/api/.env.example**
```
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
TEST_DATABASE_URL=libsql://...-test
TEST_DATABASE_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3001
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**apps/web/.env.example**
```
VITE_API_URL=http://localhost:3001
```

**packages/db/.env.example**
```
DATABASE_URL=libsql://...
DATABASE_AUTH_TOKEN=...
TEST_DATABASE_URL=libsql://...-test
TEST_DATABASE_AUTH_TOKEN=...
```

> **Nota de seguridad:** las variables `DATABASE_URL`, `DATABASE_AUTH_TOKEN`, `TEST_DATABASE_URL` y `TEST_DATABASE_AUTH_TOKEN` nunca se usan en `apps/web`. El paquete `@axioma/db` detecta el entorno y, en el navegador, hace `fetch` a `VITE_API_URL` en lugar de inicializar `@libsql/client`.

## Entregables

- `apps/web/` y `apps/api/` inicializados (`package.json` mínimos).
- `packages/shared/` con tipo `Notebook` y `Cell` esqueleto.
- `packages/db/` con esqueleto del paquete dual (schema, env dual, entry `index.ts`).
- `tsconfig.base.json`, biome config, `pnpm-workspace.yaml` o `workspaces` en root `package.json`.
- `.env.example` por app/paquete (`apps/api`, `apps/web`, `packages/db`, `packages/shared`).
- `apps/web` levanta "Hello Axioma" en `localhost:5173`.
- `apps/api` responde `/health` en `localhost:3001`.

## Criterios de aceptación

- [ ] `bun install` desde raíz instala todo.
- [ ] `bun --filter @axioma/web dev` levanta Vite.
- [ ] `bun --filter @axioma/api dev` levanta Hono con `/health`.
- [ ] `bun run lint` pasa sin errores.
- [ ] Import de `@shared/*` y `@axioma/db` funciona desde ambas apps.
- [ ] Importar `@axioma/db` en `apps/web` no fuerza la resolución de `DATABASE_URL` ni `@libsql/client`.

## Skills recomendadas a instalar

- `antfu/skills@vite` (33K installs, oficial del mantenedor de Vite).
