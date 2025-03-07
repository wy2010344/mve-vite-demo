import { fdom } from "mve-dom";
import { createSignal, emptyArray, EmptyFun } from "wy-helper";

const toasts = createSignal<{
  id: number
  render: EmptyFun
}[]>(emptyArray as any)

export const getToasts = toasts.get;
let uid = 0
export function createToast(body: EmptyFun) {
  const id = uid++
  toasts.set([
    {
      render: body,
      id,
    },
    ...toasts.get()
  ])
  return () => {
    toasts.set(toasts.get().filter(x => x.id != id))
  }
}


export function createTimeoutToast(time: number, body: EmptyFun) {
  const clear = createToast(body)
  setTimeout(clear, time)
  return clear
}


export function toastError(messsage: string) {
  return createTimeoutToast(3000, function () {
    fdom.div({
      className: 'daisy-alert daisy-alert-error',
      children() {
        fdom.span({
          childrenType: 'text',
          children: messsage
        })
      }
    })
  })
}