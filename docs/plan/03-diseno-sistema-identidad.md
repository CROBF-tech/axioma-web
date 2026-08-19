# Paso 03 — Sistema de diseño e identidad visual

## Objetivo

Materializar los lineamientos del spec — *minimalista, alto contraste, fondo blanco/negro, accent configurable por el usuario* — en tokens reutilizables.

## Fundamento

Spec:
> Minimalista, alto contraste. Fondo blanco/negro. Color de acento configurable por el usuario.

No se elige paleta de marca; se define un sistema **neutral + 1 accent dinámico**.

## Skills a usar

- `frontend-design` (ya instalada) — para no caer en defaults de plantilla.
- `tailwind-v4-shadcn` (ya instalada) — para el patrón `@theme inline` + variables CSS + dark mode.
- `shadcn` (ya instalada) — componentes base.

## Tokens

### Colores (variables CSS, tema Tailwind v4)
```css
@theme inline {
  --color-bg: var(--bg);
  --color-fg: var(--fg);
  --color-accent: var(--accent);   /* configurable */
  --color-muted: var(--muted);
  --color-border: var(--border);
}
```
Modo claro y oscuro:
- Claro: `--bg: #ffffff`, `--fg: #0a0a0a`.
- Oscuro: `--bg: #0a0a0a`, `--fg: #ffffff`.
- `--accent` por defecto: un azul/verde; **overrideable** vía `localStorage.axioma.accent` y picker en settings.

### Tipografía
- Sans: sistema (`system-ui`) o Inter (sin cargar fuente externa por defecto para mantener liviano).
- Mono (código/resultados): `ui-monospace` / JetBrains Mono opcional.
- Math: KaTeX fonts (cargadas por la librería).

### Espaciado / radio
- Escala Tailwind por defecto.
- Radios pequeños (4–8px), borde fino 1px `--border`.

## Componentes clave (se definen aquí, se construyen en pasos 08-12)

- `Theme provider` — lectura de `--accent` desde preferencia del usuario.
- `AccentPicker` — settings UI para cambiar accent (color sólido o presets).
- `Surface`, `Button`, `Input` — wrappers shadcn con tokens propios.

## Entregables

- `apps/web/src/styles/tokens.css` con variables.
- `apps/web/src/theme/provider.tsx`.
- `apps/web/src/theme/accent.ts` (get/set persistente).
- Documento visual: una página `/design` con muestras (button, card, fórmula KaTeX, plot) en claro y oscuro.

## Criterios de aceptación

- [ ] Cambiar accent en `/design` actualiza toda la UI sin recargar.
- [ ] Dark mode toggle persistente.
- [ ] Contraste AA mínimo en ambos temas (verificar con axe o Lighthouse).
- [ ] Sin colores de marca hardcodeados; todo viaja por tokens.