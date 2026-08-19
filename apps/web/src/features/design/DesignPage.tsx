import { Button, Card, Input } from "../../components/ui/index.ts"
import { AccentPicker } from "../../theme/AccentPicker.tsx"
import { useTheme } from "../../theme/useTheme.ts"
import type { Theme } from "../../theme/ThemeProvider.tsx"
import "./DesignPage.css"

const THEME_OPTIONS: Theme[] = ["light", "dark", "system"]

export default function DesignPage() {
  const { theme, setTheme } = useTheme()

  return (
    <main className="design">
      <header className="design__header">
        <h1>Design System</h1>
        <p>Muestras de componentes, tokens y verificación de contraste.</p>
      </header>

      <section className="design__section">
        <h2 className="design__section-title">Tema</h2>
        <div className="design__row">
          <span className="design__row-label">Theme</span>
          <div className="design__theme-toggle" role="group" aria-label="Selector de tema">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  "design__theme-option" +
                  (theme === option ? " design__theme-option--active" : "")
                }
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Accent</h2>
        <Card>
          <AccentPicker />
        </Card>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Botones</h2>
        <div className="design__row">
          <span className="design__row-label">Primary</span>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
        <div className="design__row">
          <span className="design__row-label">Secondary</span>
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="secondary" size="md">Medium</Button>
          <Button variant="secondary" size="lg">Large</Button>
        </div>
        <div className="design__row">
          <span className="design__row-label">Ghost</span>
          <Button variant="ghost" size="sm">Small</Button>
          <Button variant="ghost" size="md">Medium</Button>
          <Button variant="ghost" size="lg">Large</Button>
        </div>
        <div className="design__row">
          <span className="design__row-label">Disabled</span>
          <Button variant="primary" size="md" disabled>Disabled</Button>
          <Button variant="secondary" size="md" disabled>Disabled</Button>
          <Button variant="ghost" size="md" disabled>Disabled</Button>
        </div>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Card</h2>
        <Card className="design__sample-card">
          <h3>Nota de muestra</h3>
          <p>
            Esta card usa los tokens de superficie y borde. El accent se aplica
            en vivo a todos los componentes.
          </p>
          <div className="design__row">
            <Button variant="primary" size="sm">Acción</Button>
            <Button variant="ghost" size="sm">Cancelar</Button>
          </div>
        </Card>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Input</h2>
        <div className="design__field">
          <label className="design__field-label" htmlFor="design-input">
            Campo de muestra
          </label>
          <Input id="design-input" type="text" placeholder="Escribí algo…" />
        </div>
        <div className="design__field">
          <label className="design__field-label" htmlFor="design-input-disabled">
            Campo deshabilitado
          </label>
          <Input id="design-input-disabled" type="text" placeholder="Deshabilitado" disabled />
        </div>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Texto</h2>
        <div className="design__text-sample">
          <span className="design__text-h">Texto heading (var(--text-h))</span>
          <span className="design__text-body">Texto body (var(--text))</span>
          <span style={{ color: "var(--danger)" }}>Texto danger (var(--danger))</span>
          <span style={{ color: "var(--success)" }}>Texto success (var(--success))</span>
        </div>
      </section>

      <section className="design__section">
        <h2 className="design__section-title">Contraste WCAG AA</h2>
        <div className="design__a11y">
          <span className="design__a11y-title">Verificación AA</span>
          <span className="design__a11y-text">
            Contraste --text-h sobre --bg cumple WCAG AA (≥ 4.5:1) en light y dark.
          </span>
          <span className="design__a11y-text">
            Contraste --accent sobre --accent-fg cumple AA en ambos modos.
          </span>
        </div>
      </section>
    </main>
  )
}