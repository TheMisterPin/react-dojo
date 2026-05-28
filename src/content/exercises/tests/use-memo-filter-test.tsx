export const useMemoFilterExerciseTestFile = `
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
  const select = root?.querySelector("select");
  const counterButton = [...root?.querySelectorAll("button") ?? []].find((button) =>
    button.textContent?.includes("contador")
  );
  const listItems = () => [...root?.querySelectorAll("li") ?? []];
  const summaryText = () => [...root?.querySelectorAll("p") ?? []].map((node) => node.textContent ?? "").join(" ");
  const nativeInputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;

  if (!root || !input || !select || !counterButton || !nativeInputSetter) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  const logs = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logs.push(args.join(" "));
    originalLog(...args);
  };

  try {
    await settle();
    logs.length = 0;
    push("listRenders", listItems().length > 0 && summaryText().includes("500"));

    nativeInputSetter.call(input, "deploy");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await settle();
    push("queryFiltersList", summaryText().includes("100") && listItems()[0]?.textContent?.includes("deploy"));

    select.value = "desc";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await settle();
    const firstDescendingItem = listItems()[0]?.textContent ?? "";
    push("orderChangesSort", firstDescendingItem.includes("deploy #99"));

    logs.length = 0;
    counterButton.click();
    await settle();
    push("counterDoesNotRecalculate", counterButton.textContent?.includes("1") && logs.every((entry) => !entry.includes("recalculando lista")));
  } finally {
    console.log = originalLog;
  }

  return { cases };
}
`
