export const themeContextExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  if (!root) return { cases: [{ label: "requiredElementsPresent", ok: false }] };

  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.join(" "));
    originalLog(...args);
  };

  try {
    await settle();
    const buttons = [...root.querySelectorAll("button")];
    const tickButton = buttons.find((button) => button.textContent?.includes("tick"));
    const themeButton = buttons.find((button) => button.textContent?.includes("tema") || button.textContent?.toLowerCase().includes("theme"));
    const text = () => root.textContent ?? "";

    if (!tickButton || !themeButton) {
      return { cases: [{ label: "requiredElementsPresent", ok: false }] };
    }

    push("initialThemeDark", text().includes("dark"));
    logs.length = 0;
    themeButton.click();
    await settle();
    push("themeToggleChangesCard", text().includes("light"));

    logs.length = 0;
    tickButton.click();
    await settle();
    push("tickChangesOnlyParentState", tickButton.textContent?.includes("1"));
    push("toolbarDoesNotRerenderOnTick", logs.every((entry) => !entry.includes("render Toolbar")));
  } finally {
    console.log = originalLog;
  }

  return { cases };
}
`
