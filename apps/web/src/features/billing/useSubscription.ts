import { useEffect, useState } from "react"
import { ApiError, getSubscriptionStatus } from "@axioma/db"
import type { SubscriptionStatusResponse } from "@axioma/db"
import { useSession } from "../../auth/client.ts"

export type SubscriptionState = {
  status: SubscriptionStatusResponse["status"] | null
  plan: SubscriptionStatusResponse["plan"]
  currentPeriodEnd: string | null
  isPending: boolean
  isActive: boolean
}

const IDLE_STATE: SubscriptionState = {
  status: null,
  plan: null,
  currentPeriodEnd: null,
  isPending: true,
  isActive: false,
}

export function useSubscription(): SubscriptionState {
  const { data: session, isPending: sessionPending } = useSession()
  const [state, setState] = useState<SubscriptionState>(IDLE_STATE)

  useEffect(() => {
    if (sessionPending) return
    if (!session) {
      setState({
        status: null,
        plan: null,
        currentPeriodEnd: null,
        isPending: false,
        isActive: false,
      })
      return
    }

    let active = true
    setState((prev) => ({ ...prev, isPending: true }))
    getSubscriptionStatus()
      .then((res) => {
        if (!active) return
        setState({
          status: res.status,
          plan: res.plan,
          currentPeriodEnd: res.current_period_end,
          isPending: false,
          isActive: res.status === "active",
        })
      })
      .catch((err: unknown) => {
        if (!active) return
        if (err instanceof ApiError && err.status === 401) {
          setState({
            status: null,
            plan: null,
            currentPeriodEnd: null,
            isPending: false,
            isActive: false,
          })
          return
        }
        setState({
          status: null,
          plan: null,
          currentPeriodEnd: null,
          isPending: false,
          isActive: false,
        })
      })

    return () => {
      active = false
    }
  }, [session, sessionPending])

  return state
}