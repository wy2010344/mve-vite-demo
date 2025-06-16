import { faker } from "@faker-js/faker"
import { renderForEach } from "mve-core"
import { dom, fdom, renderTextContent } from "mve-dom"
import { getSubListInfo, hookDestroy, memoArray } from "mve-helper"
import { animateSignal, pointerMove } from "wy-dom-helper"
import { arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, destinationWithMargin, eventGetPageY, getSubListForVirtualList, memo, ScrollFromPage } from "wy-helper"
import hookMeasureHeight from "../hookMeasureHeight"
import explain from "../../../explain"
import markdown from "../../../markdown"
import { dynamidHeight2, forEachSub } from "../dynamicHeight"

export default function () {
  explain(() => {
    markdown`
# 虚拟列表,自定义滚动

这个虚拟列表,每个item的高度不固定 未出现的高度依平均高度

自定义滚动,基于animateSignal动画,动画曲线是模仿flutter的Clamping算法,带有一定的弹性.
`
  })

  const baseList = arrayCountCreateWith(1000, i => {
    return {
      id: i,
      color: faker.color.rgb(),
      content: faker.lorem.lines(),
      /**
       * 可以用key绑定高度,放在map里,用version去通知?
       */
      height: createSignal<number | undefined>(undefined)
    }
  })
  const list = createSignal(baseList)

  type Row = typeof baseList[number]

  const scrollY = animateSignal(0)
  const fr = ClampingScrollFactory.get()
  const edgeFr = ClampingScrollFactory.get(100)

  const { getHeight, averageHeight } = dynamidHeight2(list.get, function (c) {
    return c.height.get()
  })
  fdom.div({
    className: 'touch-none w-[90%] h-[90%] overflow-hidden border-red-100 border-1',
    children(container: HTMLDivElement) {
      const containerHeight = createSignal(0)
      hookMeasureHeight(container, () => {
        containerHeight.set(container.clientHeight)
        batchSignalEnd()
      })
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
              containerSize: containerHeight.get(),
              contentSize: averageHeight() * list.get().length,

              edgeConfig(velocity) {
                return edgeFr.getFromVelocity(velocity).animationConfig()
              }
            })
          }
        }))
      })


      const { paddingBegin, subList } = getSubListInfo(() => {
        return getSubListForVirtualList(
          list.get(),
          scrollY.get(),
          containerHeight.get(),
          getHeight
        )
      })
      fdom.div({
        s_transform() {
          return `translateY(${-scrollY.get()}px)`
        },
        s_paddingTop() {
          return paddingBegin() + 'px'
        },
        children() {
          renderForEach<Row, number>(forEachSub(list.get, v => v.id, subList), function (key, et) {
            const div = fdom.div({
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
                dom.p().renderTextContent(() => et.getValue().content)
              }
            })
            hookMeasureHeight(div, function () {
              et.getValue().height.set(div.clientHeight)
              batchSignalEnd()
            })
            //
          })
        }
      })

    }
  })
}