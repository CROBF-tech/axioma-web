>>> Axioma Web

## Monorepo con pnpm workspaces

```
.
├── apps/
│   ├── web/          # Vite + React + TypeScript
│   └── api/          # Hono + Node server + TypeScript
├── packages/
│   ├── db/           # Drizzle ORM + Turso/libSQL schema + cliente
│   └── shared/       # Tipos compartidos entre web y api
├── package.json      # workspace root
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

## Requisitos

- Node.js >= 20.19
- pnpm >= 10.30.3 (se fuerza vía `packageManager`)

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
# Backend (Hono) en http://localhost:3000
pnpm dev:api

# Frontend (Vite + React) en http://localhost:5173
pnpm dev:web
```

## Otros comandos

```bash
pnpm typecheck              # typecheck de todo el workspace
pnpm test                   # tests de db + api
pnpm build                  # build de web + typecheck
pnpm db:generate            # generar migraciones Drizzle
pnpm db:push                # push del schema a Turso/local
pnpm db:migrate             # correr migraciones en producción
```

## Variables de entorno

Copiar `.env.example` a `.env` en la raíz:

```bash
cp .env.example .env
```

Editar al menos:
- `DATABASE_URL` y `DATABASE_AUTH_TOKEN` (Turso)
- `BETTER_AUTH_SECRET` (>= 32 caracteres)
- `BETTER_AUTH_URL`
- `CORS_ORIGIN` (default http://localhost:5173)
