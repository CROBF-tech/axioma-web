# Paso 12 — Pulido, sharing y accesibilidad

## Objetivo

Cierre de features del spec no cubiertas antes: notebooks públicos (solo lectura), organización en carpetas, accesibilidad, QA final.

## 1. Organización en carpetas

- Vista `/library` con árbol de carpetas y notebooks.
- CRUD de folders (rename, move, delete).
- Mover notebook entre carpetas (drag en árbol o selector).

## 2. Sharing público (solo lectura)

- En notebook: toggle "Compartir públicamente" → genera `public_slug` aleatorio.
- Ruta pública `/s/:slug` renderiza el notebook en modo **solo lectura** (sin editar, sin ejecutar — o ejecutar sandbox? Decidir: **ejecución permitida en cliente, no persiste**).
- Backend: `GET /public/notebooks/:slug` devuelve notebook sin auth; snapshot del contenido.
- Caducidad: sin caducidad (link permanente hasta desactivar).

## 3. Accesibilidad

- Teclado: navegar celdas con flechas, ejecutar con `Ctrl+Enter` (convención Mathematica/Jupyter).
- mathlive tiene soporte AT; verificar `aria-label` en outputs.
- Contraste AA (verificado en paso 03, revalidar aquí).
- Focus visible en todos los interactivos.
- Skip links, landmark roles.

## 4. QA final

- E2E (Playwright) de los flujos críticos:
  - Registro → pricing → checkout (mock MP) → crear notebook → ejecutar celda → compartir.
- Performance: Lighthouse ≥90 en web.
- Bundle size: lazy load nerdamer y function-plot.
- Lint/format pasa.
- Seguridad: revisar rate limits, CSRF, cookies.

## 5. Detalles finales

- Favicon, meta tags, título.
- Página 404 y error genérico.
- Loading states y skeletons.
- Empty states (sin notebooks, sin celdas).

## Entregables

- `/library` funcional con carpetas.
- Sharing con `/s/:slug`.
- Suite E2E Playwright.
- Reporte Lighthouse + axe.

## Criterios de aceptación

- [ ] Notebook compartido accesible sin login, solo lectura.
- [ ] Al desactivar sharing, link 404.
- [ ] Navegación 100% por teclado.
- [ ] Lighthouse ≥90 performance + accessibility.
- [ ] E2E de checkout→uso pasa en CI.