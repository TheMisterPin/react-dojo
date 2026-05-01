"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ExerciseTestCaseResult } from "@/content/exercises"

interface TestResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testPhase: "idle" | "running" | "done"
  testCases: ExerciseTestCaseResult[]
  errorMessage?: string
}

export function TestResultModal({
  open,
  onOpenChange,
  testPhase,
  testCases,
  errorMessage,
}: TestResultModalProps) {
  const t = useTranslations("ExercisePage")

  const totalChecks = testCases.length
  const passedChecks = testCases.filter((row) => row.ok).length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-4 border-[var(--color-line)] bg-[var(--color-bg)] text-[var(--color-fg-muted)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-[15px] text-[var(--color-fg)]">
            {t("testsModalTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="text-[13px] leading-relaxed">
          {testPhase === "running" ? <p>{t("testsRunning")}</p> : null}

          {errorMessage ? <p className="text-[var(--color-fg)]">{errorMessage}</p> : null}

          {totalChecks > 0 && !errorMessage ? (
            <p className="mb-3 font-mono text-[12px] text-[var(--color-fg-dim)]">
              {t("testsSummary", { passed: passedChecks, total: totalChecks })}
            </p>
          ) : null}

          {testCases.length > 0 ? (
            <ul className="space-y-2">
              {testCases.map((testCaseRow, index) => (
                <li
                  key={`${testCaseRow.label}-${index}`}
                  className="flex items-start gap-2 text-[13px]"
                >
                  {testCaseRow.ok ? (
                    <CheckCircle2
                      className="mt-[2px] h-[14px] w-[14px] shrink-0 text-green-600 dark:text-green-400"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  ) : (
                    <XCircle
                      className="mt-[2px] h-[14px] w-[14px] shrink-0 text-red-600 dark:text-red-400"
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  )}
                  <span>
                    <span className="text-[var(--color-fg)]">{testCaseRow.label}</span>
                    {!testCaseRow.ok && testCaseRow.detail ? (
                      <span className="block text-[12px] text-[var(--color-fg-dim)]">
                        {testCaseRow.detail}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" type="button" />}>
            {t("testsClose")}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
