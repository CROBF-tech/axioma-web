# Task 06-T07 — Anti-enumeración de emails en sign-up

- **Paso:** 06 — Autenticación better-auth
- **Tiempo estimado:** 1 hora
- **Depende de:** 06-T01

## Contexto

Inconsistencia D1 del plan. Evitar que `409 AlreadyExists` filtre emails registrados.

## Alcance

- Configurar `emailAndPassword.onExistingUserSignUp` en better-auth (ver docs).
- Opcional: response time uniforme entre "email existe" y "no existe".
- Mensaje genérico al frontend: "Si el email no está registrado, no podemos crear la cuenta. Intenta con otro email."

## Entregable

- Configuración anti-enumeración.

## Criterios de aceptación

- [ ] Registrar dos veces el mismo email devuelve 200 sin distinguir.
- [ ] Desde frontend, ningún mensaje revela si el email ya existe.
- [ ] Tiempo de respuesta similar entre email nuevo y registrado.