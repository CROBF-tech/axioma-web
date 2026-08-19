import { useState, type ChangeEvent } from "react"
import { Button, Input } from "../components/ui/index.ts"
import { useTheme } from "./useTheme.ts"
import "./AccentPicker.css"

const ACCENT_PRESETS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
] as const

const DEFAULT_ACCENT = "#6366f1"

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/

export function AccentPicker() {
  const { accent, setAccent } = useTheme()
  const [hexInput, setHexInput] = useState(accent)
  const [hexError, setHexError] = useState<string | null>(null)

  function handlePreset(color: string): void {
    setAccent(color)
    setHexInput(color)
    setHexError(null)
  }

  function handleHexChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value
    setHexInput(value)
    if (HEX_REGEX.test(value)) {
      setAccent(value)
      setHexError(null)
    } else if (value.length === 7) {
      setHexError("Formato inválido. Usá #RRGGBB.")
    } else {
      setHexError(null)
    }
  }

  function handleReset(): void {
    setAccent(DEFAULT_ACCENT)
    setHexInput(DEFAULT_ACCENT)
    setHexError(null)
  }

  return (
    <div className="accent-picker">
      <div className="accent-picker__group">
        <span className="accent-picker__label">Presets</span>
        <div className="accent-picker__presets" role="group" aria-label="Colores preset">
          {ACCENT_PRESETS.map((color) => {
            const isActive = accent.toLowerCase() === color.toLowerCase()
            return (
              <button
                key={color}
                type="button"
                className={
                  "accent-picker__preset" +
                  (isActive ? " accent-picker__preset--active" : "")
                }
                style={{ background: color }}
                aria-label={`Accent ${color}`}
                aria-pressed={isActive}
                onClick={() => handlePreset(color)}
              />
            )
          })}
        </div>
      </div>

      <div className="accent-picker__group">
        <span className="accent-picker__label">Color custom</span>
        <div className="accent-picker__custom">
          <input
            type="color"
            className="accent-picker__color-input"
            value={accent}
            aria-label="Selector de color"
            onChange={(e) => handlePreset(e.target.value)}
          />
          <Input
            type="text"
            className="accent-picker__hex"
            value={hexInput}
            placeholder="#6366f1"
            onChange={handleHexChange}
            aria-label="Código hex"
          />
        </div>
        {hexError !== null && (
          <p className="accent-picker__hint" role="alert">
            {hexError}
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="accent-picker__reset"
        onClick={handleReset}
      >
        Restablecer
      </Button>
    </div>
  )
}