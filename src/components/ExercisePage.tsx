import { useState } from "react"
import { Playground } from "@/components/Playground"
import { navigate } from "@/hooks/useHashRoute"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/content/exercises"

interface ExercisePageProps {
  exercise: Exercise
  prev?: Exercise
  next?: Exercise
}

export function ExercisePage({ exercise, prev, next }: ExercisePageProps) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <article className="mx-auto max-w-[720px] px-8 py-20 md:px-12 md:py-28">
      {/* Kicker: Práctica + dificultad */}
      <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
        <span>práctica</span>
        <span className="h-px w-5 bg-[var(--color-fg-faint)]" />
        <span>{exercise.difficulty}</span>
      </div>

      {/* Title */}
      <h1 className="font-mono text-[28px] font-medium leading-tight text-[var(--color-fg)]">
        {exercise.title}
      </h1>

      {/* Lede */}
      <p className="mt-5 text-[17px] leading-[1.6] text-[var(--color-fg-muted)]">
        {exercise.lede}
      </p>

      {/* Objetivos */}
      <section className="mt-10">
        <h2 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
          Objetivos
        </h2>
        <ul className="space-y-2 text-[15px] leading-[1.6] text-[var(--color-fg-muted)]">
          {exercise.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-[5px] inline-block h-[10px] w-[10px] shrink-0 rounded-full border border-[var(--color-fg-dim)]"
              />
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Playground with solution toggle */}
      <section className="mt-12">
        <div className="mb-2 flex items-center justify-between text-[11px] text-[var(--color-fg-dim)]">
          <span>
            {showSolution ? "viendo solución" : "tu intento"}
          </span>
          <button
            onClick={() => setShowSolution((v) => !v)}
            className={cn(
              "text-[11px] transition-colors",
              showSolution
                ? "text-[var(--color-fg)]"
                : "text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]",
            )}
          >
            {showSolution ? "volver al starter ↺" : "ver solución →"}
          </button>
        </div>
        <Playground
          key={`${exercise.id}-${showSolution ? "sol" : "start"}`}
          files={showSolution ? exercise.solution : exercise.starter}
        />
      </section>

      {/* Hint */}
      {exercise.hint && (
        <section className="mt-8">
          <details className="group text-[14px]">
            <summary className="cursor-pointer select-none text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]">
              Pista
            </summary>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--color-fg-muted)]">
              {exercise.hint}
            </p>
          </details>
        </section>
      )}

      {/* Related concepts */}
      {exercise.relatedConcepts && exercise.relatedConcepts.length > 0 && (
        <section className="mt-10">
          <h3 className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
            Conceptos relacionados
          </h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[14px]">
            {exercise.relatedConcepts.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => { e.preventDefault(); navigate(id) }}
                  className="font-mono text-[var(--color-fg)] underline decoration-[var(--color-line-strong)] underline-offset-[3px] hover:decoration-[var(--color-fg-muted)]"
                >
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer nav */}
      <nav className="mt-24 flex items-start justify-between gap-8 border-t border-[var(--color-line)] pt-8 text-[14px]">
        {prev ? (
          <a
            href={`#learn/${prev.id}`}
            onClick={(e) => { e.preventDefault(); navigate(`learn/${prev.id}`) }}
            className="group flex flex-col gap-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">← anterior</span>
            <span className="text-[var(--color-fg)]">{prev.label}</span>
          </a>
        ) : <span />}
        {next ? (
          <a
            href={`#learn/${next.id}`}
            onClick={(e) => { e.preventDefault(); navigate(`learn/${next.id}`) }}
            className="group flex flex-col items-end gap-1 text-right text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">siguiente →</span>
            <span className="text-[var(--color-fg)]">{next.label}</span>
          </a>
        ) : <span />}
      </nav>
    </article>
  )
}
