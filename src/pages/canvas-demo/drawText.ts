import { fdom, renderPortal } from 'mve-dom'
import {
  hookCurrentCtx,
  hookCurrentDraw,
  hookDrawTextWrap,
  hookStroke,
  drawTextWrapWithSelect,
} from 'mve-dom-helper/canvasRender'
import { renderIf } from 'mve-helper'
import { addEffect, createSignal, memo, Point } from 'wy-helper'

export default function () {
  const selectStart = createSignal(0)
  const selectEnd = createSignal(0)
  const didInit = createSignal(false)
  addEffect(() => didInit.set(true))
  const text = createSignal(`TS
类型.  
:(context: SubmitContext<FormData>) => void
表单提交时触发。其中 context.validateResult 表示校验结果，context.firstError 表示校验不通过的第一个规则提醒。context.validateResult 值为 true 表示校验通过；如果校验不通过，context.validateResult 值为校验结果列表。`)
  const o = hookDrawTextWrap({
    width: 300,
    drawInfo: {},
    config() {
      return {
        maxLines: 5,
        // letterSpacing: "10px",
        text: text.get(),
      }
    },
    draw(ctx, _d, p) {
      hookCurrentDraw()
      hookStroke(1, 'black')
      ctx.fillStyle = 'rgba(0, 120, 215, 0.3)'
      draw(ctx)
      // ctx.fillRect(0, 0, 20, o.measure().lineHeight);
    },
    onPointerDown(e) {
      selectStart.set(getIndex(e))
      selectEnd.set(selectStart.get())
      e.original.currentTarget?.addEventListener('pointermove', onMove as any)
    },
    onPointerUp(e) {
      e.original.currentTarget?.removeEventListener(
        'pointermove',
        onMove as any
      )
      if (selectStart.get() == selectEnd.get()) {
        input.focus()
      }
    },
  })

  const { cursorPosition, getIndex, draw } = drawTextWrapWithSelect({
    selectStart: selectStart.get,
    selectEnd: selectEnd.get,
    get: o,
  })
  let input: HTMLInputElement
  renderPortal(document.body, function () {
    renderIf(
      () => didInit.get() && cursorPosition(),
      function () {
        function didInput() {
          const v = input.value
          console.log(v)
          const t = text.get()
          const newV =
            t.slice(0, selectStart.get()) + v + t.slice(selectStart.get())
          text.set(newV)
          selectStart.set(selectStart.get() + v.length)
          selectEnd.set(selectEnd.get() + v.length)
          input.value = ''
        }
        input = fdom.input({
          className: 'absolute w-0 h-0',
          s_left() {
            return o.target.getAbsolute('x') + (cursorPosition()?.x || 0) + 'px'
          },
          s_top() {
            return o.target.getAbsolute('y') + (cursorPosition()?.y || 0) + 'px'
          },
          onInput(e) {
            if (e.isComposing) {
              return
            }
            didInput()
          },
          onCompositionEnd: didInput,
        })
      }
    )
  })
  function onMove(e: PointerEvent) {
    const x = e.clientX - o.target.getAbsolute('x')
    const y = e.clientY - o.target.getAbsolute('y')
    selectEnd.set(
      getIndex({
        x,
        y,
      })
    )
  }
}

function sum(list: number[]) {
  let sum = 0
  for (let i = 0; i < list.length; i++) {
    sum += list[i]
  }
  return sum
}
