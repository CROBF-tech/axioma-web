import { createAuthClient } from "better-auth/react"

const baseURL = import.meta.env.VITE_API_URL

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
  sessionOptions: {
    refetchInterval: 0,
    refetchOnWindowFocus: false,
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

let signInPromise: ReturnType<typeof authClient.signIn.email> | null = null
let signInArgs: { email: string; password: string } | null = null

export async function signInWithEmail(email: string, password: string) {
  if (signInPromise && signInArgs?.email === email && signInArgs?.password === password) {
    return signInPromise
  }
  signInArgs = { email, password }
  signInPromise = authClient.signIn.email({ email, password })
  try {
    return await signInPromise
  } finally {
    signInPromise = null
  }
}

let signUpPromise: ReturnType<typeof authClient.signUp.email> | null = null
let signUpArgs: { email: string; password: string; name: string } | null = null

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (
    signUpPromise &&
    signUpArgs?.email === email &&
    signUpArgs?.password === password &&
    signUpArgs?.name === name
  ) {
    return signUpPromise
  }
  signUpArgs = { email, password, name }
  signUpPromise = authClient.signUp.email({ email, password, name })
  try {
    return await signUpPromise
  } finally {
    signUpPromise = null
  }
}

export async function signOut() {
  return authClient.signOut()
}
