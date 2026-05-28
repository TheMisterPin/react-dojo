export const actionFormExerciseTestFile = `
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
  const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  const text = () => root?.textContent ?? "";
  const getFormParts = () => ({
    form: root?.querySelector("form"),
    inputs: [...root?.querySelectorAll("input") ?? []],
    button: root?.querySelector("button"),
  });
  const setInput = (input, value) => {
    nativeInputSetter?.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const submit = async () => {
    const { form } = getFormParts();
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await settle();
  };

  if (!root || !nativeInputSetter) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  let parts = getFormParts();
  if (!parts.form || parts.inputs.length < 2 || !parts.button) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  setInput(parts.inputs[0], "ab");
  setInput(parts.inputs[1], "valid@example.com");
  await submit();
  await wait(950);
  push("invalidUsernameShowsError", text().includes("mínimo 3"));

  parts = getFormParts();
  setInput(parts.inputs[0], "alice");
  setInput(parts.inputs[1], "invalid-email");
  await submit();
  await wait(950);
  push("invalidEmailShowsError", text().includes("Email inválido"));

  parts = getFormParts();
  setInput(parts.inputs[0], "alice");
  setInput(parts.inputs[1], "alice@example.com");
  await submit();
  parts = getFormParts();
  push("pendingDisablesControls", Boolean(parts.button?.disabled) && parts.inputs.every((input) => input.disabled));
  await wait(950);
  push("validSubmitShowsWelcome", text().includes("@alice"));

  return { cases };
}
`
