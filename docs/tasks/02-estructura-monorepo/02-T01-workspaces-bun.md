# Task 02-T01 — Definir workspaces de bun y `package.json` raíz

- **Paso:** 02 — Estructura del monorepo
- **Tiempo estimado:** 1 hora
- **Depende de:** nada
- **Bloquea:** 02-T04, 02-T05

## Contexto

Plan paso 02 línea 42: "se mantiene bun como gestor". Definir el workspace en `package.json` raíz.

## Alcance

- Agregar a `package.json` raíz:
  ```json
  {
    "workspaces": ["apps/*", "packages/*"],
    "scripts": {
      "dev": "bun --filter '*' dev",
      "lint": "biome check .",
      "build": "bun --filter '*' build"
    }
  }
  ```
- Verificar versión de bun (`bun --version` ≥ 0.6).
- Probar `bun install` desde raíz.

## Entregable

- `package.json` raíz actualizado.
- `bun install` ejecuta sin error.

## Criterios de aceptación

- [ ] `bun install` desde raíz instala deps de todos los workspaces.
- [ ] `bun --filter '*' <script>` recorre cada workspace.
- [ ] Hook postinstall si hace falta (preparar DB, etc.).
- [ ] `.gitignore` ignora `node_modules` por workspace.