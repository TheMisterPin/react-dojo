"use client"

import { useMemo, useRef, type RefObject } from "react"
import { FlaskConical } from "lucide-react"
import { useTranslations } from "next-intl"
import { TestResultModal } from "@/components/TestResultModal"
import { cn } from "@/lib/utils"
import type { Exercise } from "@/content/exercises"
import { useExerciseTestLabels } from "@/hooks/use-exercise-test-labels"
import { type ExerciseTestsController, useExerciseTests } from "@/hooks/use-exercise-tests"

interface ExerciseTestsSectionProps {
  exercise: Exercise
  showSolution: boolean
  playgroundHostRef?: RefObject<HTMLElement | null>
}

interface ExerciseTestsModalContentProps {
  exerciseId: string
  exerciseTests: ExerciseTestsController
}

function ExerciseTestsModalContent({ exerciseId, exerciseTests }: ExerciseTestsModalContentProps) {
  const translateLabel = useExerciseTestLabels(exerciseId)

  const displayCases = useMemo(
    () =>
      exerciseTests.testCases.map((row) => ({
        ...row,
        label: translateLabel(row.label),
        detail: row.detail ? translateLabel(row.detail) : undefined,
      })),
    [exerciseTests.testCases, translateLabel]
  )

  return (
    <TestResultModal
      open={exerciseTests.testsModalOpen}
      onOpenChange={exerciseTests.handleTestsModalOpenChange}
      testPhase={exerciseTests.testPhase}
      testCases={displayCases}
      errorMessage={exerciseTests.errorMessage}
    />
  )
}

export function ExerciseTestsSection({
  exercise,
  showSolution,
  playgroundHostRef: playgroundHostProp,
}: ExerciseTestsSectionProps) {
  const t = useTranslations("ExercisePage")
  const fallbackPlaygroundHostRef = useRef<HTMLElement | null>(null)
  const playgroundHostRef = playgroundHostProp ?? fallbackPlaygroundHostRef

  const exerciseTests = useExerciseTests({
    exerciseId: exercise.id,
    showSolution,
    testFile: exercise.testFile,
    playgroundHostRef,
  })

  return (
    <>
      <button
        type="button"
        disabled={exerciseTests.testPhase === "running"}
        onClick={() => exerciseTests.runExerciseTests()}
        className={cn(
          "flex items-center gap-1.5 text-[11px] transition-colors disabled:opacity-50",
          exerciseTests.testPhase === "running"
            ? "text-[var(--color-fg-muted)]"
            : "text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]"
        )}
      >
        <span>{exerciseTests.testPhase === "running" ? t("testsRunning") : t("runTests")}</span>
        <FlaskConical className="h-[13px] w-[13px] shrink-0" strokeWidth={1.8} aria-hidden />
      </button>

      <ExerciseTestsModalContent exerciseId={exercise.id} exerciseTests={exerciseTests} />
    </>
  )
}
