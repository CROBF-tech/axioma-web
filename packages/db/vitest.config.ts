import { defineConfig } from "vitest/config";

try {
  process.loadEnvFile(".env");
} catch {
  // .env no existe o no se puede leer; se usan las variables ya presentes en el entorno.
}

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    typecheck: { tsconfig: "./tsconfig.test.json" },
  },
});
