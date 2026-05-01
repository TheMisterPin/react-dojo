import type { ExerciseTestCaseResult } from "@/content/exercises/types"

export const EXERCISE_TEST_RUN_MESSAGE_TYPE = "react-dojo-run-tests"
export const EXERCISE_TEST_RESULT_MESSAGE_TYPE = "react-dojo-test-result"
export const EXERCISE_TEST_RESPONSE_TIMEOUT_MS = 10_000

type ParsedExerciseTestMessage =
  | { outcome: "ignore" }
  | { outcome: "error"; error: string }
  | { outcome: "success"; cases: ExerciseTestCaseResult[] }

interface ExerciseTestResultMessage {
  type?: unknown
  requestId?: unknown
  ok?: unknown
  error?: unknown
  payload?: {
    cases?: unknown
  }
}

function isTestCase(row: unknown): row is ExerciseTestCaseResult {
  return (
    typeof row === "object" &&
    row !== null &&
    typeof (row as ExerciseTestCaseResult).label === "string" &&
    typeof (row as ExerciseTestCaseResult).ok === "boolean"
  )
}

export function parseExerciseTestResultMessage(
  raw: unknown,
  expectedRequestId: string
): ParsedExerciseTestMessage {
  const message = raw as ExerciseTestResultMessage

  if (
    message?.type !== EXERCISE_TEST_RESULT_MESSAGE_TYPE ||
    message.requestId !== expectedRequestId
  ) {
    return { outcome: "ignore" }
  }

  if (message.ok === false) {
    return {
      outcome: "error",
      error: typeof message.error === "string" ? message.error : "Test runner failed",
    }
  }

  const cases = message.payload?.cases

  if (!Array.isArray(cases) || !cases.every(isTestCase)) {
    return {
      outcome: "error",
      error: "Invalid test result",
    }
  }

  return { outcome: "success", cases }
}
