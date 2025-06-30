import { faker } from "@faker-js/faker"
import { renderForEach } from "mve-core"
import { dom, fdom, renderTextContent } from "mve-dom"
import { getSubListInfo, hookDestroy, hookTrackSignal } from "mve-helper"
import { animateSignal, pointerMove } from "wy-dom-helper"
import { arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, destinationWithMargin, eventGetPageY, getSubListForVirtualList, memo, ScrollFromPage } from "wy-helper"
import hookMeasureHeight from "./hookMeasureHeight"
import explain from "../../explain"
import markdown from "../../markdown"
import { dynamicHeight, forEachSub } from "./dynamicHeight"

export default function () {

  explain(function () {
    markdown`
这个是用原生的滚动,每个item的高度不固定
未出现的高度依平均高度
    `
  })
  const baseList = arrayCountCreateWith(1000, i => {
    return {
      id: i,
      color: faker.color.rgb(),
      content: faker.lorem.lines()
    }
  })
  const list = createSignal(baseList)
  type Row = typeof baseList[number]
  const scrollY = createSignal(0)
  const container = fdom.div({
    className: ' w-[90%] h-[90%] overflow-y-auto border-red-100 border-1',
    onScroll(event) {
      scrollY.set(container.scrollTop)
      batchSignalEnd()
    },
    children(container: HTMLDivElement) {

      const containerHeight = createSignal(0)
      hookMeasureHeight(container, () => {
        containerHeight.set(container.clientHeight)
        batchSignalEnd()
      })

      const { getHeightWithId, averageHeight, measureHeight } = dynamicHeight()
      function getHeight(row: Row) {
        return getHeightWithId(row.id)
      }
      const { paddingBegin, subList } = getSubListInfo(() => {
        const o = getSubListForVirtualList(
          list.get(),
          scrollY.get(),
          containerHeight.get(),
          getHeight
        )
        return o
      })
      fdom.div({
        s_height() {
          return averageHeight() * list.get().length + "px"
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
                  return et.getValue().id + "--" + et.getIndex()
                })
                fdom.input({
                  className: 'daisy-input daisy-input-xs'
                })
                dom.p().renderTextContent(() => et.getValue().content)
              }
            })
            measureHeight(key, div)
          })
        }
      })
    }
  })

}