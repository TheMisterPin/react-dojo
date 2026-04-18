import { useTheme } from "@/hooks/useTheme"
import { Logo } from "@/components/Logo"

export function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--color-line)] px-6">
      <a
        href="#useState"
        className="flex items-center gap-2 text-[14px] text-[var(--color-fg)] hover:text-[var(--color-fg-muted)] transition-colors"
      >
        <Logo className="h-[17px] w-[17px]" />
        <span>react learn</span>
      </a>
      <div className="flex items-center gap-5">
        <a
          href="https://react.dev"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1 text-[13px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          <span>react.dev</span>
          <span
            aria-hidden
            className="text-[11px] leading-none translate-y-[-0.5px] transition-transform group-hover:translate-x-[1px] group-hover:translate-y-[-1.5px]"
          >
            ↗
          </span>
        </a>
        <button
          type="button"
          onClick={toggle}
          aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          className="grid h-7 w-7 place-items-center rounded-md text-[var(--color-fg-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-fg)]"
        >
          {theme === "dark" ? (
            <SunIcon className="h-[15px] w-[15px]" />
          ) : (
            <MoonIcon className="h-[15px] w-[15px]" />
          )}
        </button>
      </div>
    </header>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
