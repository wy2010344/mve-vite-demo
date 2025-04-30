import { renderCode } from "mve-dom-helper";
import { contentEditableText, initContentEditableModel } from "wy-dom-helper/contentEditable";
import { batchSignalEnd, createSignal, emptyFun, tw } from "wy-helper";
import { Message, parseSentence, toFillToken } from "./parse";
import { runParse } from "wy-helper/tokenParser";
import { evalOneExp } from "./evalTree";
import { dom, fdom, renderPortal, renderText } from "mve-dom";
import { hookDestroy, hookTrackSignal } from "mve-helper";
import { topScope } from "./define";
import { endNotFillToToken } from "wy-helper/infixLang";
import { cns, initPrisma, subscribeEventListener } from "wy-dom-helper";
import { arrow, autoPlacement, autoUpdate, computePosition, hide, offset } from '@floating-ui/dom';

initPrisma()
export default function () {
  fdom.div({
    className: "flex",
    children() {
      renderInputArea("A1")
      // renderInputArea("A2")
    }
  })
}


function renderInputArea(saveKey: string) {
  const model = createSignal(
    initContentEditableModel(localStorage.getItem(saveKey) || '')
  )
  const { current, renderContentEditable } = renderCode(model)
  hookTrackSignal(() => {
    return current().value
  }, value => {
    localStorage.setItem(saveKey, value)
  })
  renderContentEditable({
    render(value, a) {
      const div = fdom.pre({
        className: "daisy-textarea",
        contentEditable: contentEditableText,
        ...a,
        spellcheck: false,
        children() {
          try {
            const text = current().value
            const out = runParse(text, parseSentence)
            console.log("out", out, evalOneExp(out, topScope, false))
            const mlist = toFillToken(out, text)

            let id = 0
            mlist.forEach(row => {
              const span = dom.span({
                className: `token ${row.type} ${hasError(row.messages)
                    ? tw`decoration-error [text-decoration-line:spelling-error]`
                    : row.messages?.length ? tw`decoration-info` : ``
                  }`
              }).renderTextContent(row.value)
              if (row.messages) {
                const anchorName = `--tokenAnchor${id++}`;
                span.style.setProperty('anchor-name', anchorName)
                const hover = createSignal(false)
                hookDestroy(subscribeEventListener(span, 'pointerenter', e => {
                  hover.set(true)
                }))
                hookDestroy(subscribeEventListener(span, 'pointerleave', e => {
                  hover.set(false)
                }))
                renderPortal(document.body, () => {
                  const panel = fdom.ul({
                    className: `fixed [justify-self:anchor-center] bottom-[anchor(top)] daisy-list`,
                    s_opacity() {
                      return hover.get() ? 1 : 0
                    },
                    s_pointerEvents() {
                      return hover.get() ? 'all' : 'none'
                    },
                    children() {
                      row.messages.forEach(message => {
                        dom.li({
                          className: `daisy-list-row daisy-alert ${message.type == 'error' ? `daisy-alert-error` : `daisy-alert-info`}`
                        }).renderTextContent(message.value)
                      })
                    }
                  });
                  panel.style.setProperty('position-anchor', anchorName)
                })
              }
            })
          } catch (err) {
            console.log("dd", err)
            fdom.span({
              childrenType: "text",
              children: value
            })
          }
        }
      })
      return div
    },
  })
  hookTrackSignal(() => {
  }, emptyFun)
}


function hasError(messages: Message[]) {
  return messages?.some(message => message.type == 'error')
}
/*
(a=Any,b=Mnuz)=>(
y=Str,
z=Any,
m=Num
),
M=98
*/