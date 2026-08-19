import katex from "katex"
import type { EngineResult } from "@axioma/engine"
import "katex/dist/katex.min.css"
import "./Result.css"

export type ResultProps = {
  result: EngineResult | null
}

function renderLatex(latex: string): { __html: string } {
  return {
    __html: katex.renderToString(latex, { throwOnError: false, output: "html" }),
  }
}

export default function Result({ result }: ResultProps) {
  if (!result || !result.ok) return null

  const lastStep = result.steps?.[result.steps.length - 1]

  return (
    <div className="result">
      {result.partial && (
        <div className="result__partial">
          <span className="result__badge">Resuelto parcialmente</span>
          <p className="result__partial-text">
            No pude resolver por completo; llegué hasta:
          </p>
          {lastStep && (
            <div
              className="result__latex"
              dangerouslySetInnerHTML={renderLatex(lastStep.latex ?? "")}
            />
          )}
        </div>
      )}

      {!result.partial && (
        <div
          className="result__latex result__latex--main"
          dangerouslySetInnerHTML={renderLatex(result.latex ?? "")}
        />
      )}

      {result.steps && result.steps.length > 0 && (
        <details className="result__steps">
          <summary className="result__summary">Ver pasos</summary>
          <ol className="result__steps-list">
            {result.steps.map((step, idx) => (
              <li key={idx} className="result__step">
                {step.latex ? (
                  <div
                    className="result__latex"
                    dangerouslySetInnerHTML={renderLatex(step.latex)}
                  />
                ) : (
                  <code className="result__step-raw">{JSON.stringify(step)}</code>
                )}
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  )
}
