import { renderForEach } from "mve-core"
import { fdom } from "mve-dom"
import { hookTrackSignal } from "mve-helper"
import { animateSignal, pointerMoveDir } from "wy-dom-helper"
import { addEffect, batchSignalEnd, createSignal, defaultSpringAnimationConfig, eventGetPageY, FrictionalFactory, GetValue, quote, Quote, ScrollFromPage, spring, StoreRef } from "wy-helper"


const fc = FrictionalFactory.get(0.007)
export default function ({
  height,
  cellHeight,
  renderCell,
  value,
  realTimeValue = createSignal(value.get()),
  format = quote,
  getNearNestDiff = quote
}: {
  height: GetValue<number>
  cellHeight: number
  renderCell(i: number): void,
  value: StoreRef<number>
  realTimeValue?: StoreRef<number>,
  format?: Quote<number>
  getNearNestDiff?(n: number): number
}) {
  const scrollY = animateSignal(0)
  function addValue(needAdd: number) {
    realTimeValue.set(format(realTimeValue.get() + needAdd))
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
    const diff = getNearNestDiff(v - realTimeValue.get())
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
            scrollY.changeTo(snapTarget,
              defaultSpringAnimationConfig,
              //    (delta) => {
              //   return fc.getFromDistance(delta).animationConfig()
              // },
              didChange).then(() => {
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
          console.log("dd", height())
          renderForEach<number, void>(function (callback) {
            const v = realTimeValue.get()
            //需要是奇数
            const length = Math.ceil(height() / cellHeight)
            //如果是偶数
            const half = Math.floor(length / 2)
            for (let i = v - half; i <= v + half; i++) {
              callback(i, renderCell)
            }
          })
        }
      })
    }
  }
}