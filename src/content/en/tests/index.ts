/** English-only overrides for automated exercise test labels (same pattern as `content/en/exercises`). */

export type ExerciseTestLabelOverrides = Partial<Record<string, string>>

export const exerciseTestOverrides: Record<string, ExerciseTestLabelOverrides> = {
  counter: {
    previewMissing: "Exercise preview",
    plusIncrements: "+ increments by one",
    liveCountNotHardcoded: "counter shows live count (not a hardcoded 0)",
    minusDecrements: "− decrements",
    resetZero: "reset sets display to 0",
    plusThree: "+3 adds three",
    detailMissingRoot: "missing #root",
  },
}
