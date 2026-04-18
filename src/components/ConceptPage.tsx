import { type Concept } from "@/content/concepts"
import { navigate } from "@/hooks/useHashRoute"

interface ConceptPageProps {
  concept: Concept
  prev?: Concept
  next?: Concept
}

export function ConceptPage({ concept, prev, next }: ConceptPageProps) {
  return (
    <article className="mx-auto max-w-[720px] px-8 py-20 md:px-12 md:py-28">
      {/* Title */}
      <h1 className="font-mono text-[28px] font-medium leading-tight text-[var(--color-fg)]">
        {concept.label}
      </h1>

      {/* Lede */}
      <p className="mt-5 text-[17px] leading-[1.6] text-[var(--color-fg-muted)]">
        {concept.lede}
      </p>

      {/* Sections */}
      <div className="mt-14 space-y-10">
        {concept.sections.map((s, i) => (
          <section key={i}>
            {s.heading && (
              <h2 className="mb-3 text-[15px] font-medium text-[var(--color-fg)]">
                {s.heading}
              </h2>
            )}
            <div className="prose">{s.body}</div>
          </section>
        ))}
      </div>

      {/* Playground */}
      <div className="mt-12">{concept.playground}</div>

      {/* Pitfalls — plain list with quiet label */}
      {concept.pitfalls && concept.pitfalls.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
            Tropiezos
          </h2>
          <ul className="space-y-2 text-[15px] leading-[1.65] text-[var(--color-fg-muted)]">
            {concept.pitfalls.map((p, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-[3px] h-px w-3 shrink-0 bg-[var(--color-fg-dim)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer nav */}
      <nav className="mt-24 flex items-start justify-between gap-8 border-t border-[var(--color-line)] pt-8 text-[14px]">
        {prev ? (
          <a
            href={`#${prev.id}`}
            onClick={(e) => { e.preventDefault(); navigate(prev.id) }}
            className="group flex flex-col gap-1 text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
          >
            <span className="text-[12px] text-[var(--color-fg-dim)]">← anterior</span>
            <span className="text-[var(--color-fg)]">{prev.label}</span>
          </a>
        ) : <span />}
        {next ? (
          <a
            href={`#${next.id}`}
            onClick={(e) => { e.preventDefault(); navigate(next.id) }}
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
