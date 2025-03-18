import { fdom } from "mve-dom";
import { hookDraw, hookDrawText, renderCanvas } from "mve-dom-helper/canvasRender";
import { AnimationConfig, createSignal, memo } from "wy-helper";
import { themeSignal } from "./themeDropdown";
import { oklch, rgb, formatHex } from "culori";


const getBaseContentColor = memo(() => {
  themeSignal.get()
  const color = getCSSVariable('--color-base-content')
  return formatHex(rgb(color)) || ''
})
export default function drawCanvasCurve({
  getAnimationFun
}: {
  getAnimationFun(height: number): AnimationConfig
}) {
  const width = createSignal(510)
  const height = createSignal(510)

  const toNegative = createSignal(false)
  fdom.div({
    className: 'relative',
    children() {

      const canvas = fdom.canvas({
        width: width.get,
        height: height.get
      })

      const dotList = memo(() => {
        const dir = toNegative.get() ? -1 : 1
        const fun = getAnimationFun(dir * (height.get() - 10))
        const list: number[] = []
        let time = 0
        while (true) {
          const out = fun(time)
          list.push(out[0])
          time = time + 16
          if (out[1]) {
            break
          }
        }
        return list
      })
      renderCanvas(canvas, () => {
        hookDraw({
          x: 5,
          y: 5,
          draw(ctx) {
            const w = width.get() - 10
            const h = height.get() - 10
            const list = dotList()
            const perWidth = w / (list.length - 1)
            ctx.strokeStyle = getBaseContentColor()
            // // 将坐标原点移动到画布的左下角
            ctx.translate(0, h);
            // // 将 y 轴翻转
            if (!toNegative.get()) {
              ctx.scale(1, -1);
            }

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
          fdom.div({

            childrenType: "text",
            children() {
              const list = dotList()
              return `用时  ${(list.length - 1) * 16 / 1000}s`
            }
          })
        }
      })
    }
  })
}



function getCSSVariable(variableName: string, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
}