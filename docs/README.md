# Axioma Web — Documentación

> Alternativa liviana y accesible a Wolfram Mathematica, pensada para estudiantes universitarios y usuarios comunes que necesitan cálculo simbólico y gráficos, sin pagar precios de software profesional. Producto bajo CROBF.

## Visión del producto

Axioma es una herramienta de cálculo y visualización con tres pilares:

1. **Notebooks interactivos** estilo Jupyter / Mathematica con celdas reordenables, encadenables y con referencias entre resultados (cada celda puede usar `$$cellId` para apuntar a otra anterior).
2. **Motor simbólico confiable** capaz de resolver derivadas, límites e integrales de Análisis Matemático I; cuando no llegue al resultado completo, muestra el **paso a paso** hasta donde llegó — nunca un error genérico.
3. **Gráficos 2D** con zoom, pan y múltiples funciones superpuestas.

El usuario escribe en LaTeX (con mathlive como editor), obtiene el resultado renderizado con KaTeX y persiste su trabajo en notebooks organizados en carpetas.

## Identidad y experiencia

- **Visual:** minimalista, alto contraste, fondo blanco o negro.
- **Personalización:** color de acento configurable por el usuario (settings).
- **Accesibilidad:** contraste WCAG AA, navegación 100% por teclado, soporte para lectores de pantalla.

## Modelo de negocio

- **Sin trial, sin free tier.** Suscripción obligatoria desde el día 1.
- **Planes:**
  - Mensual (referencia u$s2/mes).
  - Anual con descuento (referencia u$s18/año).
- **Pagos:** Mercado Pago (recurrencia vía Preapproval).

## Stack confirmado (versión a julio 2026)

| Capa | Tecnología | Versión actual |
|------|------------|----------------|
| Frontend | React + Vite | (definir en paso 02) |
| Estado | zustand | 5.0.15 |
| Input math | mathlive | (resolución flexible) |
| Render math | katex | (resolución flexible) |
| Motor simbólico | @cortex-js/compute-engine | 0.115.0 (35 MB unpacked → **lazy load**) |
| Gráficos 2D | function-plot | 1.25.4 |
| Caché local | dexie | 4.4.5 |
| Backend | hono | 4.13.3 |
| Node adapter | @hono/node-server | 2.1.1 |
| Auth | better-auth | 1.7.1 |
| Auth adapter | @better-auth/drizzle-adapter | 1.7.1 |
| ORM | drizzle-orm | 0.45.2 |
| DB driver | @libsql/client | 0.17.4 |
| DB package | @axioma/db | dual: Turso en backend, fetch en frontend |
| DB engine | Turso / libSQL | (serverless) |
| Pagos | mercadopago | 3.4.0 |

## Documentación de este repositorio

- [`producto.md`](./producto.md) — Spec original del producto (CROBF).
- [`plan/`](./plan/) — Plan de implementación dividido en 12 pasos secuenciales, con criterios de aceptación por paso.
- [`packages/db/`](../packages/db/) — Paquete dual usado por frontend y backend.
  - [`plan/INCONSISTENCIAS.md`](./plan/INCONSISTENCIAS.md) — Issues abiertos a resolver antes de implementar.
- [`tasks/`](./tasks/) — Tasks atómicas (86 archivos) que descomponen cada paso. Cada task es ≤ 1 día de trabajo y referencia al paso padre.

## Skills instaladas relevantes

Para trabajar en este proyecto se recomienda instalar las skills listadas en el plan, principalmente:

- `better-auth/skills@better-auth-best-practices`
- `better-auth/skills@email-and-password-best-practices`
- `tursodatabase/agent-skills@turso-db`
- `yusukebe/skills@hono`
- `membranedev/application-skills@mercado-pago`
- `devfirexyz/skills@dexiejs`
- (recomendada, no instalada) `antfu/skills@vite`
