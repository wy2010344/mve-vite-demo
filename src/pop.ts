import { fdom } from "mve-dom";
import { createPop } from "mve-dom-helper";
import { createSignal, emptyArray, EmptyFun, SetValue } from "wy-helper";

export function createTimeoutPop(time: number, body: EmptyFun) {
  const clear = createPop(body)
  setTimeout(clear, time)
  return clear
}


export function toastError(messsage: string) {
  return createTimeoutPop(3000, function () {
    fdom.div({
      className: "daisy-toast daisy-toast-top daisy-toast-center",
      children() {
        fdom.div({
          className: 'daisy-alert daisy-alert-error',
          children() {
            fdom.span({
              childrenType: 'text',
              children: messsage
            })
          }
        })
      }
    })
  })
}

export { createPop };
