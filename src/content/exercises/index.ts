import { counter } from "./counter"
import { autoFocus } from "./auto-focus"
import { todoList } from "./todo-list"
import { debouncedSearch } from "./debounced-search"
import type { Exercise } from "./types"

export type { Exercise, Difficulty } from "./types"

export const allExercises: Exercise[] = [
  counter,
  autoFocus,
  todoList,
  debouncedSearch,
]

export const exerciseIndex: Record<string, Exercise> = Object.fromEntries(
  allExercises.map((e) => [e.id, e]),
)
