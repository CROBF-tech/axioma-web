# Task 02-T03 — Configurar Biome (lint + format)

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T01

## Contexto

Plan paso 02 línea 49: recomendación Biome (unificado, rápido). Reemplaza ESLint+Prettier.

## Alcance

- `bun add -D -w @biomejs/biome`.
- Crear `biome.json` raíz con:
  - Indent 2 espacios, lineWidth 100.
  - Reglas: `recommended` + `recommendedTypeChecked` (ligero).
  - Imports: organizar (`organizeImports: true`).
- Script `lint`: `biome check .`.
- Script `format`: `biome format --write .`.

## Entregable

- `biome.json` raíz.
- Scripts en `package.json` raíz.

## Criterios de aceptación

- [ ] `bun run lint` ejecuta y reporta 0 errores en código inicial vacío.
- [ ] `bun run format` formatea todo sin diff espurios.
- [ ] Biome detecta imports no usados en un test ad-hoc.