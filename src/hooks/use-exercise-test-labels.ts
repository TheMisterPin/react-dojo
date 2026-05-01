"use client"

import { useCallback } from "react"
import { useLocale, useTranslations } from "next-intl"
import { exerciseTestOverrides } from "@/content/en/tests/index"

export function useExerciseTestLabels(exerciseId: string) {
  const locale = useLocale()
  const t = useTranslations(`ExerciseTests.${exerciseId}`)

  return useCallback(
    (key: string) => {
      if (locale === "en") {
        return exerciseTestOverrides[exerciseId]?.[key] ?? key
      }
      return t(key)
    },
    [locale, exerciseId, t]
  )
}
