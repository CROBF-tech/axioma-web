# Task 03-T04 — Componentes base (Surface, Button, Input)

- **Paso:** 03 — Diseño e identidad visual
- **Tiempo estimado:** 3 horas
- **Depende de:** 03-T01

## Contexto

Plan paso 03 línea 50. Wrappers shadcn con tokens propios para no caer en defaults.

## Alcance

- Agregar shadcn components a `apps/web`: `button`, `input`, `card` (= Surface).
- Sobre-escribir colores: usar `bg-bg`, `text-fg`, `border-border`, hover `bg-accent/10`.
- Variantes: `primary` (accent), `secondary`, `ghost`.

## Entregable

- `components/ui/button.tsx`, `input.tsx`, `card.tsx`.
- Estilos que respetan tokens.

## Criterios de aceptación

- [ ] Botón primary visible y clickeable con `--accent`.
- [ ] Cambiar accent (03-T03) afecta al botón.
- [ ] Estados focus-visible accesibles (`outline` visible).
- [ ] Sin colores hardcodeados en componentes.