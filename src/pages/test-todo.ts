import { faker } from "@faker-js/faker";
import { fdom, renderText, renderTextContent } from "mve-dom";
import { renderContentEditable, renderInput } from "mve-dom-helper";
import { renderArrayKey } from "mve-helper";
import { contentEditableText } from "wy-dom-helper/contentEditable";
import { createSignal, emptyArray } from "wy-helper";

export default function () {



  const list = createSignal<{
    time: number
    value: number
  }[]>(emptyArray as any[])

  fdom.ul({
    children() {

      renderArrayKey(list.get, v => v.time, function (getValue, getIndex, key) {
        fdom.li({
          children() {
            renderText`${key}`
            renderText`-----`
            fdom.span({
              childrenType: "text",
              children: getIndex
            })
            renderText`-----`
            fdom.span({
              childrenType: "text",
              children() {
                return getValue().time
              }
            })

            renderText`-----`
            fdom.span({
              childrenType: "text",
              children() {
                return getValue().value
              }
            })

            fdom.input({
              className: 'inline'
            })
            const value = createSignal<string | null>(null)
            renderContentEditable(value.get, value.set, fdom.span({
              contentEditable: contentEditableText
            }))
            fdom.button({
              className: 'daisy-btn',
              childrenType: "text",
              children: '移动',
              onClick() {
                const out = list.get().toSpliced(getIndex(), 1)
                out.splice(faker.number.int({
                  min: 0,
                  max: out.length
                }), 0, {
                  ...getValue(),
                  value: Date.now()
                })
                list.set(
                  out
                )
              }
            })
            fdom.button({
              className: 'daisy-btn',
              childrenType: "text",
              children: '替换value',
              onClick() {
                list.set(
                  list.get().toSpliced(getIndex(), 1, {
                    ...getValue(),
                    value: Date.now()
                  })
                )
              }
            })
          }
        })
      })
    }
  })
  fdom.button({
    childrenType: 'text',
    children: 'add',
    onClick() {
      list.set(
        list.get().concat({
          time: Date.now(),
          value: Date.now()
        })
      )
    }
  })
}