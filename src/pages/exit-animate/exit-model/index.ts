import { fdom } from "mve-dom"
import {  hookTrackSignal, renderArrayKey } from "mve-helper"
import { createSignal, ExitModel, GetValue } from "wy-helper"
import { getExitAnimate } from 'mve-helper'
import { animate } from "motion"
import { faker } from "@faker-js/faker"
export default function () {

  type ListRow = {
    time: number
    id: number
  }
  const initList = [
    {
      id: Date.now(),
      time: Date.now()
    }
  ]
  const list = createSignal<ListRow[]>(initList)
  function renderRow(getRow: GetValue<ExitModel<ListRow>>, getIndex: GetValue<number>) {
    const div = fdom.li({
      className: 'daisy-list-row',
      children() {
        fdom.span({
          className: 'text-4xl font-thin opacity-30 tabular-nums',
          childrenType: "text",
          children: getIndex
        })
        fdom.span({
          className: 'list-col-grow',
          childrenType: "text",
          children() {
            return getRow().value.time + ''
          }
        })
        fdom.button({
          childrenType: "text",
          children: "x",
          className: 'daisy-btn',
          onClick() {
            list.set(list.get().filter(x => x.id != getRow().value.id))
          }
        })
        fdom.button({
          childrenType: "text",
          children: "替换",
          className: 'daisy-btn daisy-btn-accent',
          onClick() {
            list.set(
              list.get().map(v => {
                if (v.id == getRow().value.id) {
                  return {
                    ...v,
                    id: Date.now(),
                    time: Date.now()
                  }
                }
                return v
              })
            )
          }

        })
      }
    })
    return div
  }


  fdom.div({
    className: 'overflow-y-auto overflow-x-hidden flex flex-col items-center gap-2',
    children() {
      const newList = getExitAnimate(list.get, v => v.id, {
        wait: "out-in"
      })
      fdom.ul({
        className: 'daisy-list rounded-box shadow-md',
        children() {
          renderArrayKey(newList, v => v.key, function (getRow, getIndex, key) {
            const div = renderRow(getRow, getIndex)
            hookTrackSignal(() => getRow().step, function (value) {
              if (value == 'enter') {
                animate(div, {
                  x: ['100%', 0]
                }).then(getRow().resolve)
              } else if (value == 'exiting') {
                animate(div, {
                  x: [0, '100%']
                }).then(getRow().resolve)
              }
            })
          })
        }
      })

      fdom.button({
        onClick() {
          const row = {
            id: Date.now(),
            time: Date.now()
          }
          const rows = list.get().slice()
          const idx = faker.number.int({
            min: 0,
            max: rows.length
          })
          rows.splice(idx, 0, row)
          list.set(rows)
        },
        className: 'daisy-btn daisy-btn-primary',
        childrenType: "text",
        children: "随机增加"
      })
    }
  })
}

