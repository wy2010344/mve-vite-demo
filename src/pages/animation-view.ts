import { dom, fdom } from "mve-dom";
import { createSignal, springBaseAnimationConfig, StoreRef, WeightMeasure, FrictionalFactory, EaseType } from "wy-helper";
import { NumberRange, renderNumberRange } from "../renderRange";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";

import drawCanvasCurve from "../draw-canvas-curve";

export default function () {


  fixRightTop(function () {
    themeDropdown()
  })

  fdom.div({
    className: 'w-full h-full overflow-y-auto flex flex-col items-center pt-1 pb-1 ',
    children() {

      fdom.div({
        className: "grid items-center [grid-template-columns:auto_1fr]",
        children() {
          renderSpring()
          renderFrc()
          renderWeight()
        }
      })
    }
  })


}

function renderSpring() {

  const initialVelocity = new NumberRange(0, {
    min: -10,
    max: 10
  })
  const displacementThreshold = new NumberRange(0.5, {
    min: 0.01,
    max: 1
  })
  const velocityThreshold = new NumberRange(10, {
    min: 0.01,
    max: 10
  })
  const zta = new NumberRange(1, {
    min: 0.01,
    max: 1.5
  })
  const omega0 = new NumberRange(8, {
    min: 0.1,
    max: 80
  })
  fdom.div({
    className: 'flex flex-col items-end space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`Spring动画`
      renderNumberRange('initVelocity', initialVelocity)
      renderNumberRange('displacementThreshold', displacementThreshold)
      renderNumberRange('velocityThreshold', velocityThreshold)
      renderNumberRange('zta', zta)
      renderNumberRange('omega0', omega0)
    }
  })
  drawCanvasCurve({
    getAnimationFun(height) {
      return springBaseAnimationConfig(height, {
        config: {
          zta: zta.value.get(),
          omega0: omega0.value.get()
        },
        /**默认0 */
        initialVelocity: initialVelocity.value.get(),
        /**默认0.01 */
        displacementThreshold: displacementThreshold.value.get(),
        /**默认2 */
        velocityThreshold: velocityThreshold.value.get(),
        // ease: "out"
      })
    },
  })
}
function renderFrc() {
  const deceleration = new NumberRange(0.0006, {
    min: 0.0001,
    max: 0.001
  })

  const ease = createSignal<EaseType>('in')

  fdom.div({
    className: 'flex flex-col items-end space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`摩擦减速动画`
      renderNumberRange('deceleration', deceleration)
      renderEase(ease)
    }
  })
  drawCanvasCurve({
    getAnimationFun(height) {
      return FrictionalFactory.get(deceleration.value.get()).getFromDistance(height).animationConfig(ease.get())
    },
  })
}

function renderWeight() {

  const initialVelocity = new NumberRange(0, {
    min: -10,
    max: 10
  })
  const acceleration = new NumberRange(0.0006, {
    min: 0.0001,
    max: 0.001
  })


  const ease = createSignal<EaseType>('in')
  fdom.div({
    className: 'flex flex-col items-end space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`重力加速度动画`
      renderNumberRange('initialVelocity', initialVelocity)
      renderNumberRange('acceleration', acceleration)
      renderEase(ease)
    }
  })
  drawCanvasCurve({
    getAnimationFun(height) {
      return new WeightMeasure(height, initialVelocity.value.get(), acceleration.value.get()).animationConfig(ease.get())
    },
  })
}


function renderEase(ease: StoreRef<EaseType>) {

  fdom.div({
    children() {
      dom.label({
        className: 'block text-right'
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