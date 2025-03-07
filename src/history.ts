import { createBrowserHistory, Update } from "history";
import { batchSignalEnd, createSignal } from "wy-helper";

export const history = createBrowserHistory()
export const historyState = createSignal<Update>(history)
history.listen(function (update) {
  historyState.set(update)
  batchSignalEnd()
})