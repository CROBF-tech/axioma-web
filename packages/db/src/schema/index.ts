// Re-exports del schema del producto.
// Las tablas de better-auth (user, session, account, verification) las gestiona
// el adapter `@better-auth/drizzle-adapter` desde apps/api/src/auth.

export * from "./notebooks";
export * from "./cells";
export * from "./folders";
export * from "./subscriptions";
