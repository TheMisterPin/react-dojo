import {
  EXERCISE_TEST_RESULT_MESSAGE_TYPE,
  EXERCISE_TEST_RUN_MESSAGE_TYPE,
} from "@/lib/exercise-test-protocol"

export function buildExerciseTestEntryJs(): string {
  const runType = EXERCISE_TEST_RUN_MESSAGE_TYPE
  const resultType = EXERCISE_TEST_RESULT_MESSAGE_TYPE

  return `import { createRoot } from "react-dom/client";
import App from "./App";

const rootEl = document.getElementById("root");
const reactRoot = createRoot(rootEl);
reactRoot.render(<App />);

window.addEventListener("message", (event) => {
  if (!event.data || event.data.type !== "${runType}") return;
  const requestId = event.data.requestId;
  const replyOk = (payload) => {
    event.source?.postMessage(
      {
        type: "${resultType}",
        requestId,
        ok: true,
        payload,
      },
      "*"
    );
  };
  const replyErr = (errorMessage) => {
    event.source?.postMessage(
      {
        type: "${resultType}",
        requestId,
        ok: false,
        error: errorMessage,
      },
      "*"
    );
  };

  import("./tests.js")
    .then((mod) => {
      const runTests = mod.runTests;
      if (typeof runTests !== "function") {
        replyErr("tests.js must export runTests");
        return;
      }
      Promise.resolve(runTests())
        .then((payload) => {
          if (!payload || !Array.isArray(payload.cases)) {
            replyErr("runTests must return { cases: [...] }");
            return;
          }
          replyOk(payload);
        })
        .catch((err) => replyErr(String(err?.message ?? err)));
    })
    .catch((err) => replyErr(String(err?.message ?? err)));
});
`
}
