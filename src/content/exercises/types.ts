import type { SandpackFiles } from "@codesandbox/sandpack-react"

export type Difficulty = "básico" | "intermedio" | "avanzado"

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
}
