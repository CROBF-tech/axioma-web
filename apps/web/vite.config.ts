import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@axioma/db/schema", replacement: path.resolve(__dirname, "../../packages/db/src/schema/index.ts") },
      { find: "@axioma/db", replacement: path.resolve(__dirname, "../../packages/db/src/index.ts") },
      { find: "@axioma/engine", replacement: path.resolve(__dirname, "../../packages/engine/src/index.ts") },
      { find: "@axioma/shared", replacement: path.resolve(__dirname, "../../packages/shared/src/index.ts") },
    ],
  },
})
