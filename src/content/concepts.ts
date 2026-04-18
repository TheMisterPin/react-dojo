import { estado } from "./estado"
import { efectos } from "./efectos"
import { rendimiento } from "./rendimiento"
import { concurrencia } from "./concurrencia"
import { composicion } from "./composicion"
import type { Category, Concept } from "./types"

export type { Concept, Category, Section } from "./types"

export const allConcepts: Concept[] = [
  ...estado,
  ...efectos,
  ...rendimiento,
  ...concurrencia,
  ...composicion,
]

export const conceptIndex: Record<string, Concept> = Object.fromEntries(
  allConcepts.map((c) => [c.id, c]),
)

export const categories: Category[] = [
  {
    id: "estado",
    kicker: "I",
    title: "Estado y memoria",
    conceptIds: estado.map((c) => c.id),
  },
  {
    id: "efectos",
    kicker: "II",
    title: "Sincronización",
    conceptIds: efectos.map((c) => c.id),
  },
  {
    id: "rendimiento",
    kicker: "III",
    title: "Rendimiento",
    conceptIds: rendimiento.map((c) => c.id),
  },
  {
    id: "concurrencia",
    kicker: "IV",
    title: "Concurrencia",
    conceptIds: concurrencia.map((c) => c.id),
  },
  {
    id: "composicion",
    kicker: "V",
    title: "Composición",
    conceptIds: composicion.map((c) => c.id),
  },
]
