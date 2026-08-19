import { useEffect, useRef } from "react"
import type { Cell } from "@axioma/db"
import "./PlotCell.css"

export type PlotCellProps = {
  cell: Cell
  readOnly?: boolean
}

const PLOT_WIDTH = 640
const PLOT_HEIGHT = 260
const DEFAULT_FN = "sin(x)"

function parseFunction(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return DEFAULT_FN
  const afterEquals = trimmed.includes("=")
    ? trimmed.slice(trimmed.indexOf("=") + 1).trim()
    : trimmed
  return afterEquals.replace(/\^/g, "**")
}

function readAccent(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim()
}

export default function PlotCell({ cell, readOnly = false }: PlotCellProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<string>("")

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    let cancelled = false

    async function render() {
      const accent = readAccent()
      accentRef.current = accent

      const fn = parseFunction(cell.input)
      const { default: functionPlot } = await import("function-plot")
      if (cancelled || !container) return

      container.innerHTML = ""
      functionPlot({
        target: container,
        width: PLOT_WIDTH,
        height: PLOT_HEIGHT,
        grid: true,
        data: [{ fn, color: accent || "#6366f1" }],
      })
    }

    void render()

    return () => {
      cancelled = true
      container.innerHTML = ""
    }
  }, [cell.input])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const accent = readAccent()
    if (accent === accentRef.current) return undefined

    let cancelled = false

    async function rerender() {
      accentRef.current = accent
      const fn = parseFunction(cell.input)
      const { default: functionPlot } = await import("function-plot")
      if (cancelled || !container) return

      container.innerHTML = ""
      functionPlot({
        target: container,
        width: PLOT_WIDTH,
        height: PLOT_HEIGHT,
        grid: true,
        data: [{ fn, color: accent || "#6366f1" }],
      })
    }

    void rerender()

    return () => {
      cancelled = true
      container.innerHTML = ""
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="plot-cell"
      aria-label="Gráfico de función"
      aria-readonly={readOnly}
    />
  )
}
