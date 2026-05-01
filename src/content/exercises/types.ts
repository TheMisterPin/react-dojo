import type { SandpackFiles } from "@codesandbox/sandpack-react"

export type Difficulty = "basic" | "intermediate" | "advanced"

/** Resultado de una sola aserción reportada por /tests.js dentro del iframe de Sandpack */
export interface ExerciseTestCaseResult {
  label: string
  ok: boolean
  detail?: string
}

/** Resultado agregado de las comprobaciones automáticas del ejercicio */
export interface ExerciseTestRunResult {
  cases: ExerciseTestCaseResult[]
}

export interface Exercise {
  id: string
  label: string
  title: string
  lede: string
  difficulty: Difficulty
  objectives: string[]
  hint?: string
  starter: SandpackFiles
  solution: SandpackFiles
  /** IDs de conceptos relacionados (enlazan a las páginas de concepto) */
  relatedConcepts?: string[]
  /** Dependencias npm extra para el Playground (ej. react 19) */
  dependencies?: Record<string, string>
  /**
   * Fuente para `/tests.js` oculto: debe `export`ar una función asíncrona o sincrónica `runTests()`
   * que devuelve `{ cases: ExerciseTestCaseResult[] }`. Se ejecuta en el iframe de vista previa contra `#root`.
   */
  testFile?: string
}
