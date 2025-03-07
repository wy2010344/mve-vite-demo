import { createBrowserHistory, createHashHistory, Update } from "history";
import { fdom, FDomAttributes } from "mve-dom";
import { batchSignalEnd, createSignal, getValueOrGet, valueOrGetToGet } from "wy-helper";

export const history = createHashHistory()
export const historyState = createSignal<Update>(history)
history.listen(function (update) {
  historyState.set(update)
  batchSignalEnd()
})


export function fLink(props: FDomAttributes<"a">) {
  const href = props.href
  if (href) {
    fdom.a({
      ...props,
      href: 'javascript:void(0)',
      onClick() {
        const value = getValueOrGet(href)
        if (value) {
          history.push(value)
        }
      }
    })
  } else {
    fdom.a(props)
  }
}