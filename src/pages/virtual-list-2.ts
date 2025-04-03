
import { faker } from "@faker-js/faker";
import { hookAddDestroy, renderForEach } from "mve-core";
import { fdom, renderText, renderTextContent } from "mve-dom";
import { hookDestroy, hookTrackSignal, renderArray, renderArrayKey } from "mve-helper";
import { animateSignal, observerIntersection, pointerMove } from "wy-dom-helper";
import { addEffect, arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, defaultSpringAnimationConfig, destinationWithMargin, eventGetPageY, ScrollFromPage } from "wy-helper";





/**
 * 设想:
 * 优先依外部点位
 * 但完全不显示的,隐藏
 *
 * 但最开始需要完全渲染出来,而后又在滚动中对隐藏的销毁——完全没必要!
 * 
 */
export default function () {



  const list = createSignal(arrayCountCreateWith(1000, i => {
    const height = createSignal<undefined | number>(undefined)
    return {
      id: i,
      color: faker.color.rgb(),
      height
    }
  }))
  const scrollY = animateSignal(0)
  const fr = ClampingScrollFactory.get()
  const edgeFr = ClampingScrollFactory.get(100)
  fdom.div({
    className: 'touch-none w-full h-[80%] overflow-hidden',
    children(container: HTMLDivElement) {
      container.addEventListener("pointerdown", e => {
        scrollY.stop()
        pointerMove(ScrollFromPage.from(e, {
          getPage: eventGetPageY,
          scrollDelta(delta, velocity) {
            scrollY.set(scrollY.get() + delta)
            batchSignalEnd()
          },
          onFinish(velocity) {
            return destinationWithMargin({
              scroll: scrollY,
              frictional: fr.getFromVelocity(velocity),
              // multiple: 2,
              containerSize: container.clientHeight,
              contentSize: content.offsetHeight,
              edgeConfig(velocity) {
                return edgeFr.getFromVelocity(velocity).animationConfig()
                // return scrollInfinityIteration(velocity, {
                //   nextVelocity(v) {
                //     return v * 0.93
                //   }
                // })
                // return fr2.getFromVelocity(velocity).animationConfig('in')
              },
              edgeBackConfig: defaultSpringAnimationConfig,
            })
          }
        }))
      })
      const content = fdom.div({
        s_transform() {
          return `translateY(${-scrollY.get()}px)`
        },
        children() {
          renderArrayKey(list.get, row => row.id, function (getRow, getIndex) {
            const randomHeight = faker.number.int({
              min: 30,
              max: 80
            })
            const visible = createSignal(true)
            const div = fdom.div({
              className: 'flex items-center justify-center',
              s_height: randomHeight + 'px',
              s_background() {
                return getRow().color
              },
              children() {
                renderTextContent(() => {
                  return getRow().id + "--" + visible.get()
                })
                fdom.input()
              }
            })
            hookDestroy(observerIntersection(function (e) {
              visible.set(Boolean(e[0].intersectionRatio))
            }, div, {
              root: container
            }))
          })

        }
      })
    }
  })
}