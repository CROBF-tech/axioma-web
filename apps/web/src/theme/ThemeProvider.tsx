import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

const STORAGE_KEY_THEME = "axioma.theme"
const STORAGE_KEY_ACCENT = "axioma.accent"
const DEFAULT_ACCENT = "#6366f1"

export type Theme = "light" | "dark" | "system"

export interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  accent: string
  setAccent: (accent: string) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function resolveTheme(theme: Theme): "light" | "dark" {
  return theme === "system" ? getSystemTheme() : theme
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, "")
  const parsed = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean
  if (!/^[0-9a-fA-F]{6}$/.test(parsed)) return null
  const r = parseInt(parsed.slice(0, 2), 16)
  const g = parseInt(parsed.slice(2, 4), 16)
  const b = parseInt(parsed.slice(4, 6), 16)
  return { r, g, b }
}

function applyAccent(accent: string): void {
  const rgb = hexToRgb(accent)
  const root = document.documentElement
  if (rgb === null) {
    root.style.removeProperty("--accent")
    root.style.removeProperty("--accent-bg")
    root.style.removeProperty("--accent-border")
    return
  }
  root.style.setProperty("--accent", accent)
  root.style.setProperty("--accent-bg", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`)
  root.style.setProperty("--accent-border", `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`)
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const value = window.localStorage.getItem(STORAGE_KEY_THEME)
  if (value === "light" || value === "dark" || value === "system") return value
  return "system"
}

function readStoredAccent(): string {
  if (typeof window === "undefined") return DEFAULT_ACCENT
  const value = window.localStorage.getItem(STORAGE_KEY_ACCENT)
  return value ?? DEFAULT_ACCENT
}

export interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const [accent, setAccentState] = useState<string>(readStoredAccent)

  useEffect(() => {
    const resolved = resolveTheme(theme)
    document.documentElement.setAttribute("data-theme", resolved)
  }, [theme])

  useEffect(() => {
    applyAccent(accent)
  }, [accent])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      document.documentElement.setAttribute("data-theme", getSystemTheme())
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    window.localStorage.setItem(STORAGE_KEY_THEME, next)
  }, [])

  const setAccent = useCallback((next: string) => {
    setAccentState(next)
    window.localStorage.setItem(STORAGE_KEY_ACCENT, next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, accent, setAccent }),
    [theme, accent, setTheme, setAccent],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}