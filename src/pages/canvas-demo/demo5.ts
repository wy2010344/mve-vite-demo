import { addEffect, createSignal, emptyArray } from "wy-helper";
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawTextWrap } from "mve-dom-helper/canvasRender";
import { renderArray } from "mve-helper";
import { dom, renderPortal } from "mve-dom";
import { hookAlterStateHolder, hookCurrentStateHolder } from "mve-core";

export default function () {

  const a = createSignal(0)
  const list = createSignal(emptyArray as readonly number[])



  hookDrawRect({
    layout(v) {
      return simpleFlex({
        direction: "y",
        gap: 4
      })
    },
    children() {

      hookDrawRect({
        width: 200,
        height: 200,
        ext: {
          notFlex: true
        },
        draw(ctx, n, p) {
          return {
            operates: [
              {
                type: "fill",
                style: 'yellow'
              }
            ]
          }
        },
      })
      renderArray(list.get, function (row, getIndex) {
        const n = hookDrawText({
          height(n) {
            return n * 1.5
          },
          config() {
            return {
              fontFamily: 'serif',
              fontSize: '20px',
              textBaseline: "top",
              text: `${n.target.index()},${a.get()}:${row}--${getIndex()}中文移动硬盘XXxxYYyy`,
            }
          },
          draw(ctx, n, draw, p) {
            return {
              operates: [
                {
                  type: 'fill',
                  style: 'red'
                },
                {
                  type: "draw",
                  callback: draw
                }
              ]
            }
          },
          onClick(e) {
            list.set(list.get().filter(v => v != row))
          },
        })

        const s = hookCurrentStateHolder()
        addEffect(() => {
          hookAlterStateHolder(s)
          renderPortal(document.body, () => {
            dom.div().renderText`${() => n.target.index()}:${a.get}`
          })
          hookAlterStateHolder(undefined)
        })
      })
      hookDrawText({
        config() {
          return {
            fontSize: '60px',
            fontWeight: 'bold',
            fontFamily: "serif",
            text: "点击",
          }
        },
        draw(ctx, n, draw, p) {
          return {
            operates: [
              {
                type: "fill",
                style: "red"
              },
              {
                type: "draw",
                callback: draw
              }
            ]
          }
        },
        // drawInfo(arg) {
        //   console.log("dd", arg)
        //   return {}
        // },
        onClick() {
          a.set(a.get() + 1)
          list.set(list.get().concat(Date.now()))
          console.log("dd", list.get())
        }
      })
    },
  })
}

