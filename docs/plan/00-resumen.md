# Plan de Implementación — Axioma Web

> Spec fuente: `../producto.md`
> Documentación completa de Axioma: [`../README.md`](../README.md)
> Objetivo: alternativa liviana y accesible a Wolfram Mathematica para estudiantes universitarios. Cálculo simbólico + gráficos + notebooks, bajo suscripción (Mercado Pago), sin capa gratuita.

## Cómo leer este plan

Los pasos están numerados de `01` a `12`. Cada archivo explica **qué**, **por qué**, **cómo**, **entregables** y **criterios de aceptación**. El orden está pensado para minimizar riesgo: primero se valida el motor simbólico (riesgo técnico principal declarado en la spec), luego se construye infraestructura, luego UI, luego pagos y por último pulido.

## Stack confirmado

| Capa | Tecnología | Skills instaladas |
|------|------------|-------------------|
| Frontend | React (Vite, sin boilerplate) | `antfu/skills@vite` (recomendada para instalar) |
| Estado | zustand | (docs Context7) |
| Input math | mathlive | (docs Context7) |
| Render math | katex | |
| Motor simbólico | @cortex-js/compute-engine (+ fallback Nerdamer para integrales) | docs Context7 |
| Gráficos 2D | function-plot | |
| Caché local | dexie | `devfirexyz/skills@dexiejs` |
| Backend | Hono | `yusukebe/skills@hono` (oficial) |
| Auth | better-auth (email+password) | `better-auth/skills@better-auth-best-practices`, `email-and-password-best-practices` |
| DB | Turso (libSQL) | `tursodatabase/agent-skills@turso-db` (oficial) |
| Pagos | Mercado Pago | `membranedev/application-skills@mercado-pago` |
| Otros | shadcn/ui, tailwind v4 (ya instalados) | `shadcn`, `tailwind-v4-shadcn`, `frontend-design`, `drizzle`, `nodejs-backend-patterns` |

## Orden de pasos

1. `01-validacion-motor-simbolico.md` — **PRIMERO**. Mitiga el riesgo técnico principal.
2. `02-estructura-monorepo.md` — Workspace, tooling, TS, lint, formato.
3. `03-diseno-sistema-identidad.md` — Tokens de diseño, alto contraste, accent configurable.
4. `04-backend-hono-base.md` — Servidor Hono, estructura, env, logging.
5. `05-base-datos-turso-schema.md` — Drizzle + Turso, migraciones, schema.
6. `06-autenticacion-better-auth.md` — Email/password, sesiones, middleware.
7. `07-motor-simbolico-servicio.md` — Wrapper sobre compute-engine + fallback.
8. `08-notebook-ui-celdas.md` — UI de celdas, zustand, mathlive, katex.
9. `09-graficos-function-plot.md` — Plot 2D con zoom/pan y multi-función.
10. `10-caché-dexie-sincronizacion.md` — Offline-first con sincronización.
11. `11-suscripcion-mercadopago.md` — Plan mensual/anual, webhooks, gating.
12. `12-pulido-sharing-accesibilidad.md` — Sharing público, a11y, QA final.

## Notas de alcance

- No se programa en esta fase; los archivos son guía de implementación.
- Se asume monorepo con dos packages: `apps/web` (frontend) y `apps/api` (backend). `tools/` (ya existe) puede alojar scripts de validación del motor.
- Las skills ya descargadas viven en `~/.agents/skills/` y son referenciadas desde aquí.