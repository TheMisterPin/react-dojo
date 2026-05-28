export const fetchUserExerciseTestFile = `
async function settle() {
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

export async function runTests() {
  const cases = [];
  const push = (label, ok) => cases.push({ label, ok });

  const root = document.getElementById("root");
  if (!root) return { cases: [{ label: "requiredElementsPresent", ok: false }] };

  const originalFetch = window.fetch;
  const requests = [];

  window.fetch = (url, options) => {
    const pending = deferred();
    const request = { url: String(url), options, pending };
    requests.push(request);
    return pending.promise.then((response) => {
      if (options?.signal?.aborted) {
        throw Object.assign(new Error("aborted"), { name: "AbortError" });
      }
      return response;
    });
  };

  try {
    await settle();
    const buttons = [...root.querySelectorAll("button")];
    const buttonFor = (id) => buttons.find((button) => button.textContent?.trim() === "user " + id);
    const text = () => root.textContent ?? "";

    if (buttons.length < 5) {
      return { cases: [{ label: "requiredElementsPresent", ok: false }] };
    }

    push("fetchRunsWithSignal", requests.length === 1 && Boolean(requests[0]?.options?.signal));
    push("loadingStateShown", text().includes("cargando"));

    buttonFor(2)?.click();
    await settle();
    buttonFor(3)?.click();
    await settle();
    push("buttonsChangeUserImmediately", buttonFor(3)?.style.fontWeight === "700");
    push("staleRequestsAbort", requests[0]?.options?.signal?.aborted && requests[1]?.options?.signal?.aborted);

    requests[1]?.pending.resolve({
      json: async () => ({ name: "Stale User", email: "stale@example.com", company: { name: "Old Co" } }),
    });
    await settle();
    push("staleResponseIgnored", !text().includes("Stale User"));

    requests[2]?.pending.resolve({
      json: async () => ({ name: "Latest User", email: "latest@example.com", company: { name: "New Co" } }),
    });
    await settle();
    push("latestDataShown", text().includes("Latest User") && text().includes("latest@example.com"));

    buttonFor(4)?.click();
    await settle();
    requests[3]?.pending.reject(Object.assign(new Error("aborted"), { name: "AbortError" }));
    await settle();
    push("abortErrorIgnored", !text().includes("error: aborted"));
  } finally {
    window.fetch = originalFetch;
  }

  return { cases };
}
`
