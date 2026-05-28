export const lazyModalExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await settle();
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  const text = () => root?.textContent ?? "";
  const openButton = [...root?.querySelectorAll("button") ?? []].find((button) =>
    button.textContent?.includes("abrir")
  );

  if (!root || !openButton) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  push("modalInitiallyAbsent", !root.querySelector("textarea"));

  openButton.click();
  await settle();
  push("firstOpenShowsFallback", text().includes("cargando"));

  await wait(760);
  const textarea = root.querySelector("textarea");
  push("modalAppearsAfterDelay", Boolean(textarea));

  const closeButton = [...root.querySelectorAll("button")].find((button) => button.textContent?.includes("cerrar"));
  closeButton?.click();
  await settle();
  push("closeHidesModal", !root.querySelector("textarea"));

  openButton.click();
  await settle();
  push("reopenUsesCachedModule", Boolean(root.querySelector("textarea")) && !text().includes("cargando"));

  return { cases };
}
`
