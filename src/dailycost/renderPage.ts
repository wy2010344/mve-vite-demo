import { fdom, mdom } from "mve-dom"
import { pointerMoveDir, signalAnimateFrame } from "wy-dom-helper"
import { addEffect, destinationWithMarginTrans, eventGetPageY, GetValue, MomentumIScroll, overScrollSlow, ScrollFromPage } from "wy-helper"
import demoList from "./demoList"
import { faker } from "@faker-js/faker"
import { hookTrackSignal } from "mve-helper"
import { topContext } from "./context"



const bs = MomentumIScroll.get()
/**
 * 每一天的页面
 */
export default function (
  getIndex: GetValue<number>,
  onScrollX: GetValue<any>
) {
  const { calendarScrollY } = topContext.consume()
  const scrollY = signalAnimateFrame(0)
  hookTrackSignal(onScrollX, function (v) {
    if (!v && getIndex() != 1) {
      //滚动出去后,归位
      addEffect(() => {
        scrollY.changeTo(0)
      })
    }
  })
  let content: HTMLElement
  const container = mdom.div({
    attrs(v) {
      const i = getIndex()
      v.className = 'absolute inset-0 select-none bg-primary overflow-hidden'
      if (i != 1) {
        v.s_position = 'absolute'
        v.s_inset = 0
        v.s_transform = `translateX(${(i - 1) * 100}%)`
      }
    },
    onTouchMove(e) {
      e.preventDefault()
    },
    onPointerDown: pointerMoveDir(function (e, dir) {
      if (dir == 'y') {
        const m = ScrollFromPage.from(e, {
          getPage: eventGetPageY,
          scrollDelta(delta, velocity) {
            const y = scrollY.get()
            scrollY.changeTo(
              y +
              overScrollSlow(y, delta, container.clientHeight, content.offsetHeight)
            )
          },
          onFinish(velocity) {
            const out = bs.destinationWithMargin({
              velocity,
              current: scrollY.get(),
              containerSize: container.clientHeight,
              contentSize: content.offsetHeight
            })
            destinationWithMarginTrans(out, scrollY)
          }
        })
        return {
          onPointerMove(e) {
            m.move(e)
          },
          onPointerUp(e) {
            m.end(e)
          },
        }
      }
    }),
    children() {
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
            max: 18
          }))
        }
      })
    }
  })
}