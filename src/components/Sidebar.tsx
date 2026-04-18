import { cn } from "@/lib/utils"
import { navigate } from "@/hooks/useHashRoute"
import { categories, conceptIndex } from "@/content/concepts"
import { allExercises } from "@/content/exercises"

interface SidebarProps {
  current: string
}

export function Sidebar({ current }: SidebarProps) {
  const isExerciseRoute = current.startsWith("learn/")
  const activeExerciseId = isExerciseRoute ? current.slice(6) : null

  return (
    <aside className="hidden md:block w-[220px] shrink-0 overflow-y-auto border-r border-[var(--color-line)] py-10">
      {categories.map((cat) => (
        <section key={cat.id} className="mb-8 px-6">
          <h3 className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
            {cat.title}
          </h3>
          <ul className="space-y-[3px]">
            {cat.conceptIds.map((id) => {
              const concept = conceptIndex[id]
              if (!concept) return null
              const active = !isExerciseRoute && current === id
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate(id)
                    }}
                    className={cn(
                      "block py-[3px] text-[14px] transition-colors",
                      active
                        ? "text-[var(--color-fg)]"
                        : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                    )}
                  >
                    {concept.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {/* Práctica */}
      <section className="mb-8 px-6">
        <h3 className="mb-3 flex items-baseline justify-between text-[11px] uppercase tracking-[0.14em] text-[var(--color-fg-dim)]">
          <span>Práctica</span>
          <span className="text-[var(--color-fg-faint)]">{allExercises.length}</span>
        </h3>
        <ul className="space-y-[3px]">
          {allExercises.map((ex) => {
            const active = isExerciseRoute && activeExerciseId === ex.id
            return (
              <li key={ex.id}>
                <a
                  href={`#learn/${ex.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(`learn/${ex.id}`)
                  }}
                  className={cn(
                    "block py-[3px] text-[14px] transition-colors",
                    active
                      ? "text-[var(--color-fg)]"
                      : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
                  )}
                >
                  {ex.label}
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    </aside>
  )
}
