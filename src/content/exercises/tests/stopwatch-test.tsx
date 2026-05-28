export const stopwatchExerciseTestFile = `
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
  const display = root?.querySelector("p");
  const buttons = [...root?.querySelectorAll("button") ?? []];
  const startButton = buttons.find((button) => button.textContent?.trim() === "start");
  const resetButton = buttons.find((button) => button.textContent?.trim() === "reset");
  const timeText = () => display?.textContent?.trim() ?? "";
  const readCentiseconds = () => {
    const match = timeText().match(/^(\\d{2}):(\\d{2})\\.(\\d{2})$/);
    if (!match) return -1;
    return Number(match[1]) * 6000 + Number(match[2]) * 100 + Number(match[3]);
  };

  if (!root || !display || !startButton || !resetButton) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  push("initialTimeZero", timeText() === "00:00.00");
  push("timeFormat", /^\\d{2}:\\d{2}\\.\\d{2}$/.test(timeText()));

  startButton.click();
  await wait(80);
  const runningValue = readCentiseconds();
  const pauseButton = buttons.find((button) => button.textContent?.trim() === "pause");
  push("startAdvancesTime", runningValue > 0 && Boolean(pauseButton));

  pauseButton?.click();
  await settle();
  const pausedValue = readCentiseconds();
  await wait(60);
  push("pauseStopsTime", readCentiseconds() === pausedValue);

  startButton.click();
  await wait(50);
  resetButton.click();
  await settle();
  await wait(40);
  push("resetStopsAndClears", timeText() === "00:00.00" && startButton.textContent?.trim() === "start");

  return { cases };
}
`
