# Task 01-T01 — Crear `tools/package.json` con deps del motor

- **Paso:** 01 — Validación del motor simbólico
- **Tiempo estimado:** 30 min
- **Depende de:** nada

## Contexto

Plan paso 01 línea 20-23: instalar `@cortex-js/compute-engine` y `nerdamer` dentro de `tools/`. Necesitamos un `package.json` independiente para no contaminar el monorepo principal.

## Alcance

- Crear `tools/package.json` con `type: module` y dos deps.
- Configurar script `validate` que ejecute `node --experimental-strip-types validate-engine.ts` o equivalente.
- Decisión: ejecutar con Node 22 + `tsx` o con Deno. Recomendado **tsx** (más cercano al stack del proyecto).

## Entregable

- `tools/package.json` con deps y scripts.
- `tools/pnpm-workspace.yaml` o equivalente para aislar `tools/` del workspace raíz (si aplica).

## Criterios de aceptación

- [ ] `cd tools && pnpm install && pnpm validate` se ejecuta sin error (incluso si solo imprime "init").
- [ ] `package.json` declara `@cortex-js/compute-engine` y `nerdamer` en dependencies.
- [ ] No hay conflicto con `apps/*` al estar en workspace aislado.