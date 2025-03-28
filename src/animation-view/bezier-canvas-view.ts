import { dom, fdom } from "mve-dom";
import { hookDraw, renderCanvas } from "mve-dom-helper/canvasRender";
import { createSignal, StoreRef, cubicBezier, memo, EmptyFun, numberStoreTranfrom } from "wy-helper";
import { NumberRange, } from "../renderRange";
import { pointerMove } from "wy-dom-helper";
import { renderContentEditable, renderContentEditableTrans } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";
import { getBaseContentColor, getCssVariableColor, render偏移 } from "./util";



export default function () {


  const transY = createSignal(0)
  const beforeHeight = createSignal(0)
  const afterHeight = createSignal(0)

  const size = createSignal(500)
  function getOuterWidth() {
    return size.get() + 10
  }
  function getOuterHeight() {
    return size.get() + 10 + beforeHeight.get() + afterHeight.get()

  }
  const x1 = createSignal(0.5)
  const y1 = createSignal(0.25)
  const x2 = createSignal(0.5)
  const y2 = createSignal(0.75)
  fdom.div({
    className: 'relative select-none',
    s_transform() {
      return `translateY(${transY.get()}px)`
    },
    children() {
      render偏移(transY)
      const dotList = memo(() => {
        const get = cubicBezier(x1.get(), y1.get(), x2.get(), y2.get())
        const max = size.get()
        const per = 1 / max
        const list: number[] = []
        for (let i = 0; i <= max; i++) {
          list.push(get(i * per))
        }
        return list
      })

      renderCanvas({
        className: 'rotate-x-180',
        width: getOuterWidth,
        height: getOuterHeight
      }, () => {
        hookDraw({
          y() {
            return 5 + beforeHeight.get()
          },
          x: 5,
          draw(ctx) {
            const w = size.get()
            const h = w

            ctx.strokeStyle = getBaseContentColor()
            // // 将坐标原点移动到画布的左下角
            // ctx.translate(0, h);
            // ctx.scale(1, -1);

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

            const scale = size.get()
            const x_1 = x1.get()
            const y_1 = y1.get()
            const x_2 = x2.get()
            const y_2 = y2.get()


            ctx.beginPath()
            //绘制canvas曲线
            ctx.moveTo(0, 0)
            ctx.bezierCurveTo(
              x_1 * scale,
              y_1 * scale,

              x_2 * scale,
              y_2 * scale,

              scale,
              scale,
            )

            ctx.stroke()

            //绘制js曲线
            ctx.beginPath()
            const list = dotList()
            ctx.moveTo(0, 0)
            for (let i = 0; i < list.length; i++) {
              ctx.lineTo(i, list[i] * scale)
            }

            ctx.strokeStyle = getCssVariableColor('--color-primary')
            ctx.stroke()



            ctx.strokeStyle = getCssVariableColor('--color-secondary')
            ctx.beginPath()
            //连线1
            ctx.moveTo(0, 0)
            ctx.lineTo(x_1 * scale, y_1 * scale)
            ctx.stroke()

            ctx.beginPath()
            //连线2
            ctx.moveTo(scale, scale)
            ctx.lineTo(x_2 * scale, y_2 * scale)
            ctx.stroke()

          },
          children() {
            function didChange() {
              const min = -Math.min(0, y1.get(), y2.get())
              beforeHeight.set(Math.ceil(min * size.get()))
              const max = Math.max(1, y1.get(), y2.get())
              afterHeight.set(Math.ceil((max - 1) * size.get()))
            }
            drawControl(x1, y1, size, didChange)
            drawControl(x2, y2, size, didChange)
          },
        })
      })
    }
  })
  fdom.div({
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`cubic-bezier动画`
      renderInput('x1', x1)
      renderInput('y1', y1)
      renderInput('x2', x2)
      renderInput('y2', y2)

      fdom.div({
        childrenType: 'text',
        children() {
          return `cubic-bezier(${x1.get()}, ${y1.get()}, ${x2.get()}, ${y2.get()})`
        }
      })
    }
  })
}


function renderInput(label: string, value: StoreRef<number>) {
  fdom.div({
    children() {
      dom.label({
        className: 'block'
      }).renderText`${label}:`
      renderContentEditableTrans(numberStoreTranfrom, value.get, value.set, fdom.div({
        className: "daisy-input",
        contentEditable: contentEditableText,
      }))
    }
  })
}

function drawControl(
  x: StoreRef<number>,
  y: StoreRef<number>,
  size: StoreRef<number>,
  onChange: EmptyFun
) {
  hookDraw({
    x() {
      return x.get() * size.get()
    },
    y() {
      return y.get() * size.get()
    },
    withPath: true,
    draw(ctx, path) {
      path.ellipse(0, 0, 10, 10, 360, 0, 360)
      return {
        operates: [
          {
            type: "fill",
            style: "green"
          }
        ]
      }
    },
    onPointerDown(e) {
      let lastE = e.original

      function onMove(e: PointerEvent) {
        const diffX = e.pageX - lastE.pageX
        const diffY = e.pageY - lastE.pageY
        let nextX = x.get() + diffX / size.get()

        const nextY = y.get() - diffY / size.get()
        if (nextX < 0) {
          nextX = 0
        } else if (nextX > 1) {
          nextX = 1
        }
        x.set(nextX)
        y.set(nextY)

        onChange()
        lastE = e
      }
      pointerMove({
        onMove,
        onEnd: onMove
      })
    }
  })
}