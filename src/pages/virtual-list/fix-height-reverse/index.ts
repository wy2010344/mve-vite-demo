import { faker } from "@faker-js/faker"
import { renderForEach } from "mve-core"
import { fdom, renderTextContent } from "mve-dom"
import { hookDestroy, memoArray, getSubListInfo } from "mve-helper"
import { call } from "three/tsl"
import { animateSignal, pointerMove } from "wy-dom-helper"
import { arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, defaultSpringAnimationConfig, destinationWithMargin, eventGetPageY, memo, ScrollFromPage, getSubListForVirtualList } from "wy-helper"
import explain from "../../../explain"
import markdown from "../../../markdown"
import hookMeasureHeight from "../hookMeasureHeight"
import { forEachSub, forEachSubReverse } from "../dynamicHeight"

/**
 * 参考react-window,需要对每条记录预估高度
 * 那么使用自定义布局,是否能预估出来呢?除非不依赖外部元素高度
 */
export default function () {

  explain(() => {
    markdown`
# 虚拟列表,自定义滚动,自底向顶滚动

这个虚拟列表,需要每条记录提供自己的高度,这个高度是预先于dom渲染存在的.

自定义滚动,基于animateSignal动画,动画曲线是模仿flutter的Clamping算法,带有一定的弹性.
`
  })

  const baseList = arrayCountCreateWith(1000, i => {
    return {
      id: i,
      color: faker.color.rgb(),
      height: faker.number.int({
        min: 30,
        max: 80
      })
    }
  })
  const list = createSignal(baseList)

  type Row = typeof baseList[number]

  const scrollY = animateSignal(0)
  const fr = ClampingScrollFactory.get()
  const edgeFr = ClampingScrollFactory.get(100)
  fdom.div({
    className: 'touch-none w-[90%] h-[90%] overflow-hidden border-red-100 border-1 relative',
    children(container: HTMLDivElement) {
      const containerHeight = createSignal(0)
      hookMeasureHeight(container, () => {
        containerHeight.set(container.clientHeight)
        batchSignalEnd()
      })

      const totalHeight = memo(() => {
        const array = list.get()
        let h = 0
        for (let i = 0; i < array.length; i++) {
          h = h + array[i].height
        }
        return h
      })
      container.addEventListener("pointerdown", e => {
        scrollY.stop()
        pointerMove(ScrollFromPage.from(e, {
          getPage: eventGetPageY,
          scrollDelta(delta, velocity) {
            scrollY.set(scrollY.get() + delta)
            batchSignalEnd()
          },
          opposite: true,
          onFinish(velocity) {
            return destinationWithMargin({
              scroll: scrollY,
              frictional: fr.getFromVelocity(velocity),
              containerSize: containerHeight.get(),
              contentSize: totalHeight(),

              edgeConfig(velocity) {
                return edgeFr.getFromVelocity(velocity).animationConfig()
              }
            })
          }
        }))
      })

      function getHeight(v: Row) {
        return v.height
      }

      const { paddingBegin, subList } = getSubListInfo(() => {
        return getSubListForVirtualList(list.get(), scrollY.get(), containerHeight.get(), getHeight)
      })
      fdom.div({
        className: 'absolute w-full',
        s_bottom() {
          return -scrollY.get() + 'px'
        },
        s_paddingBottom() {
          return paddingBegin() + 'px'
        },
        children() {
          renderForEach<Row, number>(forEachSubReverse(list.get, v => v.id, subList), function (key, et) {
            fdom.div({
              className: 'flex items-center justify-center min-h-0',
              s_height() {
                return et.getValue().height + 'px'
              },
              s_maxHeight() {
                return et.getValue().height + 'px'
              },
              s_background() {
                return et.getValue().color
              },
              children() {
                renderTextContent(() => {
                  return et.getValue().id + "--"
                })
                fdom.input({
                  className: 'daisy-input daisy-input-xs'
                })
              }
            })
          })
        }
      })
    }
  })
}