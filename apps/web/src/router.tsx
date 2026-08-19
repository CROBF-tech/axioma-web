import { createBrowserRouter } from "react-router-dom"
import LoginPage from "./features/auth/LoginPage.tsx"
import RegisterPage from "./features/auth/RegisterPage.tsx"
import DesignPage from "./features/design/DesignPage.tsx"
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
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/design", element: <DesignPage /> },
])