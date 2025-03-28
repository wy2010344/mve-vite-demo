import { renderForEach } from "mve-core"
import { fdom } from "mve-dom"
import { hookTrackSignal } from "mve-helper"
import { animateSignal, pointerMoveDir } from "wy-dom-helper"
import { addEffect, batchSignalEnd, createSignal, defaultSpringAnimationConfig, eventGetPageY, FrictionalFactory, GetValue, quote, Quote, ScrollFromPage, spring, StoreRef } from "wy-helper"
import { circleFindNearst, circleFormat } from "./movePage"


const fc = FrictionalFactory.get(0.007)
export default function ({
  height,
  cellHeight,
  renderCell,
  value,
  realTimeValue = createSignal(value.get()),
  circle
}: {
  height: GetValue<number>
  cellHeight: number
  renderCell(i: number): void,
  value: StoreRef<number>
  realTimeValue?: StoreRef<number>,
  circle?: {
    /**和0的距离,比如如果是从1开始,就是1*/
    baseIndex?: number
    /**总数量,比如12个月,就是12 */
    count: number
  }
}) {
  const scrollY = animateSignal(0)
  function addValue(needAdd: number) {
    const newValue = realTimeValue.get() + needAdd
    if (circle) {
      const circleDiff = circle.baseIndex || 0
      realTimeValue.set(
        circleFormat(newValue - circleDiff, circle.count) + circleDiff
      )
    } else {
      realTimeValue.set(newValue)
    }
  }
  function didChange() {
    const needAdd = Math.floor(scrollY.get() / cellHeight)
    if (needAdd) {
      scrollY.silentDiff(-needAdd * cellHeight)
      addValue(needAdd)
      batchSignalEnd()
    }
  }
  hookTrackSignal(value.get, function (v) {
    let diff = (v - realTimeValue.get())
    if (circle) {
      diff = circleFindNearst(diff, circle.count)
    }
    if (diff) {
      /**
       * 这个对于周期的循环并不友好
       */
      addEffect(() => {
        const snapTarget = diff * cellHeight
        scrollY.changeTo(snapTarget,
          defaultSpringAnimationConfig,
          //    (delta) => {
          //   return fc.getFromDistance(delta).animationConfig()
          // },
          didChange)
      })
    }
  })
  return {
    onPointerDown: pointerMoveDir(function (e, dir) {
      if (dir == 'y') {
        return ScrollFromPage.from(e, {
          getPage: eventGetPageY,
          scrollDelta(delta, velocity) {
            scrollY.changeDiff(delta)
            didChange()
          },
          onFinish(velocity) {
            const dis = fc.getFromVelocity(velocity)
            const targetDis = dis.distance + scrollY.get()
            addValue(Math.round(targetDis / cellHeight))
            const snapTarget = Math.round(targetDis / cellHeight) * cellHeight
            scrollY.animateTo(
              snapTarget,
              defaultSpringAnimationConfig,
              didChange
            ).then(() => {
              didChange()
              value.set(realTimeValue.get())
            })
          }
        })
      }
    }),
    children() {
      fdom.div({
        s_transform() {
          return `translateY(${-scrollY.get()}px)`
        },
        children() {
          renderForEach<number, number, void>(function (callback) {
            const v = realTimeValue.get()
            //需要是奇数
            const length = Math.ceil(height() / cellHeight)
            //如果是偶数
            const half = Math.floor(length / 2)
            for (let i = v - half; i <= v + half; i++) {
              let key = i
              if (circle) {
                const circleDiff = circle.baseIndex || 0
                key = circleFormat(i - circleDiff, circle.count) + circleDiff
              }
              callback(key, key, renderCell)
            }
          })
        }
      })
    }
  }
}