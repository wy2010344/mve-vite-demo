import { faker } from "@faker-js/faker";
import { fdom } from "mve-dom";
import { hookDestroy, hookTrackSignal, renderOne } from "mve-helper";
import { addEffect, arrayCountCreateWith, createSignal } from "wy-helper";

export default function () {


  const tags = arrayCountCreateWith(10, i => {
    return faker.food.fruit()
  })



  const showCounts = createSignal(0)

  const version = createSignal(0)
  let finishedVersion = -1
  hookTrackSignal(() => {
    showCounts.get()
    version.get()
    return {}
  }, function () {
    if (finishedVersion == version.get()) {
      return
    }
    addEffect(() => {
      if (div.scrollWidth > div.clientWidth) {
        if (showCounts.get() > 0) {

          showCounts.set(showCounts.get() - 1)
        }
        //结束
        finishedVersion = version.get()
      } else {
        if (showCounts.get() < tags.length) {
          showCounts.set(showCounts.get() + 1)
        } else {
          //结束
          finishedVersion = version.get()
        }
      }
    })
  })
  const ob = new ResizeObserver(() => {
    version.set(version.get() + 1)
  })
  addEffect(() => {
    ob.observe(div)
  })
  hookDestroy(() => {
    ob.disconnect()
  })
  const div = fdom.div({
    className: 'w-30 h-30 bg-amber-200 resize overflow-hidden flex gap-1',
    children() {
      renderOne(showCounts.get, function (n) {
        for (let i = 0; i < n; i++) {
          fdom.div({
            className: 'daisy-badge whitespace-nowrap',

            childrenType: 'text',
            children: tags[i]
          })
        }
        const more = tags.length - n
        if (more) {
          fdom.div({
            className: 'daisy-badge',
            childrenType: 'text',
            children: `+${more}`
          })
        }
      })
    }
  })
}