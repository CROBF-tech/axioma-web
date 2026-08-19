import { createBrowserRouter } from "react-router-dom"
import PricingPage from "./features/billing/PricingPage.tsx"

function Home() {
  return (
    <main>
      <h1>Axioma</h1>
      <p>Sistema de notebooks computables.</p>
    </main>
  )
}

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/pricing", element: <PricingPage /> },
])