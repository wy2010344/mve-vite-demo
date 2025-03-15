import { dom, fdom, renderTextContent } from "mve-dom";
import { SignalClass, SignalField } from '../signal'
import { createSignal, emptyObject, GetValue, SetValue, springBaseAnimationConfig, StoreRef, memo } from "wy-helper";
import { renderContentEditable, renderInput } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";
import { cns, DomElementType } from "wy-dom-helper";
import { renderCanvas, hookDraw, hookDrawText } from "mve-dom-helper/canvasRender";


class NumberRange {
  readonly value: StoreRef<number>
  readonly min: StoreRef<number>
  readonly max: StoreRef<number>
  readonly step: StoreRef<number>

  constructor(
    value: number,
    {
      min = 0,
      max = 100,
      step = 1
    }: {
      min?: number
      max?: number
      step?: number
    } = emptyObject
  ) {
    this.value = createSignal(value)
    this.min = createSignal(min)
    this.max = createSignal(max)
    this.step = createSignal(step)
  }
}
function renderDivNumber({
  type = "div",
  className = 'daisy-input-xs',
  value,
  setValue
}: {
  type?: DomElementType
  className?: string
  value: GetValue<number>, setValue: SetValue<number>
}) {
  // renderInput("input", {
  //   value,
  //   onValueChange(v: string) {
  //     const n = Number(v)
  //     if (isNaN(n)) {
  //       return
  //     }
  //     setValue(n)
  //   },
  // })
  renderContentEditable(type, {
    value,
    className: cns("flex-0 daisy-input", className),
    contentEditable: contentEditableText,
    onValueChange(v: string) {
      const n = Number(v)
      if (isNaN(n)) {
        return
      }
      setValue(n)
    },
  })
}


function renderNumberRange(label: string, range: NumberRange) {

  dom.label({
    className: "align-middle text-right"
  }).renderText`${label}: `

  fdom.div({
    className: 'flex items-start justify-center gap-1 justify-self-start',
    children() {
      renderDivNumber({
        value: range.min.get, setValue(v) {
          if (v >= range.max.get()) {
            return
          }
          range.min.set(v)
        }
      })
      fdom.div({
        children() {
          renderInput("input", {
            type: "range",
            className: "daisy-range range-xs",
            min: range.min.get,
            max: range.max.get,
            step: range.step.get,
            value: range.value.get,
            onValueChange(v) {
              range.value.set(Number(v))
            }
          })

          fdom.div({
            className: "flex-1 flex items-center justify-between relative",
            children() {
              dom.label().renderText`value:`
              renderDivNumber({
                type: "span",
                className: "daisy-input-md",
                value: range.value.get,
                setValue(v) {
                  if (v < range.min.get()) {
                    return
                  }
                  if (v > range.max.get()) {
                    return
                  }
                  range.value.set(v)
                }
              })

              dom.label().renderText`step:`
              renderDivNumber({
                type: "span",
                value: range.step.get,
                setValue(v) {
                  if (v <= 0) {
                    return
                  }
                  if (v > range.max.get() - range.min.get()) {
                    return
                  }
                  range.step.set(v)
                }
              })
            }
          })

        }
      })
      renderDivNumber({
        value: range.max.get,
        setValue(v) {
          if (v <= range.min.get()) {
            return
          }
          range.max.set(v)
        }
      })
    }
  })
}

export default function () {

  const initialVelocity = new NumberRange(0, {
    min: -10,
    max: 10
  })
  const displacementThreshold = new NumberRange(0.01, {
    max: 1,
    step: 0.01
  })
  const velocityThreshold = new NumberRange(2, {
    min: 0.01,
    max: 10,
    step: 0.01
  })
  const zta = new NumberRange(1, {
    min: 0.1,
    max: 8,
    step: 0.1
  })
  const omega0 = new NumberRange(8, {
    min: 0.1,
    max: 8,
    step: 0.1
  })
  fdom.div({
    className: "grid grid-cols-2 gap-1",
    children() {
      renderNumberRange('initVelocity', initialVelocity)
      renderNumberRange('displacementThreshold', displacementThreshold)
      renderNumberRange('velocityThreshold', velocityThreshold)
      renderNumberRange('zta', zta)
      renderNumberRange('omega0', omega0)
    }
  })



  const canvas = fdom.canvas({
    width: 800,
    height: 800
  })


  const springList = memo(() => {

    const spring = springBaseAnimationConfig(1, {
      config: {
        zta: zta.value.get(),
        omega0: omega0.value.get()
      },
      /**默认0 */
      initialVelocity: initialVelocity.value.get(),
      /**默认0.01 */
      displacementThreshold: displacementThreshold.value.get(),
      /**默认2 */
      velocityThreshold: velocityThreshold.value.get()
    })

    const list: number[] = []
    let time = 0
    while (true) {
      const out = spring(time)
      list.push(out[0])
      time = time + 16
      if (out[1]) {
        break
      }
    }
    return list
  })
  renderCanvas(canvas, () => {
    const width = 600
    const height = 600
    hookDraw({
      x: 10,
      y: 10,
      draw(ctx) {
        const list = springList()
        const perWidth = width / (list.length - 1)
        // 将坐标原点移动到画布的左下角
        ctx.translate(0, height);
        // 将 y 轴翻转
        ctx.scale(1, -1);


        ctx.beginPath()
        //y轴
        ctx.moveTo(0, 0)
        ctx.lineTo(0, height)
        ctx.stroke()


        //y-right轴
        ctx.moveTo(width, 0)
        ctx.lineTo(width, height)
        ctx.stroke()

        //x轴
        ctx.moveTo(0, 0)
        ctx.lineTo(width, 0)
        ctx.stroke()


        ctx.beginPath()
        ctx.moveTo(0, 0)
        for (let i = 0; i < list.length; i++) {
          const cell = list[i]
          ctx.lineTo(perWidth * i, height * cell)
        }
        ctx.stroke()
      }
    })
    hookDrawText({
      x: 0,
      y: 0,
      width: 100,
      config() {
        const list = springList()
        return {
          lineHeight: 20,
          text: `用时  ${(list.length - 1) * 16 / 1000}s`
        }
      }
    })
  })
}
