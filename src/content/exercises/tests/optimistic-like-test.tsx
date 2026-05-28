export const optimisticLikeExerciseTestFile = `
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
  const button = root?.querySelector("button");
  const buttonText = () => button?.textContent ?? "";
  const readLikes = () => Number(buttonText().match(/\\d+/)?.[0] ?? -1);

  if (!root || !button) {
    return { cases: [{ label: "requiredElementsPresent", ok: false }] };
  }

  const originalRandom = Math.random;

  try {
    push("initialLikes", readLikes() === 42);

    Math.random = () => 0.9;
    button.click();
    await settle();
    push("optimisticIncrementImmediate", readLikes() === 43);
    push("pendingVisualState", button.disabled || button.style.opacity === "0.7" || button.getAttribute("disabled") !== null);
    await wait(900);
    push("successCommitsLike", readLikes() === 43 && buttonText().includes("❤️"));

    Math.random = () => 0;
    button.click();
    await settle();
    const optimisticUnlike = readLikes();
    await wait(900);
    push("failureRevertsOptimisticLike", optimisticUnlike === 42 && readLikes() === 43);
  } finally {
    Math.random = originalRandom;
  }

  return { cases };
}
`
