import { createAuthClient } from "better-auth/react"

const baseURL = import.meta.env.VITE_API_URL

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
})

export type Session = typeof authClient.$Infer.Session

export interface UseSessionResult {
  data: Session | null
  isPending: boolean
}

export function useSession(): UseSessionResult {
  const { data, isPending } = authClient.useSession()
  return { data, isPending }
}

export async function getSession() {
  return authClient.getSession()
}

export async function signInWithEmail(email: string, password: string) {
  return authClient.signIn.email({ email, password })
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  return authClient.signUp.email({ email, password, name })
}

export async function signOut() {
  return authClient.signOut()
}