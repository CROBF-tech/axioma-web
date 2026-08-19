import { useEffect, useRef } from "react"
import type { Cell } from "@axioma/db"
import { parseLatexToFunctionPlotData } from "./parser.ts"
import "./PlotCell.css"

export type PlotCellProps = {
  cell: Cell
  readOnly?: boolean
}

const PLOT_WIDTH = 640
const PLOT_HEIGHT = 260
const DEFAULT_FN = "sin(x)"

function readAccent(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim()
}

function buildPlotData(input: string, accent: string) {
  const parsed = parseLatexToFunctionPlotData(input, accent || "#6366f1")
  if (parsed.length === 0) {
    const color = accent || "#6366f1"
    return [{ fn: DEFAULT_FN, color }]
  }
  return parsed
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
      const data = buildPlotData(cell.input, accent)
      const { default: functionPlot } = await import("function-plot")
      if (cancelled || !container) return

      container.innerHTML = ""
      functionPlot({
        target: container,
        width: PLOT_WIDTH,
        height: PLOT_HEIGHT,
        grid: true,
        data,
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
      const data = buildPlotData(cell.input, accent)
      const { default: functionPlot } = await import("function-plot")
      if (cancelled || !container) return

      container.innerHTML = ""
      functionPlot({
        target: container,
        width: PLOT_WIDTH,
        height: PLOT_HEIGHT,
        grid: true,
        data,
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
