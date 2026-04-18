import { useEffect, useMemo, useState } from "react"
import {
  Sandpack,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
  type SandpackThemeProp,
} from "@codesandbox/sandpack-react"
import { useTheme, type Theme } from "@/hooks/useTheme"

const darkTheme: SandpackThemeProp = {
  colors: {
    surface1: "#0c0c0d",
    surface2: "#101012",
    surface3: "#17171a",
    clickable: "#8a8a8f",
    base: "#d7d3c9",
    disabled: "#4e4e52",
    hover: "#ededed",
    accent: "#d7d3c9",
    error: "#c98b82",
    errorSurface: "rgba(201, 139, 130, 0.08)",
  },
  syntax: {
    plain: "#d7d3c9",
    comment: { color: "#55545a", fontStyle: "italic" },
    keyword: "#c5a890",
    tag: "#c0a090",
    punctuation: "#6d6a6f",
    definition: "#e8e2d4",
    property: "#9aa4b0",
    static: "#b8a3c4",
    string: "#8fa3a1",
  },
  font: {
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
    size: "13.5px",
    lineHeight: "22px",
  },
}

const lightTheme: SandpackThemeProp = {
  colors: {
    surface1: "#faf9f5",
    surface2: "#f1efe6",
    surface3: "#e8e5d9",
    clickable: "#6b6966",
    base: "#3a342d",
    disabled: "#b5b2ac",
    hover: "#1a1915",
    accent: "#3a342d",
    error: "#9e4530",
    errorSurface: "rgba(158, 69, 48, 0.08)",
  },
  syntax: {
    plain: "#3a342d",
    comment: { color: "#a29f97", fontStyle: "italic" },
    keyword: "#7a5a3d",
    tag: "#8d5840",
    punctuation: "#a09c93",
    definition: "#2a261f",
    property: "#5a6a7a",
    static: "#6b4a82",
    string: "#446864",
  },
  font: {
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
    size: "13.5px",
    lineHeight: "22px",
  },
}

function buildStyles(theme: Theme): string {
  const t =
    theme === "dark"
      ? {
          colorScheme: "dark",
          bg: "#0c0c0d",
          surface1: "#131315",
          surface2: "#1a1a1c",
          fg: "#ededed",
          fgMuted: "#8a8a8f",
          fgDim: "#5c5c61",
          line: "rgba(255,255,255,0.06)",
          lineStrong: "rgba(255,255,255,0.14)",
          lineHover: "rgba(255,255,255,0.24)",
          codeBg: "#131315",
          accent: "#ededed",
        }
      : {
          colorScheme: "light",
          bg: "#faf9f5",
          surface1: "#f1efe6",
          surface2: "#e8e5d9",
          fg: "#1a1915",
          fgMuted: "#6b6966",
          fgDim: "#a29f97",
          line: "rgba(0,0,0,0.07)",
          lineStrong: "rgba(0,0,0,0.16)",
          lineHover: "rgba(0,0,0,0.28)",
          codeBg: "#f1efe6",
          accent: "#1a1915",
        }

  return `:root {
  color-scheme: ${t.colorScheme};
  --bg: ${t.bg};
  --surface-1: ${t.surface1};
  --surface-2: ${t.surface2};
  --fg: ${t.fg};
  --fg-muted: ${t.fgMuted};
  --fg-dim: ${t.fgDim};
  --line: ${t.line};
  --line-strong: ${t.lineStrong};
  --accent: ${t.accent};
}
* { box-sizing: border-box; }
body {
  margin: 0;
  padding: 0;
  background: ${t.bg};
  color: ${t.fg};
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 13px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
button {
  background: transparent;
  color: ${t.fg};
  border: 1px solid ${t.lineStrong};
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12.5px;
  transition: background 120ms, border-color 120ms;
}
button:hover { background: ${t.line}; border-color: ${t.lineHover}; }
button:focus-visible { outline: 1px solid ${t.accent}; outline-offset: 2px; }
input, select, textarea {
  background: transparent;
  color: ${t.fg};
  border: 1px solid ${t.lineStrong};
  padding: 7px 10px;
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
}
input:focus, select:focus, textarea:focus { outline: 1px solid ${t.accent}; outline-offset: 1px; border-color: transparent; }
input[type="range"] { padding: 0; border: none; }
code, pre { font-family: ui-monospace, "Geist Mono", "SF Mono", Menlo, monospace; }
code { color: ${t.fg}; padding: 0 2px; font-size: 0.9em; }
pre {
  background: ${t.codeBg};
  border: 1px solid ${t.line};
  border-radius: 4px;
  padding: 12px;
  overflow: auto;
  font-size: 12px;
  color: ${t.fg};
}
a { color: ${t.fg}; }
hr { border: 0; border-top: 1px solid ${t.line}; margin: 14px 0; }
::selection { background: ${t.fg}; color: ${t.bg}; }
`
}

interface PlaygroundProps {
  files: SandpackFiles
  template?: SandpackPredefinedTemplate
  showConsole?: boolean
  height?: number
  dependencies?: Record<string, string>
}

export function Playground({
  files,
  template = "react",
  showConsole = false,
  height = 420,
  dependencies,
}: PlaygroundProps) {
  const { theme } = useTheme()

  const merged: SandpackFiles = useMemo(
    () => ({ "/styles.css": buildStyles(theme), ...files }),
    [theme, files],
  )

  const [maximized, setMaximized] = useState(false)
  const [editorHeight, setEditorHeight] = useState(height)

  useEffect(() => {
    if (!maximized) {
      setEditorHeight(height)
      return
    }

    const updateHeight = () => setEditorHeight(window.innerHeight - 64)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMaximized(false)
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    window.addEventListener("keydown", onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("resize", updateHeight)
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [maximized, height])

  return (
    <div
      className={
        maximized
          ? "fixed inset-0 z-50 flex flex-col bg-[var(--color-bg)] p-4"
          : "relative my-2"
      }
    >
      <div className="mb-1.5 flex items-center justify-end">
        <button
          onClick={() => setMaximized((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
          aria-label={maximized ? "Minimizar editor" : "Maximizar editor"}
        >
          <span>{maximized ? "minimizar" : "maximizar"}</span>
          <span aria-hidden className="text-[13px] leading-none">
            {maximized ? "⤡" : "⤢"}
          </span>
        </button>
      </div>

      <div className={maximized ? "min-h-0 flex-1" : ""}>
        <Sandpack
          key={theme}
          template={template}
          theme={theme === "dark" ? darkTheme : lightTheme}
          files={merged}
          customSetup={dependencies ? { dependencies } : undefined}
          options={{
            showLineNumbers: true,
            showInlineErrors: true,
            showTabs: Object.keys(files).length > 1,
            showConsole,
            showConsoleButton: true,
            editorHeight,
            editorWidthPercentage: 52,
          }}
        />
      </div>
    </div>
  )
}
