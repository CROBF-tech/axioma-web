import { Outlet } from "react-router-dom"
import { Header } from "./Header.tsx"
import "./Layout.css"

export function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  )
}
