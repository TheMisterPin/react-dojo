export const transitionTabsExerciseTestFile = `
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

  const buttons = [...root.querySelectorAll("button")];
  const byLabel = (label) => buttons.find((button) => button.textContent?.includes(label));
  const text = () => root.textContent ?? "";

  const homeButton = byLabel("inicio");
  const slowButton = byLabel("lista lenta");
  const settingsButton = byLabel("ajustes");

  if (!homeButton || !slowButton || !settingsButton) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  push("initialTabRenders", text().includes("Bienvenido"));

  slowButton.click();
  await settle();
  const slowItems = root.querySelectorAll("li");
  push("slowTabRendersList", slowItems.length >= 4000 && text().includes("item 3999"));

  settingsButton.click();
  await settle();
  push("tabsSwitchContent", text().includes("Ajustes"));

  homeButton.click();
  slowButton.click();
  await settle();
  const hasPendingFeedback = [...root.querySelectorAll("button, div")].some((node) =>
    node.textContent?.includes("⏳") || node.style.opacity === "0.5" || node.style.opacity === "0.6"
  );
  push("pendingVisualFeedback", hasPendingFeedback || slowButton.textContent?.includes("lista lenta"));

  return { cases };
}
`
