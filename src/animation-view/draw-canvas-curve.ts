import { fdom, renderText } from "mve-dom";
import { hookDraw, hookDrawText, renderCanvas } from "mve-dom-helper/canvasRender";
import { AnimationConfig, createSignal, emptyFun, EmptyFun, GetValue, memo, memoFun, ScrollFromPage, StoreRef } from "wy-helper";
import { themeSignal } from "../themeDropdown";
import { oklch, rgb, formatHex } from "culori";
import { pointerMove, pointerMoveDir } from "wy-dom-helper";
import { renderContentEditable } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";
import { getBaseContentColor, render偏移 } from "./util";

export default function drawCanvasCurve({
  getDotList,
  renderEnd = emptyFun
}: {
  getDotList(height: number): number[]
  renderEnd?: (size: StoreRef<number>, dotList: GetValue<number[]>) => void
}) {
  const transY = createSignal(0)
  const size = createSignal(500)
  function getOuterSize() {
    return size.get() + 10
  }
  const dotList = memo(() => {
    const list = getDotList(size.get())

    return {
      list,
      minEdge: Math.min(0, ...list),
      maxEdge: Math.max(size.get(), ...list)
    }
  })
  function getOutterHeight() {
    return 10 - dotList().minEdge + dotList().maxEdge
  }
  fdom.div({
    className: 'relative select-none ',
    s_transform() {
      return `translateY(${transY.get()}px)`
    },
    s_width() {
      return getOuterSize() + 'px'
    },
    s_height() {
      return getOutterHeight() + 'px'
    },
    children() {
      render偏移(transY)
      const canvas = fdom.canvas({
        className: "rotate-x-180",
        width: getOuterSize,
        height: getOutterHeight
      })
      renderCanvas(canvas, () => {
        hookDraw({
          x: 5,
          y() {
            return 5 - dotList().minEdge
          },
          draw(ctx) {
            const w = size.get()
            const h = w
            const list = dotList().list
            const perWidth = w / (list.length - 1)
            ctx.strokeStyle = getBaseContentColor()

            ctx.beginPath()
            //y轴
            ctx.moveTo(0, 0)
            ctx.lineTo(0, h)
            ctx.stroke()


            //y-right轴
            ctx.moveTo(w, 0)
            ctx.lineTo(w, h)
            ctx.stroke()

            //x轴
            ctx.moveTo(0, 0)
            ctx.lineTo(w, 0)
            ctx.stroke()


            ctx.beginPath()
            ctx.moveTo(0, 0)
            for (let i = 0; i < list.length; i++) {
              const cell = list[i]
              ctx.lineTo(perWidth * i, cell)
            }
            ctx.stroke()
          }
        })
      })
      renderEnd(size, () => dotList().list)
    }
  })
}
