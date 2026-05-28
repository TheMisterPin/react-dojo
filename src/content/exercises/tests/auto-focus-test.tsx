/* eslint-disable no-useless-escape */
export const autoFocusExerciseTestFile = `
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const container = document.createElement("div");
  document.body.append(container);
  const reactRoot = createRoot(container);

  try {
    reactRoot.render(createElement(App));
    await settle();

    const input = container.querySelector("input");
    const buttons = [...container.querySelectorAll("button")];

    const byLabel = (...labels) =>
      buttons.find((button) => labels.includes(button.textContent?.trim()));

    const focusButton = byLabel("Focus", "Enfocar");
    const clearButton = byLabel("Clear", "Limpiar");
    const statusDisplay = container.querySelector("p");
    const displayText = () => statusDisplay?.textContent ?? "";
    const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

    if (!input || !focusButton || !clearButton || !statusDisplay || !nativeInputSetter) {
      return { cases: [{ label: "requiredElementsPresent", ok: false }] };
    }

    const wasFocusedOnMount = document.activeElement === input;
    const rendersBefore = Number(displayText().match(/renders:\s*(\d+)/)?.[1] ?? -1);

    push("inputFocusesOnMount", wasFocusedOnMount);

    input.blur();
    await settle();
    focusButton.click();
    await settle();
    push("focusButtonFocusesInput", document.activeElement === input);

    input.blur();
    await settle();
    nativeInputSetter.call(input, "hello");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await settle();
    push("inputIsControlled", displayText().includes('"hello"'));

    const rendersAfter = Number(displayText().match(/renders:\s*(\d+)/)?.[1] ?? -1);
    push("renderCounterInRef", rendersAfter > rendersBefore && rendersAfter > 0);

    clearButton.click();
    await settle();
    push(
      "clearResetsText",
      input.value === "" && !displayText().includes('"hello"') && document.activeElement === input
    );

    return { cases };
  } finally {
    reactRoot.unmount();
    container.remove();
  }
}
`
