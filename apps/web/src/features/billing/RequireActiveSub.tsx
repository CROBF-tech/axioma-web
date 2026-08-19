import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useSession } from "../../auth/client.ts"
import { useSubscription } from "./useSubscription.ts"

type RequireActiveSubProps = {
  children: ReactNode
}

export default function RequireActiveSub({ children }: RequireActiveSubProps) {
  const { data: session, isPending: sessionPending } = useSession()
  const { isActive, isPending: subPending } = useSubscription()

  if (sessionPending || (session && subPending)) {
    return null
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!isActive) {
    return <Navigate to="/pricing" replace />
  }

  return <>{children}</>
}