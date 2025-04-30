import { fdom } from "mve-dom";
import { dateFromYearMonthDay, DAYMILLSECONDS, memo, simpleEqualsEqual, YearMonthDayVirtualView, StoreRef, FrictionalFactory, eventGetPageX, ClampingScrollFactory, Compare } from "wy-helper";
import { hookTrackSignal, memoArray, renderArray } from "mve-helper";
import { animateSignal, pointerMoveDir, } from "wy-dom-helper";
import renderPage from "./renderPage";
import { movePage } from "mve-dom-helper";

export default function (
  date: StoreRef<YearMonthDayVirtualView>,
  // getFullWidth: GetValue<number>
) {
  function getContainerWidth() {
    return container.clientWidth
  }
  const bodyScrollX = animateSignal(0)
  const mp2 = movePage(bodyScrollX, getContainerWidth)
  hookTrackSignal(memo<YearMonthDayVirtualView>((lastDate) => {
    const d = date.get()
    if (lastDate) {
      const lastTime = dateFromYearMonthDay(lastDate).valueOf()
      const thisTime = dateFromYearMonthDay(d).valueOf()
      const diff = thisTime - lastTime
      let direction = 0
      if (diff >= DAYMILLSECONDS) {
        direction = 1
      } else if (diff <= -DAYMILLSECONDS) {
        direction = -1
      }
      if (direction) {
        mp2.changePage(direction)
      }
    }
    return d
  }))
  const container = fdom.div({
    className: 'flex-1 overflow-hidden',
    onPointerDown: pointerMoveDir(function () {
      return {
        onMove(e, dir) {
          if (dir == 'x') {
            return mp2.pointerDown(e, {
              getPage: eventGetPageX,
              callback(direction, velocity) {
                const m = dateFromYearMonthDay(date.get())
                m.setTime(m.getTime() + direction * DAYMILLSECONDS)
                if (direction) {
                  date.set(YearMonthDayVirtualView.fromDate(m))
                }
              },
            })
          }
        }
      }
    }),
    children() {
      fdom.div({
        className: 'h-full',
        s_transform() {
          return `translateX(${-bodyScrollX.get()}px)`
        },
        children() {
          renderArray(memoArray(() => {
            const d = date.get()
            return [
              d.beforeDay(),
              d,
              d.nextDay()
            ]
          }, simpleEqualsEqual as Compare<YearMonthDayVirtualView>), function (w, getIndex) {
            renderPage(getIndex, () => {
              return bodyScrollX.onAnimation()
            })
          })
        }
      })
    }
  })
}