
import { dom, fdom, renderText } from "mve-dom";
import { EaseType, EmptyFun, memoFun, StoreRef } from "wy-helper";
import { themeSignal } from "../themeDropdown";
import { rgb, formatHex } from "culori";
import { pointerMove } from "wy-dom-helper";
import { renderContentEditable } from "mve-dom-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";

export const getBaseContentColor = function () {
  return getCssVariableColor('--color-base-content')
}
export const getCssVariableColor = memoFun(function () {
  themeSignal.get()
  return function (variable: string) {
    const color = getCSSVariable(variable)
    return formatHex(rgb(color)) || ''
  }
})
function getCSSVariable(variableName: string, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(variableName).trim();
}


export function render偏移(transY: StoreRef<number>) {

  fdom.div({
    className: 'absolute top-2 left-2 flex gap-1 items-center z-1',
    children() {
      fdom.div({
        className: 'w-3 h-3 bg-accent cursor-move',
        onPointerDown(e) {
          let lastE: PointerEvent = e
          function didMove(e: PointerEvent) {
            const deltaY = e.pageY - lastE.pageY
            transY.set(deltaY + transY.get())
            lastE = e
          }
          pointerMove({
            onMove: didMove,
            onEnd: didMove,
          })
        }
      })
      renderText`偏移:`
      renderContentEditable("div", {
        contentEditable: contentEditableText,
        value: transY.get,
        onValueChange(v: string) {
          let n = Number(v)
          if (isNaN(n)) {
            return
          }
          transY.set(n)
        },
      })
    }
  })
}



export function renderEase(ease: StoreRef<EaseType>) {

  fdom.div({
    children() {
      dom.label({
        className: 'block'
      }).renderText`ease:`
      const s = fdom.select({
        value: ease.get,
        onInput(e) {
          ease.set(s.value as any)
        },
        className: 'daisy-select',
        children() {
          fdom.option({
            childrenType: 'text',
            children: `in`,
          })
          fdom.option({
            childrenType: 'text',
            children: `out`,
          })
          fdom.option({
            childrenType: 'text',
            children: `in-out`,
          })
        }
      })
    }
  })
}

export function renderControl(title: string, render: EmptyFun) {

  fdom.div({
    className: 'flex flex-col items-start space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderTextContent(title)

      render()
    }
  })
}