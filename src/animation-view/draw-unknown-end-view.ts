import { AnimationConfig, createSignal } from "wy-helper";
import drawCanvasCurve from "./draw-canvas-curve";
import { fdom } from "mve-dom";
import { pointerMove } from "wy-dom-helper";
import { renderContentEditable } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";



export default function ({
  getAnimationFun
}: {
  getAnimationFun(height: number): AnimationConfig
}) {
  const toNegative = createSignal(false)
  drawCanvasCurve({
    getDotList(height) {
      const dir = toNegative.get() ? -1 : 1
      const fun = getAnimationFun(dir * (height))
      const list: number[] = []
      let time = 0
      while (true) {
        const out = fun(time)
        list.push(dir * out[0])
        time = time + 16
        if (out[1]) {
          break
        }
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
          renderContentEditable("div", {
            contentEditable: contentEditableText,
            value() {
              return size.get()
            },
            onValueChange(v: string) {
              let n = Number(v)
              if (isNaN(n)) {
                return
              }
              n = Math.round(n)
              if (n > 0) {
                size.set(n)
              }
            },
          })
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