export const counterExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  const buttons = [...root?.querySelectorAll("button") ?? []];

  const displayText = () => root?.querySelector("p")?.textContent?.trim() ?? "";
  const byLabel = (text) =>
    buttons.find((button) => button.textContent?.trim() === text);

  const plusButton = byLabel("+");
  const minusButton = byLabel("−");
  const resetButton = byLabel("reset");
  const plusThreeButton = byLabel("+3");

  if (!root || !plusButton || !minusButton || !resetButton || !plusThreeButton) {
    return {
      cases: [
        {
          label: "requiredElementsPresent",
          ok: false,
        },
      ],
    };
  }

  resetButton.click();
  await settle();

  push("resetZero", displayText() === "0");

  plusButton.click();
  await settle();
  push("plusIncrements", displayText() === "1");

  plusButton.click();
  await settle();
  push("liveCountNotHardcoded", displayText() === "2");

  minusButton.click();
  await settle();
  push("minusDecrements", displayText() === "1");

  resetButton.click();
  await settle();

  plusThreeButton.click();
  await settle();
  push("plusThree", displayText() === "3");

  resetButton.click();
  await settle();

  return { cases };
}
`
