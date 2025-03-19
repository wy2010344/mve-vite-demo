import { dom, fdom, renderText } from "mve-dom";
import { createSignal, springBaseAnimationConfig, StoreRef, WeightMeasure, FrictionalFactory, EaseType, easeFns } from "wy-helper";
import { NumberRange, renderNumberRange } from "../renderRange";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";

import drawCanvasCurve from "../animation-view/draw-canvas-curve";
import bezierCanvasView from "../animation-view/bezier-canvas-view";
import { easePoly, easeCirc, easeSine, easeExpo, easeBonuceOut, easeBack, easeElastic } from "../animation-view/tween-view";
import drawUnknownEndView from "../animation-view/draw-unknown-end-view";
import { renderControl, renderEase } from "../animation-view/util";

export default function () {


  fixRightTop(function () {
    themeDropdown()
  })

  fdom.div({
    className: 'w-full h-full overflow-y-auto flex flex-col items-center pt-1 pb-1 ',
    children() {
      fdom.div({
        className: "grid items-center [grid-template-columns:1fr_auto]",
        children() {
          renderSpring()
          bezierCanvasView()
          renderFrc()
          easePoly()
          easeSine()
          easeCirc()
          easeExpo()
          easeBack()
          easeElastic()
          easeBonuceOut()
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
  drawUnknownEndView({
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
    }
  })

  fdom.div({
    className: 'flex flex-col items-start space-y-1',
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
}
function renderFrc() {
  const deceleration = new NumberRange(0.0006, {
    min: 0.0001,
    max: 0.001
  })

  const ease = createSignal<EaseType>('in')
  drawUnknownEndView({
    getAnimationFun(height) {
      return FrictionalFactory.get(deceleration.value.get()).getFromDistance(height).animationConfig(ease.get())
    }
  })
  fdom.div({
    className: 'flex flex-col items-start space-y-1',
    children() {
      dom.h1({
        className: "text-2xl"
      }).renderText`摩擦减速动画`
      renderNumberRange('deceleration', deceleration)
      renderEase(ease)
    }
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

  drawUnknownEndView({
    getAnimationFun(height) {
      return new WeightMeasure(height, initialVelocity.value.get(), acceleration.value.get()).animationConfig(ease.get())
    }
  })
  renderControl('重力加速度动画', function () {
    renderNumberRange('initialVelocity', initialVelocity)
    renderNumberRange('acceleration', acceleration)
    renderEase(ease)
  })
}

