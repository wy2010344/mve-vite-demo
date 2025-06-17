import { fdom, mdom } from "mve-dom"
import { animateSignal, pointerMoveDir } from "wy-dom-helper"
import { addEffect, ClampingScrollFactory, defaultSpringAnimationConfig, destinationWithMargin, eventGetPageY, extrapolationClamp, FrictionalFactory, getInterpolate, getMaxScroll, GetValue, memoFun, overScrollSlow, scrollForEdge, ScrollFromPage, scrollInfinityIteration } from "wy-helper"
import demoList from "./demoList"
import { faker } from "@faker-js/faker"
import { hookTrackSignal } from "mve-helper"
import { topContext } from "./context"

const CREATE_SCROLLY = -50

const bs = FrictionalFactory.get()
/**
 * 每一天的页面
 */
export default function (
  getIndex: GetValue<number>,
  onScrollX: GetValue<any>
) {
  const { showCalendar, calendarFinish, calendarScroll } = topContext.consume()
  const scrollY = animateSignal(0)
  hookTrackSignal(onScrollX, function (v) {
    if (!v && getIndex() != 1) {
      //滚动出去后,归位
      addEffect(() => {
        scrollY.set(0)
      })
    }
  })
  let content: HTMLElement
  const container = mdom.div({
    attrs(v) {
      const i = getIndex()
      v.className = 'absolute inset-0 select-none bg-base-100 overflow-hidden'
      if (i != 1) {
        v.s_position = 'absolute'
        v.s_inset = 0
        v.s_transform = `translateX(${(i - 1) * 100}%)`
      }
    },
    onTouchMove(e) {
      e.preventDefault()
    },
    onPointerDown: pointerMoveDir(function () {
      scrollY.stop()
      return {
        onMove(e, dir) {
          if (dir == 'y') {
            return ScrollFromPage.from(e, {
              getPage: eventGetPageY,
              scrollDelta(delta, velocity) {
                if (showCalendar()) {
                  calendarScroll(delta, velocity)
                } else {
                  scrollForEdge(scrollY, delta, container.clientHeight, content.offsetHeight)
                }
              },
              onFinish(velocity) {
                if (showCalendar()) {
                  calendarFinish(velocity)
                } else {
                  if (scrollY.get() <= CREATE_SCROLLY) {
                    //创建
                    console.log("新建")
                  }
                  destinationWithMargin({
                    frictional: ClampingScrollFactory.get().getFromVelocity(velocity),
                    scroll: scrollY,
                    maxScroll: getMaxScroll(container.clientHeight, content.offsetHeight)
                  })
                }
              }
            })
          }
        }
      }
    }),
    children() {

      const interpolateIndex = memoFun(() => {
        return getInterpolate({
          0: 0,
          [CREATE_SCROLLY]: texts.length - 1
        }, extrapolationClamp)
      })
      fdom.div({
        childrenType: "text",
        className: 'absolute w-full flex justify-center',
        s_transform() {
          return `translateY(calc(${-scrollY.get()}px - 100%))`
        },
        children() {
          const index = Math.round(interpolateIndex(scrollY.get()))
          return texts[index]
        }
      })
      //home页面
      content = fdom.div({
        s_transform() {
          return `translateY(${-scrollY.get()}px)`
        },
        className: 'flex flex-col',
        s_minHeight: '100%',
        children() {
          demoList(faker.number.int({
            min: 1,
            max: 58
          }))
        }
      })
    }
  })
}

const texts = [
  '新...',
  '新增...',
  '新增一...',
  '新增一条...',
  '新增一条记...',
  '新增一条记录'
]