import { faker } from '@faker-js/faker'
import { dom, fdom, renderPortal, renderTextContent } from 'mve-dom'
import {
  renderCodeChange,
  renderContentEditable,
  useContentEditable,
} from 'mve-dom-helper'
import { hookDestroy, hookTrackSignal } from 'mve-helper'
import {
  contentEditableText,
  addSimpleEvent,
} from 'wy-dom-helper/contentEditable'
import { addEffect, batchSignalEnd, createSignal, tw } from 'wy-helper'
import explain from '../../explain'
import markdown from '../../markdown'
import fixRightTop from '../../fixRightTop'
import themeDropdown from '../../themeDropdown'
import {
  arrow,
  autoPlacement,
  autoUpdate,
  computePosition,
  hide,
  offset,
} from '@floating-ui/dom'
import { hookAddDestroy } from 'mve-core'
import { cns } from 'wy-dom-helper'

export default function () {
  fixRightTop(function () {
    themeDropdown()
  })

  explain(() => {
    markdown`
# 文本编辑与特殊渲染

目前主要可用于类似于代码录入,对不同的 token 进行不同的渲染
    `
  })
  const storeKey = 'rich-text-demo'
  const storeValue = localStorage.getItem(storeKey)

  const map = {} as Record<string, string>
  function images(name: string) {
    if (!map[name]) {
      map[name] = faker.image.avatar()
    }
    return map[name]
  }
  const initValue = `abc @john check this https://chatgpt.com and email me at test@example.com`
  const value = createSignal(storeValue || initValue)
  hookTrackSignal(value.get, (value) => {
    localStorage.setItem(storeKey, value)
  })

  const model = renderCodeChange(value.get, value.set)
  const { current, renderContentEditable } = useContentEditable(model.get)

  const readonly = createSignal(false)
  fdom.div({
    className: 'overflow-auto',
    children() {
      fdom.button({
        className: 'daisy-btn',
        childrenType: 'text',
        onClick() {
          readonly.set(!readonly.get())
        },
        children() {
          return readonly.get() ? '转为编辑' : '转为只读'
        },
      })
      dom.button({
        className: 'daisy-btn',
        onClick() {
          value.set(initValue)
        },
      }).renderText`重置`
      renderContentEditable({
        children(value) {
          return addSimpleEvent(
            model,
            fdom.pre({
              className: 'prose daisy-prose whitespace-pre-wrap ',
              contentEditable() {
                return readonly.get() ? false : contentEditableText
              },
              spellCheck: false,
              children() {
                const out = extractEntities(value)
                out.forEach((item) => {
                  if (typeof item == 'string') {
                    renderTextContent(item)
                  } else if (item.type == 'at') {
                    const hover = createSignal(false)
                    const atSpan = fdom.span({
                      //@todo 这里文本一定要渲染到外面去!!
                      className: 'text-primary ',
                      onPointerEnter(e) {
                        hover.set(true)
                      },
                      onPointerLeave(e) {
                        hover.set(false)
                      },
                      children() {
                        renderTextContent(item.value)
                      },
                    })
                    renderPortal(document.body, () => {
                      fdom.div({
                        className: 'fixed',
                        s_opacity() {
                          return hover.get() ? 1 : 0
                        },
                        s_pointerEvents() {
                          return hover.get() ? 'all' : 'none'
                        },
                        children(tooltip: HTMLElement) {
                          const loc = createSignal(1)
                          const anchor = fdom.div({
                            className() {
                              const l = loc.get()
                              return cns(
                                'absolute w-4 h-4 border-8 border-transparent',
                                l == 1 &&
                                  tw`border-b-base-100 top-0 translate-y-[-100%]`,
                                l == 2 &&
                                  tw`border-t-base-100 bottom-0 translate-y-[100%] `
                              )
                            },
                          })
                          hookDestroy(
                            autoUpdate(atSpan, tooltip, function () {
                              computePosition(atSpan, tooltip, {
                                middleware: [
                                  autoPlacement({
                                    allowedPlacements: ['top', 'bottom'],
                                  }),
                                  arrow({ element: anchor }),
                                  offset(10),
                                  hide(),
                                ],
                              }).then(({ x, y, middlewareData }) => {
                                tooltip.style.left = x + 'px'
                                tooltip.style.top = y + 'px'
                                const index =
                                  middlewareData.autoPlacement?.index
                                if (index && index != loc.get()) {
                                  loc.set(index)
                                  batchSignalEnd()
                                }

                                const arrow = middlewareData.arrow
                                if (arrow) {
                                  anchor.style.left = arrow.x + 'px'
                                  anchor.style.top = arrow.y + 'px'
                                }
                                tooltip.style.display = middlewareData.hide
                                  ?.referenceHidden
                                  ? 'none'
                                  : ''
                              })
                            })
                          )

                          fdom.div({
                            className:
                              'flex items-center gap-1 flex-col justify-center p-1 shadow-xl bg-base-100',
                            s_boxShadow: `0px 0px 20px 0px rebeccapurple`,
                            children() {
                              fdom.div({
                                className:
                                  'daisy-avatar w-24 rounded-full overflow-hidden',
                                children() {
                                  fdom.img({
                                    src: images(item.value),
                                    alt: 'name',
                                  })
                                },
                              })
                              fdom.h2({
                                className: 'daisy-card-title text-lg font-bold',
                                childrenType: 'text',
                                children: item.value,
                              })
                            },
                          })
                          fdom.div({
                            className:
                              'absolute top-0 animate-bounce text-orange-400 -rotate-10 text-2xl font-black',
                            childrenType: 'text',
                            children: `Wow!`,
                          })
                        },
                      })
                      // hookDestroy()
                    })
                  } else if (item.type == 'url') {
                    fdom.a({
                      href: item.value,
                      childrenType: 'text',
                      target: '_blank',
                      children: item.value,
                    })
                  } else if (item.type == 'email') {
                    fdom.a({
                      href: `mailto:${item.value}`,
                      childrenType: 'text',
                      target: '_blank',
                      children: item.value,
                    })
                  }
                })
              },
            })
          )
        },
      })
    },
  })
}

function extractEntities(text: string) {
  const regex =
    /(@\w+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+)/g

  let result = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // 提取匹配项前的普通文本
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      result.push({ type: 'at', value: match[1] }) // @用户名
    } else if (match[2]) {
      result.push({ type: 'email', value: match[2] }) // 邮箱
    } else if (match[3]) {
      result.push({ type: 'url', value: match[3] }) // 网址
    }

    lastIndex = regex.lastIndex
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex))
  }

  return result
}
