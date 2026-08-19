import { defineConfig } from "vitest/config"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@axioma/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@axioma/engine": path.resolve(__dirname, "../../packages/engine/src/index.ts"),
      "@axioma/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
})
