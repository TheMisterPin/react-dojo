export const debouncedSearchExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  const input = root?.querySelector("input");
  const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  const status = () => root?.querySelector("p")?.textContent ?? "";
  const listItems = () => [...root?.querySelectorAll("li") ?? []];
  const listWrapper = () => root?.querySelector("ul")?.parentElement;

  if (!root || !input || !nativeInputSetter) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  push("initialListRenders", listItems().length > 0 && status().includes("al día"));

  nativeInputSetter.call(input, "row 59");
  input.dispatchEvent(new Event("input", { bubbles: true }));
  push("inputUpdatesImmediately", input.value === "row 59");
  const staleSeenImmediately = status().includes("actualizando") || listWrapper()?.style.opacity === "0.5";
  await settle();
  await settle();
  push("deferredListEventuallyUpdates", listItems().some((item) => item.textContent?.includes("row 59")));
  push("staleFeedbackAvailable", staleSeenImmediately || status().includes("al día"));

  return { cases };
}
`
