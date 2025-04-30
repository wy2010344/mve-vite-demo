import { faker } from "@faker-js/faker";
import { renderForEach } from "mve-core";
import { fdom, renderText, renderTextContent } from "mve-dom";
import { hookDestroy, hookTrackSignal } from "mve-helper";
import { animateSignal, pointerMove } from "wy-dom-helper";
import { addEffect, arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, defaultSpringAnimationConfig, destinationWithMargin, eventGetPageY, ScrollFromPage, StoreRef } from "wy-helper";



/**
 * 不太可行,依赖真实的尺寸
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

            return scrollY.change(fr.getFromVelocity(velocity).animationConfig()).then(value => {

            })
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

          const beginIndex = createSignal(0)
          const endIndex = createSignal(1)
          let needRemoveDiff: number | undefined = undefined
          hookTrackSignal(() => {
            const bi = beginIndex.get()
            const ei = endIndex.get()
            const array = list.get()
            const sy = scrollY.get()
            if (sy < 0) {
              if (typeof needRemoveDiff == 'number') {
                return
              }
              //向前滚动
              let endSet = false
              let endReset = ei
              let h = 0
              for (let i = bi; i < ei; i++) {
                const row = array[i]
                const height = row.height.get()
                if (typeof height == 'undefined') {
                  return
                }
                h = h + height
                if (!endSet) {
                  if (h > container.clientHeight) {
                    endSet = true
                    endReset = i + 1
                  }
                }
              }

              let change = false
              if (endReset != ei) {
                change = true
              }
              const newBi = Math.max(bi - 1, 0)
              if (newBi > -1) {
                change = true
              }
              if (!change) {
                return
              }
              addEffect(() => {
                if (bi > 0) {
                  beginIndex.set(newBi)
                  needRemoveDiff = newBi
                }
                endIndex.set(endReset)
                batchSignalEnd()
              })
            } else {
              let beginSet = false
              let scrollDiff = 0
              let beginReset = bi
              let h = 0
              for (let i = bi; i < ei; i++) {
                const row = array[i]
                const height = row.height.get()
                if (typeof height == 'undefined') {
                  return
                }
                h = h + height
                if (!beginSet) {
                  if (h > sy) {
                    beginSet = true
                    beginReset = i
                    scrollDiff = h - height
                  }
                }
              }
              let change = false;
              if (bi != beginReset) {
                change = true
              }

              let newEi = ei
              if (h - scrollDiff < container.clientHeight) {
                change = true
                newEi = Math.min(ei + 1, array.length)
              }
              if (newEi <= array.length) {
                change = true
              }
              if (scrollDiff) {
                change = true
              }
              if (!change) {
                return
              }
              addEffect(() => {
                beginIndex.set(beginReset)
                endIndex.set(newEi)
                scrollY.silentDiff(-scrollDiff)
                batchSignalEnd()
              })
            }
          })

          renderForEach<{
            id: number,
            color: string,
            height: StoreRef<number | undefined>
          }, number>(function (callback) {
            const bi = beginIndex.get()
            const ei = endIndex.get()
            const array = list.get()
            const maxLen = array.length
            for (let i = bi; i < ei && i < maxLen; i++) {
              const row = array[i]
              callback(i, row)
            }
          }, function (key, et) {
            const randomHeight = faker.number.int({
              min: 30,
              max: 80
            })
            const div = fdom.div({
              className: 'flex items-center justify-center',
              s_height: randomHeight + 'px',
              // data_i: row.id,
              s_background() {
                return et.getValue().color
              },
              children() {
                renderText`${et.getValue().id}`
                fdom.input()
              }
            })

            const ob = new ResizeObserver(entry => {
              const blockSize = entry[0].borderBoxSize[0].blockSize
              // console.log('entry', randomHeight, blockSize)
              if (needRemoveDiff == key) {
                scrollY.silentDiff(blockSize)
                needRemoveDiff = undefined
              }
              et.getValue().height.set(blockSize)
              batchSignalEnd()
            })
            ob.observe(div)
            hookDestroy(() => {
              ob.disconnect()
            })
          })

        }
      })
    }
  })
}