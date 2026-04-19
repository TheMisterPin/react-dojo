import { useEffect, useMemo, useRef, useState } from "react"
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
  useSandpack,
  type SandpackFiles,
  type SandpackPredefinedTemplate,
  type SandpackThemeProp,
} from "@codesandbox/sandpack-react"
import { useTheme, type Theme } from "@/hooks/useTheme"

const darkTheme: SandpackThemeProp = {
  colors: {
    surface1: "#0f0f11",
    surface2: "#131316",
    surface3: "#1c1c20",
    clickable: "#64636e",
    base: "#ddd8d0",
    disabled: "#46454f",
    hover: "#f0ece6",
    accent: "#c4956a",
    error: "#c98b82",
    errorSurface: "rgba(201, 139, 130, 0.07)",
  },
  syntax: {
    plain: "#d4cfc8",
    comment: { color: "#4e4d59", fontStyle: "italic" },
    keyword: "#c4956a",
    tag: "#c48878",
    punctuation: "#5e5c68",
    definition: "#e0dbd4",
    property: "#8babcc",
    static: "#b49aca",
    string: "#87a89d",
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
    surface1: "#f5f3ee",
    surface2: "#ede9e0",
    surface3: "#e4e0d6",
    clickable: "#72706a",
    base: "#2e2b26",
    disabled: "#b0ada6",
    hover: "#1a1915",
    accent: "#7a5a3d",
    error: "#9e4530",
    errorSurface: "rgba(158, 69, 48, 0.08)",
  },
  syntax: {
    plain: "#3a342d",
    comment: { color: "#9e9b94", fontStyle: "italic" },
    keyword: "#7a5a3d",
    tag: "#8d5840",
    punctuation: "#9c9890",
    definition: "#1e1b16",
    property: "#4a6880",
    static: "#6b4a82",
    string: "#3d6b60",
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
          bg: "#0f0f11",
          surface1: "#141417",
          surface2: "#1c1c20",
          fg: "#e8e3dc",
          fgMuted: "#8a8a8f",
          fgDim: "#5c5c61",
          line: "rgba(255,255,255,0.06)",
          lineStrong: "rgba(255,255,255,0.14)",
          lineHover: "rgba(255,255,255,0.24)",
          codeBg: "#141417",
          accent: "#c4956a",
        }
      : {
          colorScheme: "light",
          bg: "#f5f3ee",
          surface1: "#ede9e0",
          surface2: "#e4e0d6",
          fg: "#1a1915",
          fgMuted: "#6b6966",
          fgDim: "#a29f97",
          line: "rgba(0,0,0,0.07)",
          lineStrong: "rgba(0,0,0,0.14)",
          lineHover: "rgba(0,0,0,0.26)",
          codeBg: "#ede9e0",
          accent: "#7a5a3d",
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
  padding: 5px 12px;
  border-radius: 5px;
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
  border-radius: 5px;
  font-family: inherit;
  font-size: 13px;
}
input:focus, select:focus, textarea:focus {
  outline: 1px solid ${t.accent};
  outline-offset: 1px;
  border-color: transparent;
}
input[type="range"] { padding: 0; border: none; }
code, pre { font-family: ui-monospace, "Geist Mono", "SF Mono", Menlo, monospace; }
code { color: ${t.fg}; padding: 0 2px; font-size: 0.9em; }
pre {
  background: ${t.codeBg};
  border: 1px solid ${t.line};
  border-radius: 5px;
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

// Updates only /styles.css when theme changes — without touching user code
function ThemeSync({ theme }: { theme: Theme }) {
  const { sandpack } = useSandpack()
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    sandpack.updateFile("/styles.css", buildStyles(theme))
  }, [theme]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
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
  height = 650,
  dependencies,
}: PlaygroundProps) {
  const { theme } = useTheme()

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

  // theme intentionally excluded — ThemeSync handles CSS updates imperatively
  const initialFiles = useMemo(
    () => ({ "/styles.css": { code: buildStyles(theme), hidden: true }, ...files }),
    [files], // eslint-disable-line react-hooks/exhaustive-deps
  )

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
          className="cursor-pointer flex items-center gap-1.5 text-[11px] text-[var(--color-fg-dim)] transition-colors hover:text-[var(--color-fg)]"
          aria-label={maximized ? "Minimizar editor" : "Maximizar editor"}
        >
          <span className="capitalize">{maximized ? "Minimizar" : "Maximizar"}</span>
          <span aria-hidden className="text-[13px] leading-none">
            {maximized ? "⤡" : "⤢"}
          </span>
        </button>
      </div>

      <div className={maximized ? "min-h-0 flex-1" : ""}>
        <SandpackProvider
          template={template}
          theme={theme === "dark" ? darkTheme : lightTheme}
          files={initialFiles}
          customSetup={dependencies ? { dependencies } : undefined}
        >
          <ThemeSync theme={theme} />
          <SandpackLayout>
            <SandpackCodeEditor
              showLineNumbers
              showInlineErrors
              showTabs={Object.keys(files).length > 1}
              style={{ height: editorHeight, flex: "65 65 0%" }}
            />
            <SandpackPreview
              showOpenInCodeSandbox={false}
              style={{ height: editorHeight, flex: "35 35 0%" }}
            />
          </SandpackLayout>
          {showConsole && <SandpackConsole style={{ height: 200 }} />}
        </SandpackProvider>
      </div>
    </div>
  )
}
