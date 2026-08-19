# Task 10-T07 — Indicador UI "Sin conexión — N cambios pendientes"

- **Paso:** 10 — Caché Dexie + sync
- **Tiempo estimado:** 1 hora
- **Depende de:** 10-T05

## Contexto

Plan paso 10 línea 49.

## Alcance

- `<OfflineBadge count={pending.length} online={isOnline} />`.
- Cuenta items en `syncQueue`.
- Visible en header global.
- Click muestra lista de pendientes.

## Entregable

- Componente.

## Criterios de aceptación

- [ ] Aparece badge con N cuando hay items.
- [ ] Desaparece al sincronizar.
- [ ] En offline, texto cambia a "Sin conexión".