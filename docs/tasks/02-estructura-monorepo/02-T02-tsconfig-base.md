# Task 02-T02 — Crear `tsconfig.base.json` y aliases `@web/@api/@shared`

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** 02-T01

## Contexto

Plan paso 02 línea 48-50: TS base con aliases.

## Alcance

- Crear `tsconfig.base.json` raíz con:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "module": "ESNext",
      "moduleResolution": "bundler",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "resolveJsonModule": true,
      "verbatimModuleSyntax": true
    }
  }
  ```
- Cada sub-proyecto extiende con su `tsconfig.json` y define `paths`:
  - `@web/*` → `apps/web/src/*`
  - `@api/*` → `apps/api/src/*`
  - `@shared/*` → `packages/shared/src/*`

## Entregable

- `tsconfig.base.json` en raíz.
- `tsconfig.json` en cada `apps/*` y `packages/*` que extienda y defina `paths`.

## Criterios de aceptación

- [ ] `bun --filter @axioma/web run typecheck` pasa con un import `@shared/types`.
- [ ] `bun --filter @axioma/api run typecheck` pasa con un import `@shared/types`.
- [ ] `strict: true` activo en ambos.