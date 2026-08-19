import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"
import "./index.css"
import { router } from "./router.tsx"
import { ThemeProvider } from "./theme/ThemeProvider.tsx"
import { useSyncTrigger } from "./hooks/useSyncTrigger.ts"

function SyncBoot() {
  useSyncTrigger()
  return null
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <SyncBoot />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
