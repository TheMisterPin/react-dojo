import type { ReactNode } from "react"

export interface Section {
  heading?: string
  body: ReactNode
}

export interface Concept {
  id: string
  label: string
  kicker: string
  title: string
  lede: string
  sections: Section[]
  playground: ReactNode
  pitfalls?: string[]
}

export interface Category {
  id: string
  kicker: string
  title: string
  conceptIds: string[]
}
