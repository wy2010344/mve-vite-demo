import { faker } from "@faker-js/faker";
import { animate } from "motion";
import { fdom, renderTextContent } from "mve-dom";
import { ExitArrayCloneOut, ExitArrayCloneOutList, renderExitArrayClone } from "mve-dom-helper";
import { ExitModel, getExitAnimateArray, hookTrackSignal, renderArray, renderIf, renderOne } from "mve-helper";
import { createSignal, GetValue } from "wy-helper";
import explain from "../../explain";
import markdown from "../../markdown";
import { hookAddResult } from "mve-core";


/**
 * @todo
 * 退出的时候,克隆元素
 */
export default function () {
  const initList = [
    {
      time: Date.now()
    }
  ]
  const list = createSignal<{
    time: number
  }[]>(initList)

  explain(function () {
    markdown`
# 数据驱动的退出动画
* mode
    * pop: 退出元素在最后
    * shift: 退出元素在最前
* wait 
    * normal: 同时进出
    * in-out: 选进后出
    * out-in: 先出后进
    
其它:
  可以控制忽略动画,比如初始化页面不动画    
    `
  })

  function renderRow(row: ExitModel<RowModel>, getIndex: GetValue<number>) {
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
          children: row.value.time + ''
        })
        fdom.button({
          childrenType: "text",
          children: "x",
          className: 'daisy-btn',
          onClick() {
            list.set(list.get().filter(x => x != row.value))
          }
        })
        fdom.button({
          childrenType: "text",
          children: "替换",
          className: 'daisy-btn daisy-btn-accent',
          onClick() {
            list.set(
              list.get().map(v => {
                if (v == row.value) {
                  return {
                    ...v,
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
    s_overflowY: 'auto',
    s_overflowX: 'hidden',
    s_display: 'flex',
    s_flexDirection: 'column',
    s_alignItems: 'center',
    s_gap: '10px',
    children() {

      const modeIdx = createSignal(0)
      const waitIdx = createSignal(0)
      function mode() {
        const idx = modeIdx.get() % 2
        if (idx == 0) {
          return 'pop'
        } else if (idx == 1) {
          return 'shift'
        }
      }
      function wait() {
        const idx = waitIdx.get() % 3
        if (idx == 1) {
          return 'in-out'
        } else if (idx == 2) {
          return 'out-in'
        }
      }
      const getList = getExitAnimateArray(list.get, {
        mode,
        wait,
        enterIgnore() {
          return initList == list.get()
        }
      })


      fdom.div({
        s_display: 'flex',
        s_gap: "10px",
        children() {
          fdom.button({
            className: 'daisy-btn',
            childrenType: "text",
            onClick() {
              modeIdx.set(modeIdx.get() + 1)
            },
            children() {
              return `mode: ${mode() || 'normal'}`
            }
          })
          fdom.button({
            className: 'daisy-btn',
            childrenType: "text",
            onClick() {
              waitIdx.set(waitIdx.get() + 1)
            },
            children() {
              return `wait: ${wait() || 'normal'}`
            }
          })
        }
      })

      fdom.ul({
        className: 'daisy-list rounded-box shadow-md',
        children() {
          markdown`
退出元素使用的数据,是最后状态的数据
          `
          renderArray(getList, (row, getIndex) => {
            const div = renderRow(row, getIndex)

            renderOne(row.step, v => {
              renderTextContent(v)
            })
            hookTrackSignal(row.step, function (value) {
              if (!row.promise()) {
                return
              }
              if (value == 'enter') {
                animate(div, {
                  x: ['100%', 0]
                }).then(row.resolve)
              } else if (value == 'exiting') {
                animate(div, {
                  x: [0, '100%']
                }).then(row.resolve)
              }
            })
          })

          markdown`
退出时,采用对旧元素clone的方式,使元素内的数据保持不变
          `
          renderExitArrayClone(getList, (row, getIndex) => {
            const div = renderRow(row, getIndex)
            if (row.promise()) {
              animate(div, {
                x: ['100%', 0]
              }).then(row.resolve)
            }
            return {
              node: div,
              applyAnimate(node) {
                if (row.promise()) {
                  animate(node as HTMLDivElement, {
                    x: [0, '100%']
                  }).then(row.resolve)
                }
              },
            }
          })
        }
      })

      fdom.button({
        onClick() {
          const row = {
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

type RowModel = {
  time: number
}
