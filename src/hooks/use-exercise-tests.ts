"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { RefObject } from "react"
import { useTranslations } from "next-intl"
import type { ExerciseTestCaseResult } from "@/content/exercises"
import {
  EXERCISE_TEST_RESPONSE_TIMEOUT_MS,
  EXERCISE_TEST_RUN_MESSAGE_TYPE,
  parseExerciseTestResultMessage,
} from "@/lib/exercise-test-protocol"
import { useProgress } from "@/hooks/useProgress"

interface UseExerciseTestsArgs {
  exerciseId: string
  showSolution: boolean
  testFile?: string
  playgroundHostRef: RefObject<HTMLElement | null>
}

export function useExerciseTests({
  exerciseId,
  showSolution,
  testFile,
  playgroundHostRef,
}: UseExerciseTestsArgs) {
  const t = useTranslations("ExercisePage")
  const { completedExercises, toggleExerciseCompleted } = useProgress()

  const cleanupRef = useRef<(() => void) | null>(null)

  const [testsModalOpen, setTestsModalOpen] = useState(false)
  const [testPhase, setTestPhase] = useState<"idle" | "running" | "done">("idle")
  const [testCases, setTestCases] = useState<ExerciseTestCaseResult[]>([])
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  const resetTestState = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setTestPhase("idle")
    setTestCases([])
    setErrorMessage(undefined)
  }, [])

  useEffect(() => resetTestState, [resetTestState])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetTestState()
    setTestsModalOpen(false)
  }, [exerciseId, showSolution, resetTestState])

  useEffect(() => {
    const passedAllTests =
      testPhase === "done" &&
      !errorMessage &&
      testCases.length > 0 &&
      testCases.every((row) => row.ok)

    if (!testFile || !passedAllTests || completedExercises.has(exerciseId)) return

    toggleExerciseCompleted(exerciseId)
  }, [
    testPhase,
    testFile,
    exerciseId,
    testCases,
    errorMessage,
    completedExercises,
    toggleExerciseCompleted,
  ])

  const handleTestsModalOpenChange = useCallback(
    (open: boolean) => {
      setTestsModalOpen(open)
      if (!open) resetTestState()
    },
    [resetTestState]
  )

  const runExerciseTests = useCallback(() => {
    if (!testFile) return

    resetTestState()
    setTestsModalOpen(true)

    const iframeWindow = playgroundHostRef.current?.querySelector("iframe")?.contentWindow

    if (!iframeWindow) {
      setTestPhase("done")
      setErrorMessage(t("testsPreviewUnavailable"))
      return
    }

    const requestId = crypto.randomUUID?.() ?? `rq-${Math.random().toString(36).slice(2)}`

    setTestPhase("running")

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener("message", onMessage)
      cleanupRef.current = null
    }

    const onMessage = (event: MessageEvent) => {
      const parsed = parseExerciseTestResultMessage(event.data, requestId)
      if (parsed.outcome === "ignore") return

      cleanup()
      setTestPhase("done")

      if (parsed.outcome === "error") {
        setErrorMessage(parsed.error)
        return
      }

      setTestCases(parsed.cases)
    }

    const timeoutId = window.setTimeout(() => {
      cleanup()
      setTestPhase("done")
      setErrorMessage(t("testsTimedOut"))
    }, EXERCISE_TEST_RESPONSE_TIMEOUT_MS)

    cleanupRef.current = cleanup
    window.addEventListener("message", onMessage)

    iframeWindow.postMessage({ type: EXERCISE_TEST_RUN_MESSAGE_TYPE, requestId }, "*")
  }, [testFile, playgroundHostRef, resetTestState, t])

  return {
    testsModalOpen,
    handleTestsModalOpenChange,
    testPhase,
    testCases,
    errorMessage,
    runExerciseTests,
  }
}

export type ExerciseTestsController = ReturnType<typeof useExerciseTests>
