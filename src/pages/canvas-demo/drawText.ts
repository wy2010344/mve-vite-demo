import { fdom, renderPortal } from 'mve-dom'
import {
  hookCurrentCtx,
  hookCurrentDraw,
  hookDrawTextWrap,
  hookStroke,
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
    draw(ctx, n, draw, p) {
      hookCurrentDraw()
      hookStroke(1, 'black')
      ctx.fillStyle = 'rgba(0, 120, 215, 0.3)'
      // ctx.fillRect(0, 0, 20, o.measure().lineHeight);
      const { list: mg, lineHeight } = memoGraphs()
      const start = selectStart.get()
      const end = selectEnd.get()
      const xy = cursorPosition()
      if (xy) {
        // console.log("x", start, x, y);
        ctx.fillRect(xy.x, xy.y, 2, lineHeight)
      } else {
        let beginY = 0,
          endY = 0
        let beginX = 0,
          endX = 0
        const [min, max] = start > end ? [end, start] : [start, end]
        let index = 0
        let notFound = true
        for (let y = 0; y < mg.length && notFound; y++) {
          const row = mg[y]
          for (let x = 0; x < row.glyphs.length; x++) {
            if (index == min) {
              beginY = y
              beginX = x
            }
            if (index == max) {
              endY = y
              endX = x
              notFound = false
              break
            }
            index++
          }
        }

        function fillSelect(y: number, start: number, end: number) {
          if (start == end) {
            return
          }
          ctx.fillRect(start, y, end - start, lineHeight)
        }
        if (beginY == endY) {
          const row = mg[beginY]
          const start = row.glyphs[beginX].x
          const end = row.glyphs[endX]
          fillSelect(row.y, start, end.x)
        } else {
          const beginRow = mg[beginY]
          const start = beginRow.glyphs[beginX].x
          const end = beginRow.glyphs.at(-1)!
          fillSelect(beginRow.y, start, end.x + end?.w)
          for (let i = beginY + 1; i < endY; i++) {
            const row = mg[i]
            const end = row.glyphs.at(-1)!
            fillSelect(row.y, 0, end.x + end?.w)
          }
          const endRow = mg[endY]
          fillSelect(endRow.y, 0, endRow.glyphs[endX].x)
        }
      }
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

  const cursorPosition = memo(() => {
    const start = selectStart.get()
    const end = selectEnd.get()
    if (start == end) {
      return getPosition(start)
    }
  })
  function getPosition(start: number) {
    const { list: mg, lineHeight } = memoGraphs()
    let mx = 0,
      my = 0
    let notFound = true
    let index = 0
    for (let y = 0; y < mg.length && notFound; y++) {
      const row = mg[y]
      const nextIndex = index + row.glyphs.length
      if (index <= start && start < nextIndex) {
        const diff = start - index
        const cell = row.glyphs[diff]
        mx = cell.x
        my = row.y
        notFound = false
      }
      index = nextIndex
    }
    return {
      x: mx,
      y: my,
    }
  }
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

  type Glyph = {
    char: string
    x: number
    y: number
    w: number
  }
  function getIndex(e: Point) {
    const { list: mg, lineHeight } = memoGraphs()
    let index = 0
    let notFound = true
    for (let y = 0; y < mg.length && notFound; y++) {
      const row = mg[y]
      if (row.y < e.y && e.y < row.y + lineHeight) {
        for (let x = 0; x < row.glyphs.length; x++) {
          const cell = row.glyphs[x]
          if (e.x < cell.x + cell.w / 2) {
            return index
          }
          index++
        }
        return index
      }
      index += row.glyphs.length
    }
    return index
  }
  const memoGraphs = memo(() => {
    const mout = o.measure()
    const ctx = hookCurrentCtx()
    const list = mout.lines.map((line, i) => {
      const chars = [...line.text]
      let beforeWidth = 0
      const y = i * mout.lineHeight
      const glyphs: Glyph[] = []
      for (let i = 0; i < chars.length; i++) {
        const subText = chars.slice(0, i + 1).join('')
        const afterWidth = ctx.measureText(subText).width
        glyphs.push({
          char: chars[i],
          x: beforeWidth,
          y,
          w: afterWidth - beforeWidth,
        })
        beforeWidth = afterWidth
      }
      return {
        y,
        glyphs,
      }
    })
    return {
      list,
      lineHeight: mout.lineHeight,
    }
  })
}

function sum(list: number[]) {
  let sum = 0
  for (let i = 0; i < list.length; i++) {
    sum += list[i]
  }
  return sum
}
