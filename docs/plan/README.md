# Plan Axioma Web

Espec fuente: [`producto.md`](../producto.md)

## Pasos (en orden recomendado)

| # | Archivo | Estado |
|---|---------|--------|
| 01 | [Validación motor simbólico](./01-validacion-motor-simbolico.md) | 🔴 crítico primero |
| 02 | [Estructura monorepo](./02-estructura-monorepo.md) | |
| 03 | [Sistema de diseño e identidad](./03-diseno-sistema-identidad.md) | |
| 04 | [Backend Hono base](./04-backend-hono-base.md) | |
| 05 | [Base de datos Turso + schema](./05-base-datos-turso-schema.md) | |
| 06 | [Autenticación better-auth](./06-autenticacion-better-auth.md) | |
| 07 | [Servicio motor simbólico](./07-motor-simbolico-servicio.md) | depende de 01 |
| 08 | [Notebook UI celdas](./08-notebook-ui-celdas.md) | depende de 03, 07 |
| 09 | [Gráficos function-plot](./09-graficos-function-plot.md) | depende de 08 |
| 10 | [Caché Dexie + sync](./10-cache-dexie-sincronizacion.md) | depende de 05, 08 |
| 11 | [Suscripción Mercado Pago](./11-suscripcion-mercadopago.md) | depende de 06 |
| 12 | [Pulido, sharing, a11y](./12-pulido-sharing-accesibilidad.md) | |

## Skills instaladas para este proyecto

Instaladas vía `npx skills add -g -y`:

| Skill | Para |
|-------|------|
| `better-auth/skills@better-auth-best-practices` | Auth general |
| `better-auth/skills@email-and-password-best-practices` | Login email/password |
| `tursodatabase/agent-skills@turso-db` | Base de datos |
| `yusukebe/skills@hono` | Backend Hono (oficial autor) |
| `membranedev/application-skills@mercado-pago` | Pagos |
| `devfirexyz/skills@dexiejs` | Caché offline |

Ya presentes antes: `find-skills`, `context7-mcp`, `documentation-writer`, `drizzle`, `frontend-design`, `nodejs-backend-patterns`, `shadcn`, `tailwind-v4-shadcn`.

## Pendiente de instalar (recomendado)

- `antfu/skills@vite` (33K installs) — para el paso 02 (bundler frontend).
- `pmndrs/zustand` no tiene skill oficial; se usa Context7 para docs.

## Notas

- El paso 01 valida el riesgo técnico principal antes de invertir en UI.
- No hay programación en esta fase; los archivos son guía.
- Las decisiones de fallback (compute-engine vs nerdamer) se firman en `tools/RESULTADOS.md` tras el paso 01.