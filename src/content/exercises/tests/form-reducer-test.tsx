export const formReducerExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  const form = root?.querySelector("form");
  const inputs = [...root?.querySelectorAll("input") ?? []];
  const submitButton = root?.querySelector("button");
  const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  const setInput = (input, value) => {
    nativeInputSetter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const text = () => root?.textContent ?? "";

  if (!root || !form || inputs.length < 3 || !submitButton || !nativeInputSetter) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  push("submitDisabledWhenInvalid", submitButton.disabled);

  inputs[0].dispatchEvent(new Event("blur", { bubbles: true }));
  await settle();
  push("blurShowsFieldError", text().includes("email inválido"));

  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  await settle();
  push("submitShowsAllErrors", text().includes("mínimo 6 caracteres") && text().includes("no coincide"));

  setInput(inputs[0], "test@example.com");
  setInput(inputs[1], "secret1");
  setInput(inputs[2], "secret1");
  await settle();
  push("validValuesEnableSubmit", !submitButton.disabled);

  form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  await settle();
  push("successfulSubmitShowsSent", text().includes("enviado"));

  return { cases };
}
`
