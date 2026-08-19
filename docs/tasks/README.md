# Tasks — Axioma Web

> Cada task es **atómica** (idealmente ≤ 1 día de trabajo), tiene criterio de aceptación verificable y referencia al paso del plan del que proviene.

## Convención

- Archivo: `NN-PNN-descripcion.md` donde `NN` = prefijo del paso (01-12) y `PNN` = número secuencial dentro del paso.
- Cada task incluye: **contexto**, **alcance**, **entregable**, **criterios de aceptación**, **referencia al paso**.

## Índice por paso

### Paso 01 — Validación del motor simbólico
- [01-T01 — Crear `tools/package.json` con deps del motor](./01-validacion-motor-simbolico/01-T01-setup-tools.md)
- [01-T02 — Definir set de ejercicios con esperados](./01-validacion-motor-simbolico/01-T02-set-ejercicios.md)
- [01-T03 — Implementar comparador simbólico y numérico](./01-validacion-motor-simbolico/01-T03-comparador.md)
- [01-T04 — Capturar paso a paso parcial en fallos](./01-validacion-motor-simbolico/01-T04-paso-a-paso.md)
- [01-T05 — Probar fallback con nerdamer si falla ≥2 integrales](./01-validacion-motor-simbolico/01-T05-fallback-nerdamer.md)
- [01-T06 — Generar reporte `RESULTADOS.md` con decisión](./01-validacion-motor-simbolico/01-T06-reporte-resultados.md)

### Paso 02 — Estructura del monorepo
- [02-T01 — Definir workspaces de bun y `package.json` raíz](./02-estructura-monorepo/02-T01-workspaces-bun.md)
- [02-T02 — Crear `tsconfig.base.json` y aliases `@web/@api/@shared`](./02-estructura-monorepo/02-T02-tsconfig-base.md)
- [02-T03 — Configurar Biome (lint + format)](./02-estructura-monorepo/02-T03-biome.md)
- [02-T04 — Scaffold `apps/web` con Vite + React + TS](./02-estructura-monorepo/02-T04-scaffold-web.md)
- [02-T05 — Scaffold `apps/api` con Hono + TS](./02-estructura-monorepo/02-T05-scaffold-api.md)
- [02-T06 — Crear `packages/shared` con tipos base](./02-estructura-monorepo/02-T06-package-shared.md)
- [02-T07 — Definir `.env.example` por app/paquete](./02-estructura-monorepo/02-T07-env-example.md)

### Paso 03 — Diseño e identidad visual
- [03-T01 — Definir variables CSS base (tokens de color)](./03-diseno-sistema-identidad/03-T01-tokens-color.md)
- [03-T02 — Implementar `ThemeProvider` (claro/oscuro + accent)](./03-diseno-sistema-identidad/03-T02-theme-provider.md)
- [03-T03 — Crear `AccentPicker`](./03-diseno-sistema-identidad/03-T03-accent-picker.md)
- [03-T04 — Componentes base (Surface, Button, Input)](./03-diseno-sistema-identidad/03-T04-componentes-base.md)
- [03-T05 — Página `/design` con muestras y verificación AA](./03-diseno-sistema-identidad/03-T05-pagina-diseno.md)

### Paso 04 — Backend Hono base
- [04-T01 — Configurar servidor Hono + Node adapter + listen](./04-backend-hono-base/04-T01-servidor-hono.md)
- [04-T02 — Validación de env con Zod](./04-backend-hono-base/04-T02-env-zod.md)
- [04-T03 — Endpoints `/health` y `/version`](./04-backend-hono-base/04-T03-endpoints-base.md)
- [04-T04 — Middleware de errores + 404 JSON](./04-backend-hono-base/04-T04-middleware-errores.md)
- [04-T05 — CORS y logger request/response](./04-backend-hono-base/04-T05-cors-logger.md)

### Paso 05 — Base de datos Turso + schema
- [05-T01 — Configurar cliente Turso (libSQL) y Drizzle](./05-base-datos-turso-schema/05-T01-cliente-turso.md)
- [05-T02 — Definir schema `notebooks` y `cells`](./05-base-datos-turso-schema/05-T02-schema-notebooks.md)
- [05-T03 — Definir schema `folders` (árbol)](./05-base-datos-turso-schema/05-T03-schema-folders.md)
- [05-T04 — Definir schema `subscriptions`](./05-base-datos-turso-schema/05-T04-schema-subscriptions.md)
- [05-T05 — Migraciones con drizzle-kit + `db:push` / `db:migrate`](./05-base-datos-turso-schema/05-T05-migraciones.md)
- [05-T06 — Seed mínimo (usuario + notebook demo)](./05-base-datos-turso-schema/05-T06-seed.md)
- [05-T07 — Exportar tipos a `packages/shared`](./05-base-datos-turso-schema/05-T07-tipos-compartidos.md)

### Paso 06 — Autenticación better-auth
- [06-T01 — Instalar y configurar `better-auth` con adapter Drizzle](./06-autenticacion-better-auth/06-T01-config-better-auth.md)
- [06-T02 — Mount handler en Hono (`/api/auth/*`)](./06-autenticacion-better-auth/06-T02-mount-hono.md)
- [06-T03 — Cliente web con `createAuthClient` + hooks](./06-autenticacion-better-auth/06-T03-cliente-web.md)
- [06-T04 — Middleware `requireAuth` en backend](./06-autenticacion-better-auth/06-T04-middleware-require-auth.md)
- [06-T05 — Páginas `/login` y `/register`](./06-autenticacion-better-auth/06-T05-paginas-auth.md)
- [06-T06 — Rate limit en sign-in/sign-up](./06-autenticacion-better-auth/06-T06-rate-limit.md)
- [06-T07 — Anti-enumeración de emails en sign-up](./06-autenticacion-better-auth/06-T07-anti-enumeracion.md)

### Paso 07 — Servicio motor simbólico
- [07-T01 — Wrapper ComputeEngine: parse LaTeX → MathJSON](./07-motor-simbolico-servicio/07-T01-wrapper-parse.md)
- [07-T02 — Soporte para derivadas (`D`) y límites (`Limit`)](./07-motor-simbolico-servicio/07-T02-derivadas-limites.md)
- [07-T03 — Soporte para integrales con fallback nerdamer](./07-motor-simbolico-servicio/07-T03-integrales-fallback.md)
- [07-T04 — Extracción de pasos (`steps.ts`)](./07-motor-simbolico-servicio/07-T04-pasos.md)
- [07-T05 — Tipos `EngineResult`, `ComputeInput` y export único `compute()`](./07-motor-simbolico-servicio/07-T05-api-publica.md)
- [07-T06 — Tests de regresión con set del paso 01](./07-motor-simbolico-servicio/07-T06-tests-regresion.md)
- [07-T07 — Lazy-load de nerdamer (code-split)](./07-motor-simbolico-servicio/07-T07-lazy-load.md)

### Paso 08 — Notebook UI celdas
- [08-T01 — Definir contrato REST de notebooks/cells](./08-notebook-ui-celdas/08-T01-contrato-api.md)
- [08-T02 — Store zustand del notebook](./08-notebook-ui-celdas/08-T02-store-zustand.md)
- [08-T03 — Componente `NotebookView` y `CellList`](./08-notebook-ui-celdas/08-T03-notebook-view.md)
- [08-T04 — Wrapper de `mathlive` (`MathInput`)](./08-notebook-ui-celdas/08-T04-math-input.md)
- [08-T05 — Render del resultado con KaTeX + pasos colapsables](./08-notebook-ui-celdas/08-T05-result-render.md)
- [08-T06 — Drag & drop con `@dnd-kit`](./08-notebook-ui-celdas/08-T06-drag-drop.md)
- [08-T07 — Resolución de refs `$$cellId`](./08-notebook-ui-celdas/08-T07-refs-resolver.md)
- [08-T08 — Atajos de teclado (`Ctrl+Enter` ejecutar, flechas navegar)](./08-notebook-ui-celdas/08-T08-atajos-teclado.md)

### Paso 09 — Gráficos function-plot
- [09-T01 — Componente `PlotCell` con contenedor y reinstancia](./09-graficos-function-plot/09-T01-plot-cell.md)
- [09-T02 — Parseo LaTeX → función JS evaluable](./09-graficos-function-plot/09-T02-parse-fn-js.md)
- [09-T03 — Soporte multi-función (`;` separador)](./09-graficos-function-plot/09-T03-multi-fn.md)
- [09-T04 — Zoom, pan y tooltip de coordenadas](./09-graficos-function-plot/09-T04-zoom-pan.md)
- [09-T05 — Color desde accent token (`--accent`)](./09-graficos-function-plot/09-T05-color-accent.md)

### Paso 10 — Caché Dexie + sync
- [10-T01 — Instalar y crear instancia Dexie](./10-cache-dexie-sincronizacion/10-T01-dexie-instance.md)
- [10-T02 — Definir stores (`notebooks`, `cells`, `folders`, `syncQueue`)](./10-cache-dexie-sincronizacion/10-T02-stores.md)
- [10-T03 — Repositorio con lectura Dexie-first y write-through](./10-cache-dexie-sincronizacion/10-T03-repositorio.md)
- [10-T04 — Cola de sincronización con persistencia](./10-cache-dexie-sincronizacion/10-T04-cola-sync.md)
- [10-T05 — Detección online/offline y trigger de sync](./10-cache-dexie-sincronizacion/10-T05-online-offline.md)
- [10-T06 — Resolución de conflictos por `updated_at`](./10-cache-dexie-sincronizacion/10-T06-conflictos.md)
- [10-T07 — Indicador UI "Sin conexión — N cambios pendientes"](./10-cache-dexie-sincronizacion/10-T07-indicador-ui.md)

### Paso 11 — Suscripción Mercado Pago
- [11-T01 — Instalar SDK Mercado Pago y configurar cliente](./11-suscripcion-mercadopago/11-T01-sdk-cliente.md)
- [11-T02 — Definir planes (`monthly`, `annual`) con precios](./11-suscripcion-mercadopago/11-T02-definir-planes.md)
- [11-T03 — Endpoint `POST /billing/checkout` (crear preapproval)](./11-suscripcion-mercadopago/11-T03-endpoint-checkout.md)
- [11-T04 — Webhook `POST /webhooks/mp` con verificación de firma](./11-suscripcion-mercadopago/11-T04-webhook.md)
- [11-T05 — Endpoint `GET /billing/status`](./11-suscripcion-mercadopago/11-T05-status-endpoint.md)
- [11-T06 — Endpoint `POST /billing/cancel`](./11-suscripcion-mercadopago/11-T06-cancel-endpoint.md)
- [11-T07 — Middleware `requireSubscription` y matriz de permisos](./11-suscripcion-mercadopago/11-T07-middleware-subscription.md)
- [11-T08 — Página `/pricing` con dos planes](./11-suscripcion-mercadopago/11-T08-pagina-pricing.md)
- [11-T09 — Hook `useSubscription()` y gating en frontend](./11-suscripcion-mercadopago/11-T09-gating-frontend.md)
- [11-T10 — Fixtures de dev para simular webhook](./11-suscripcion-mercadopago/11-T10-fixtures-dev.md)

### Paso 12 — Pulido, sharing, a11y
- [12-T01 — Vista `/library` con árbol de carpetas y notebooks](./12-pulido-sharing-accesibilidad/12-T01-library-tree.md)
- [12-T02 — CRUD de folders (rename/move/delete)](./12-pulido-sharing-accesibilidad/12-T02-folder-crud.md)
- [12-T03 — Mover notebook entre carpetas](./12-pulido-sharing-accesibilidad/12-T03-move-notebook.md)
- [12-T04 — Toggle "Compartir públicamente" + generar `public_slug`](./12-pulido-sharing-accesibilidad/12-T04-public-toggle.md)
- [12-T05 — Ruta pública `/s/:slug` solo lectura](./12-pulido-sharing-accesibilidad/12-T05-public-route.md)
- [12-T06 — Contraste AA verificado con axe/Lighthouse](./12-pulido-sharing-accesibilidad/12-T06-contraste-aa.md)
- [12-T07 — Navegación por teclado en celdas (flechas, Ctrl+Enter)](./12-pulido-sharing-accesibilidad/12-T07-keyboard-nav.md)
- [12-T08 — Focus visible en todos los interactivos](./12-pulido-sharing-accesibilidad/12-T08-focus-visible.md)
- [12-T09 — Skip links y landmark roles ARIA](./12-pulido-sharing-accesibilidad/12-T09-aria-landmarks.md)
- [12-T10 — Suite E2E Playwright (registro → uso → compartir)](./12-pulido-sharing-accesibilidad/12-T10-e2e-playwright.md)
- [12-T11 — Lighthouse ≥90 perf + a11y](./12-pulido-sharing-accesibilidad/12-T11-lighthouse.md)
- [12-T12 — Página 404 + error genérico + loading/empty states](./12-pulido-sharing-accesibilidad/12-T12-estados-vacios.md)

## Decisiones registradas
Ver [`../plan/INCONSISTENCIAS.md`](../plan/INCONSISTENCIAS.md) para issues abiertos (D1-D8) a resolver antes/durante implementación.