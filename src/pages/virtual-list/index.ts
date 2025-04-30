import { faker } from "@faker-js/faker"
import { renderForEach } from "mve-core"
import { dom, fdom, renderTextContent } from "mve-dom"
import { getSubListInfo, hookDestroy } from "mve-helper"
import { animateSignal, pointerMove } from "wy-dom-helper"
import { arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, destinationWithMargin, eventGetPageY, getSubListForVirtualList, memo, ScrollFromPage } from "wy-helper"
import hookMeasureHeight from "./hookMeasureHeight"
import explain from "../../explain"
import markdown from "../../markdown"

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

      const version = createSignal(0)
      const cacheMap = new Map<number, number>()
      const averageHeight = memo(() => {
        let h = 0
        let c = 0
        version.get()
        cacheMap.forEach(v => {
          h = h + v
          c++
        })
        if (c) {
          return h / c
        }
        return 100
      })

      function getHeight(v: Row) {
        version.get()
        const h = cacheMap.get(v.id)
        if (typeof h == 'number') {
          return h
        }
        return averageHeight() || 100
      }
      const { paddingBegin, subList } = getSubListInfo(() => {
        return getSubListForVirtualList(
          list.get(),
          scrollY.get(),
          containerHeight.get(),
          getHeight
        )
      })
      fdom.div({
        s_height() {
          return averageHeight() * list.get().length + "px"
        },
        s_paddingTop() {
          return paddingBegin() + 'px'
        },
        children() {
          renderForEach<Row, number>(function (callback) {
            const array = list.get()
            const [beginIndex, endIndex] = subList()
            console.log("range", beginIndex, endIndex)
            for (let i = beginIndex; i < endIndex; i++) {
              const row = array[i]
              callback(row.id, row)
            }
          }, function (key, et) {
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
              cacheMap.set(key, div.clientHeight)
              version.set(version.get() + 1)
              batchSignalEnd()
            })
          })
        }
      })
    }
  })

}