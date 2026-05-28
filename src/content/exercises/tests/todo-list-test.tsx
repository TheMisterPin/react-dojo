export const todoListExerciseTestFile = `
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
  const input = root?.querySelector("input");
  const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  const items = () => [...root?.querySelectorAll("li") ?? []];
  const setInput = (value) => {
    nativeInputSetter?.call(input, value);
    input?.dispatchEvent(new Event("input", { bubbles: true }));
  };
  const submit = async (value) => {
    setInput(value);
    form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await settle();
  };

  if (!root || !form || !input || !nativeInputSetter) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  await submit("  aprender refs  ");
  push("submitAddsTrimmedItem", items().length === 1 && items()[0]?.textContent?.includes("aprender refs"));

  await submit("   ");
  push("emptySubmitDoesNotAdd", items().length === 1);

  await submit("probar reducer");
  push("multipleItemsUseIds", items().length === 2 && items().some((item) => item.textContent?.includes("probar reducer")));

  const firstText = items()[0]?.querySelector("span");
  firstText?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  await settle();
  push("clickTextTogglesDone", items()[0]?.style.textDecoration.includes("line-through"));

  const removeButtons = [...root.querySelectorAll("button")];
  removeButtons[0]?.click();
  await settle();
  push("removeDeletesOnlyOneItem", items().length === 1 && !items()[0]?.textContent?.includes("aprender refs"));

  return { cases };
}
`
