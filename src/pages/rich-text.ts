import { faker } from "@faker-js/faker";
import { dom, fdom, renderTextContent } from "mve-dom";
import { renderCode } from "mve-dom-helper";
import { hookTrackSignal } from "mve-helper";
import { contentEditableText, initContentEditableModel } from "wy-dom-helper/contentEditable";
import { createSignal } from "wy-helper";
import explain from "../explain";
import markdown from "../markdown";
import fixRightTop from "../fixRightTop";
import themeDropdown from "../themeDropdown";

export default function () {
  fixRightTop(function () {
    themeDropdown()
  })

  explain(() => {
    markdown`
# 文本编辑与特殊渲染
目前主要可用于类似于代码录入,对不同的token进行不同的渲染
    `
  })
  const storeKey = 'rich-text-demo'
  const storeValue = localStorage.getItem(storeKey)
  const model = createSignal(storeValue ? {
    currentIndex: 0,
    history: [
      JSON.parse(storeValue)
    ]
  } : initContentEditableModel(`abc @john check this https://chatgpt.com and email me at test@example.com`))
  const { current, renderContentEditable } = renderCode(model)

  hookTrackSignal(current, value => {
    localStorage.setItem(storeKey, JSON.stringify(value))
  })
  const readonly = createSignal(false)
  fdom.div({
    children() {
      fdom.button({
        className: 'daisy-btn',
        childrenType: 'text',
        onClick() {
          readonly.set(!readonly.get())
        },
        children() {
          return readonly.get() ? '转为编辑' : '转为只读'
        }
      })
      renderContentEditable({
        render(value, a) {
          return fdom.pre({
            ...a,
            className: 'prose daisy-prose',
            contentEditable() {
              return readonly.get() ? false : contentEditableText
            },
            spellcheck: false,
            children() {
              const out = extractEntities(value)
              out.forEach(item => {
                if (typeof item == 'string') {
                  renderTextContent(item)
                } else if (item.type == 'at') {
                  fdom.span({
                    className: 'daisy-tooltip text-primary ',
                    children() {
                      fdom.div({
                        className: 'daisy-tooltip-content not-prose',
                        children() {
                          fdom.div({
                            className: 'daisy-card',
                            children() {
                              fdom.div({
                                className: 'daisy-avatar',
                                children() {
                                  fdom.div({
                                    className: 'ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2',
                                    children() {
                                      fdom.img({
                                        src: faker.image.avatar(),
                                      })
                                    }
                                  })
                                }
                              })
                            }
                          })
                          fdom.div({
                            className: 'animate-bounce text-orange-400 -rotate-10 text-2xl font-black',
                            childrenType: 'text',
                            children: `Wow!`,
                          })
                        }
                      })
                      renderTextContent(item.value)
                    }
                  })
                } else if (item.type == 'url') {
                  fdom.a({
                    href: item.value,
                    childrenType: 'text',
                    target: "_blank",
                    children: item.value
                  })
                } else if (item.type == 'email') {
                  fdom.a({
                    href: `mailto:${item.value}`,
                    childrenType: 'text',
                    target: "_blank",
                    children: item.value
                  })
                }
              })
            }
          })
        },
      })
    }
  })
}


function extractEntities(text: string) {
  const regex = /(@\w+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+)/g;

  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 提取匹配项前的普通文本
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      result.push({ type: "at", value: match[1] }); // @用户名
    } else if (match[2]) {
      result.push({ type: "email", value: match[2] }); // 邮箱
    } else if (match[3]) {
      result.push({ type: "url", value: match[3] }); // 网址
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}