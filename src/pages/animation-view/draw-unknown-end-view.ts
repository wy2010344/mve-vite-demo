import { createSignal, DeltaXSignalAnimationConfig, numberStoreTranfrom, SetValue, SilentDiff } from "wy-helper";
import drawCanvasCurve from "./draw-canvas-curve";
import { fdom } from "mve-dom";
import { pointerMove } from "wy-dom-helper";
import { renderContentEditableTrans } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";


function fakeSubscribeRequestAnimateFrame(
  callback: (time: number) => any,
  onFinish?: SetValue<boolean>): () => void {
  let canceled = false
  function cancel() {
    onFinish?.(false)
    canceled = true
  }
  let i = 0
  while (true) {
    const nexti = i + 16
    const b = callback(nexti)
    i = nexti
    if (b) {
      break
    }
  }
  onFinish?.(true)
  return cancel
}


export default function ({
  getAnimationFun
}: {
  getAnimationFun(absHeight: number): {
    rewriteHeight?: number
    callback: DeltaXSignalAnimationConfig
  }
}) {
  const toNegative = createSignal(false)
  drawCanvasCurve({
    getDotList(height) {

      const dir = toNegative.get() ? -1 : 1
      const list: number[] = []
      let value = 0
      const animationFun = getAnimationFun(height)

      let realHeight = height
      let pc = 1
      if (animationFun.rewriteHeight) {
        pc = height / animationFun.rewriteHeight
        realHeight = animationFun.rewriteHeight
      }
      const fun = animationFun.callback(dir * realHeight)
      const callback = fun(new SilentDiff({
        get() {
          return value
        },
        set(v) {
          list.push(dir * v * pc)
          value = v
        },
      }))
      if (callback) {
        fakeSubscribeRequestAnimateFrame(callback)
      }
      return list
    },
    renderEnd(size, dotList) {
      fdom.div({
        className: 'absolute w-3 h-3 right-0 bottom-0 bg-accent cursor-nwse-resize',
        onPointerDown(e) {
          let lastE: PointerEvent = e
          function didMove(e: PointerEvent) {
            const deltaX = Math.round(e.pageX - lastE.pageX)
            // const deltaY = e.pageY - lastE.pageY
            size.set(size.get() + deltaX)
            lastE = e
          }
          pointerMove({
            onMove: didMove,
            onEnd: didMove,
          })
        }
      })
      fdom.div({
        className: "absolute bottom-2 right-2 flex gap-1 items-center",
        children() {
          fdom.button({
            className: "daisy-btn",
            childrenType: "text",
            children() {
              return toNegative.get() ? '负' : '正'
            },
            onClick() {
              toNegative.set(!toNegative.get())
            }
          })
          renderContentEditableTrans(numberStoreTranfrom, size.get, function (n) {

            n = Math.round(n)
            if (n > 0) {
              size.set(n)
            }
          }, fdom.div({
            contentEditable: contentEditableText,
          }))
          fdom.div({
            childrenType: "text",
            children() {
              const list = dotList()
              return `px 用时  ${(list.length - 1) * 16 / 1000}s`
            }
          })
        }
      })
    }
  })
}