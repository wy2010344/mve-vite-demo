import { dom, fdom, renderTextContent } from "mve-dom";
import { createSignal, emptyObject, GetValue, SetValue, springBaseAnimationConfig, StoreRef, memo, easeFns } from "wy-helper";
import { renderContentEditable, renderInput } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";
import { cns, DomElementType } from "wy-dom-helper";
import { renderCanvas, hookDraw, hookDrawText, hookDrawTextWrap } from "mve-dom-helper/canvasRender";

export class NumberRange {
  readonly value: StoreRef<number>
  readonly min: StoreRef<number>
  readonly max: StoreRef<number>
  readonly step: StoreRef<number>

  constructor(
    value: number,
    {
      min = 0,
      max = 100,
      /**从min到max之间的间隔 */
      step = 100
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
export function renderDivNumber({
  type = "div",
  className = 'daisy-input-xs daisy-input-ghost',
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


export function renderNumberRange(label: string, range: NumberRange) {

  fdom.div({
    children() {
      dom.label({
        className: "block",
      }).renderText`${label}: `

      fdom.div({
        className: 'flex items-start justify-center gap-1',
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
                step() {
                  return (range.max.get() - range.min.get()) / range.step.get()
                },
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
                      v = Math.round(v)
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
  })
}