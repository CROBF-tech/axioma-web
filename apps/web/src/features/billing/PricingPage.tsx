import { useEffect, useState } from "react"
import { ApiError, checkout, getSubscriptionStatus } from "@axioma/db"
import type { SubscriptionStatusResponse } from "@axioma/db"
import "./PricingPage.css"

type Plan = "monthly" | "annual"

type PlanConfig = {
  id: Plan
  name: string
  price: string
  period: string
  badge?: string
}

const PLANS: PlanConfig[] = [
  { id: "monthly", name: "Mensual", price: "u$s2", period: "/mes" },
  { id: "annual", name: "Anual", price: "u$s18", period: "/año", badge: "Ahorrá 25%" },
]

export default function PricingPage() {
  const [status, setStatus] = useState<SubscriptionStatusResponse | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getSubscriptionStatus()
      .then((res) => {
        if (active) {
          setStatus(res)
          setStatusError(null)
        }
      })
      .catch((err: unknown) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 401) {
          setStatus(null)
          return
        }
        setStatusError(err instanceof Error ? err.message : "Error al verificar suscripción")
      })
      .finally(() => {
        if (active) {
          setStatusLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  const isActive = status?.status === "active"

  async function handleCheckout(plan: Plan): Promise<void> {
    setCheckoutError(null)
    setCheckoutPlan(plan)
    try {
      const res = await checkout(plan)
      window.location.href = res.init_point
    } catch (err: unknown) {
      setCheckoutError(err instanceof Error ? err.message : "Error al iniciar checkout")
      setCheckoutPlan(null)
    }
  }

  return (
    <main className="pricing">
      <header className="pricing__header">
        <h1>Planes</h1>
        <p>Elegí el plan que mejor se adapte a vos.</p>
      </header>

      {statusLoading && <p className="pricing__loading">Cargando…</p>}
      {isActive && <p className="pricing__active">Ya tenés suscripción activa</p>}
      {statusError !== null && (
        <div className="pricing__error" role="alert">
          {statusError}
        </div>
      )}
      {checkoutError !== null && (
        <div className="pricing__error" role="alert">
          {checkoutError}
        </div>
      )}

      <section className="pricing__cards">
        {PLANS.map((plan) => (
          <article key={plan.id} className="pricing__card">
            <header className="pricing__card-header">
              <h2>{plan.name}</h2>
              {plan.badge !== undefined && (
                <span className="pricing__badge">{plan.badge}</span>
              )}
            </header>
            <div className="pricing__price">
              <span className="pricing__price-amount">{plan.price}</span>
              <span className="pricing__price-period">{plan.period}</span>
            </div>
            <button
              type="button"
              className="pricing__cta"
              disabled={isActive || statusLoading || checkoutPlan !== null}
              onClick={() => void handleCheckout(plan.id)}
            >
              {checkoutPlan === plan.id ? "Procesando…" : "Suscribirme"}
            </button>
          </article>
        ))}
      </section>
    </main>
  )
}