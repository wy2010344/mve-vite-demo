import { emptyArray, createSignal, trackSignal, memo, StoreRef, addEffect } from "wy-helper"
import { dom, fdom, fsvg, svg } from 'mve-dom'
import { renderArray } from 'mve-helper'
import { hookAddDestroy } from "mve-core"
import { renderContentEditable, renderInput, renderInputBool } from "mve-dom-helper"
import { contentEditableText } from "wy-dom-helper/contentEditable"

export default () => {

  dom.div({
    className: "p-8 bg-green-400"
  }).render(() => {
    const a = createSignal(0)
    const b = createSignal(0)

    /**
     * 溢出而不隐藏,则仍然能点击
     */
    dom.div({
      className: "s",
      style: {
        width: '300px',
        height: '200px',
        background: 'blue',
        position: 'absolute',
        right: 0,
        overflow: 'hidden'
      }
    }).render(() => {
      dom.button({
        style: {
          left: '-100px',

          position: 'absolute'
        },
        onClick(e) {
          console.log("click")
        }
      }).renderText`abc`
    })


    const ab = memo(() => {
      console.log("ab", a.get() + b.get())
      return a.get() + b.get()
    })

    dom.div({
      onClick() {
        console.log("sab", ab())
      }
    }).renderText`测试memo`
    const list = createSignal<number[]>(emptyArray as number[])
    const list1 = createSignal<number[]>(emptyArray as number[])
    dom.button({
      onClick() {
        a.set(a.get() + 1)
        b.set(b.get() + 2)
        list1.set([Date.now()].concat(list1.get()))
        list.set(list.get().concat(Date.now()))
      }
    }).renderText`点击${a.get}`

    dom.hr().render()

    trackSignal(() => {
      return a.get() + b.get()
    }, x => {
      console.log("跟踪到", x)
    })
    dom.span().renderText`--${b.get}--`

    dom.hr().render()


    dom.div({
      "data-abc": "999",
      "aria-hidden": true,
      style: {
        "--abc": 99,
        left: '30px'
      }
    }).render(() => {
      renderList(list1)
      dom.hr().render()
      renderList(list)
    })
  })

  svg.svg().render(() => {
    svg.rect({
      width: 400,
      height: 300,
    }).render()
  })

  fsvg.svg({
    children() {
      fsvg.rect({
        width: 89,
        height: 33,
        s_fill: "red",
        s_stroke: "blue",
        s_strokeWidth: 9
      })
    }
  })
  fdom.button({
    s_display: "flex",
    children() {
      fdom.div({
        childrenType: "text",
        children: "abc"
      })
      fdom.div({
        childrenType: "text",
        children: "bbb"
      })
      fsvg.svg({
        children() {
          fsvg.rect({
            x: 9,
            y: 8,
            css_abc: 98
          })
        }
      })
      fdom.button({
        childrenType: "text",
        onClick() {
          console.log("点击")
        },
        children: "abc"
      })
    }
  })

  const value = createSignal('')
  renderInput("input", {
    className: "border-solid border-[black] border-spacing-1 border-[1px]",
    value: value.get,
    onValueChange(v) {
      if (isNaN(Number(v))) {
        return
      }
      value.set(v)
    },
    onInput(e) {
      console.log("dd", e)
    }
  })

  const text = createSignal('1')
  renderContentEditable("pre", {
    value: text.get,
    className: "min-w-1",
    contentEditable: contentEditableText,
    onValueChange(v: string) {
      if (isNaN(Number(v))) {
        return
      }
      // text.set(v)
    },
  })

  const checked = createSignal(false)
  renderInputBool({
    type: "checkbox",
    checked: checked.get,
    onInput(e) {
      checked.set(e.currentTarget.checked)
    }
  })

  getOnClick()
}

function renderList(list: StoreRef<number[]>) {

  renderArray(list.get, (row, getIndex) => {
    dom.div().renderText`---${row}--- ${getIndex}---`
    dom.button({
      onClick() {
        addEffect(() => {
          console.log("destroy", getIndex, row, list.get().length)
        })
        list.set(list.get().filter(v => v != row))
      }
    }).renderText`删除`
    count()
    hookAddDestroy()(() => {
      console.log("销毁了...")
    })
    addEffect(() => {
      console.log("getRow", getIndex, row)
    })
  })
}


function count() {
  const s = createSignal(0)

  dom.button({
    onClick() {
      s.set(s.get() + 1)
    }
  }).renderText`增加数字${s.get}`
}


function getOnClick() {

  const a = createSignal(0)
  const b = createSignal(0)
  const m = createSignal(0)

  const c = memo(() => {

    console.log("render...")
    return [a.get(), b.get(), m.get()]
  })

  fdom.button({
    onClick() {
      a.set(a.get() + 1)
      b.set(b.get() + 1)

      console.log("新", a.get(), b.get(), c())

      // m.set(m.get() + 1)
    },
    childrenType: "text",
    children() {
      return `${a.get()}--${b.get()}---${c()}`
    }
  })
}