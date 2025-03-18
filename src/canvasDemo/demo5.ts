import { addEffect, createSignal, emptyArray } from "wy-helper";
import { hookDrawRect, simpleFlex, hookDrawText, CanvasRectNode, hookDrawTextWrap } from "mve-dom-helper/canvasRender";
import { renderArray } from "mve-helper";
import { dom, renderPortal } from "mve-dom";
import { hookAlterStateHolder, hookCurrentStateHolder } from "mve-core";

export default function () {

  const a = createSignal(0)
  const list = createSignal(emptyArray as readonly number[])



  hookDrawRect({
    layout(v) {
      return simpleFlex({
        direction: "y"
      })
    },
    children() {

      renderArray(list.get, function (row, getIndex) {
        console.log("list", row)
        const n: CanvasRectNode = hookDrawText({
          height: 100,
          config() {
            return {
              fontFamily: 'serif',
              fontSize: '20px',
              textBaseline: "top",
              text: `${n.target.index()},${a.get()}:${row}--${getIndex()}`,
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
        height: 60,
        config() {
          return {
            fontSize: '60px',
            fontWeight: 'bold',
            fontFamily: "serif",
            text: "点击",
          }
        },
        drawInfo(arg) {
          console.log("dd", arg)
          return {}
        },
        onClick() {
          a.set(a.get() + 1)
          list.set(list.get().concat(Date.now()))
          console.log("dd", list.get())
        }
      })
    },
  })
}

