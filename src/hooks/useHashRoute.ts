import { useEffect, useState } from "react"

const DEFAULT_ROUTE = "useState"

function readHash() {
  if (typeof window === "undefined") return DEFAULT_ROUTE
  const raw = window.location.hash.slice(1).trim()
  return raw || DEFAULT_ROUTE
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const onChange = () => setRoute(readHash())
    window.addEventListener("hashchange", onChange)
    return () => window.removeEventListener("hashchange", onChange)
  }, [])
  return route
}

export function navigate(id: string) {
  if (typeof window === "undefined") return
  if (window.location.hash.slice(1) === id) return
  window.location.hash = id
}
