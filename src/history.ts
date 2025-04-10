import { createBrowserHistory, createHashHistory, Update } from "history";
import { fdom, FDomAttributes } from "mve-dom";
import { batchSignalEnd, createSignal, getValueOrGet, memo, valueOrGetToGet } from "wy-helper";

export const history = createHashHistory()
const historyState = createSignal<Update>(history)
history.listen(function (update) {
  historyState.set(update)
  batchSignalEnd()
})


export const getHistoryState = memo(() => {
  const state = historyState.get()
  let pathname = decodeURI(state.location.pathname)
  if (pathname.startsWith('/')) {
    pathname = pathname.slice(1)
  }
  return {
    pathname,
    action: state.action,
    hash: state.location.hash,
    search: new URLSearchParams(state.location.search) as ReadURLSearchParam
  }
})

export type ReadURLSearchParam = Omit<URLSearchParams, 'append' | 'delete' | 'set'>

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