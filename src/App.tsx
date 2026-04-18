import { useEffect, useMemo } from "react"
import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ConceptPage } from "@/components/ConceptPage"
import { ExercisePage } from "@/components/ExercisePage"
import { allConcepts, conceptIndex } from "@/content/concepts"
import { allExercises, exerciseIndex } from "@/content/exercises"
import { useHashRoute, navigate } from "@/hooks/useHashRoute"

export default function App() {
  const route = useHashRoute()

  const isExerciseRoute = route.startsWith("learn/")
  const exerciseId = isExerciseRoute ? route.slice(6) : null

  // Resolve current content
  const exercise = exerciseId ? exerciseIndex[exerciseId] : undefined
  const concept = !isExerciseRoute ? conceptIndex[route] : undefined

  // Fallback: if we're on an exercise route but id is invalid, go to first exercise
  // If we're on an unknown concept id, go to first concept
  useEffect(() => {
    if (isExerciseRoute && !exercise) {
      navigate(`learn/${allExercises[0].id}`)
      return
    }
    if (!isExerciseRoute && !concept) {
      navigate(allConcepts[0].id)
    }
  }, [isExerciseRoute, exerciseId, route, concept, exercise])

  // Prev/next within the active section
  const conceptOrder = useMemo(() => allConcepts.map((c) => c.id), [])
  const exerciseOrder = useMemo(() => allExercises.map((e) => e.id), [])

  let conceptPrev, conceptNext, exercisePrev, exerciseNext
  if (concept) {
    const idx = conceptOrder.indexOf(concept.id)
    conceptPrev = idx > 0 ? allConcepts[idx - 1] : undefined
    conceptNext = idx < allConcepts.length - 1 ? allConcepts[idx + 1] : undefined
  }
  if (exercise) {
    const idx = exerciseOrder.indexOf(exercise.id)
    exercisePrev = idx > 0 ? allExercises[idx - 1] : undefined
    exerciseNext = idx < allExercises.length - 1 ? allExercises[idx + 1] : undefined
  }

  // Scroll + title
  useEffect(() => {
    document.getElementById("scroll-area")?.scrollTo({ top: 0, behavior: "auto" })
    const label = exercise?.label ?? concept?.label ?? "react learn"
    document.title = `${label} — react learn`
  }, [concept?.id, concept?.label, exercise?.id, exercise?.label])

  const pageKey = exercise ? `ex-${exercise.id}` : concept ? `co-${concept.id}` : "loading"

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <Sidebar current={route} />
        <main id="scroll-area" className="flex-1 overflow-y-auto">
          <div key={pageKey} className="page-enter">
            {exercise ? (
              <ExercisePage exercise={exercise} prev={exercisePrev} next={exerciseNext} />
            ) : concept ? (
              <ConceptPage concept={concept} prev={conceptPrev} next={conceptNext} />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  )
}
