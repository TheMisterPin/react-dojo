export const useCallbackExerciseTestFile = `
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
    const counterButton = [...root.querySelectorAll("button")].find((button) => button.textContent?.includes("contador"));
    const listItems = () => [...root.querySelectorAll("li")];

    if (!counterButton || listItems().length === 0) {
      return { cases: [{ label: "requiredElementsPresent", ok: false }] };
    }

    push("initialItemsRender", listItems().length === 5);
    logs.length = 0;
    counterButton.click();
    await settle();
    push("counterIncrements", counterButton.textContent?.includes("1"));
    push("itemsDoNotRerenderOnCounter", logs.every((entry) => !entry.includes("render:")));

    const firstItemText = listItems()[0]?.querySelector("span")?.textContent;
    listItems()[0]?.querySelector("button")?.click();
    await settle();
    push("deleteRemovesOneItem", listItems().length === 4 && !root.textContent?.includes(firstItemText ?? ""));
  } finally {
    console.log = originalLog;
  }

  return { cases };
}
`
