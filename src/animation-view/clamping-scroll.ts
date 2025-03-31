import { AnimateSignal, AnimateSignalConfig, ClampingScrollFactory, createAnimationTime, DeltaXSignalAnimationConfig, emptyObject, getMaxScroll, memo, quote, SetValue } from "wy-helper"
import { NumberRange, renderNumberRange } from "../renderRange"
import drawUnknownEndView from "./draw-unknown-end-view"
import { dom, fdom } from "mve-dom"
import drawCanvasCurve from "./draw-canvas-curve"



export default function renderClamping() {
  const initVelocity = new NumberRange(10, {
    min: 5,
    max: 15
  })
  const drag = new NumberRange(2, {
    min: 1,
    max: 20
  })

  const clamping = memo(() => {
    return ClampingScrollFactory.get(drag.value.get()).getFromVelocity(initVelocity.value.get())
  })
  drawUnknownEndView({
    getAnimationFun() {
      return {
        rewriteHeight: clamping().distance,
        callback(height) {
          return clamping().animationConfig()
        }
      }
    }
  })
  fdom.div({
    className: 'flex flex-col items-start space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`clamping滚动`
      renderNumberRange('initVelocity', initVelocity)
      renderNumberRange('drag', drag)

      fdom.div({
        childrenType: 'text',
        children() {
          return '目标位移:' + clamping().distance
        }
      })
    }
  })
}