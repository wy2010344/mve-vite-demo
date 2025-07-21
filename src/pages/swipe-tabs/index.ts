import { createTabList } from "daisy-mobile-helper";
import { createContext } from "mve-core";
import { fdom, renderTextContent } from "mve-dom";
import { movePage } from "mve-dom-helper";
import { renderArrayKey } from "mve-helper";
import { pointerMove, pointerMoveDir } from "wy-dom-helper";
import { createSignal, memo, ScrollDelta, SetValue, tw } from "wy-helper";
import { renderMobileView } from "~/onlyMobile";
/**
 * 原生滚动,优先滚动内部,再滚动外部
 * 即使手指不离开触摸
 * 简单是由拖拽那一刻确定,由拖拽初始方向决定拖拽
 * 拖拽就是滚动,滚动就是拖一下,滚动一下.
 *  拖一下方向是一定的.
 *  主要是继续拖的时候,原方向上没有复原,新的滚动是叠加在自身还是外部容器
 *  ——继续拖动,根据施加力,先叠加自身,再叠加到拖拽方向.
 */

export default function () {


  renderMobileView(function ({ }) {
    fdom.div({
      className: 'touch-none',
      children() {

        renderMoveX({
          className: 'h-150 bg-white',
          children(v) {
            renderTextContent(v)
            renderMoveX({
              sub: v,
              className: 'h-100',
              children(v, parentMove) {
                renderTextContent(v)


                renderMoveX({
                  sub: v,
                  className: 'bg-white flex items-center justify-center h-50',
                  children(v) {
                    renderTextContent(v)
                  }
                })
              }
            })
          }
        })
      }
    })
  })
}

const parentMoveCtx = createContext<{
  (e: PointerEvent): void
}>(undefined!)
function renderMoveX({
  sub = '',
  className = '',
  children
}: {
  sub?: string,
  className?: string
  children(v: string, move: SetValue<PointerEvent>): void
}) {
  const scrollX = movePage({
    getSize() {
      return container.clientWidth
    }
  })
  const tabs: {
    display: string
  }[] = [
      {
        display: 'A' + sub
      },
      {
        display: "B" + sub
      },
      {
        display: "C" + sub
      }
    ]
  const currentTab = createSignal(tabs[0].display)
  createTabList({
    options: tabs,
    value() {
      return tabs.find(x => x.display == currentTab.get())!
    },
    onChange(v) {
      currentTab.set(v.display)
    },
    renderChild(v) {
      renderTextContent(v.display)
    },
  })
  const currentIndex = memo(() => {
    return tabs.findIndex(x => x.display == currentTab.get())
  })
  const container = fdom.div({
    className: 'relative overflow-hidden',
    children(c: HTMLElement) {
      scrollX.hookCompare(currentIndex, function (a, b) {
        return a - b
      })
      fdom.div({
        s_transform() {
          return `translateX(${-scrollX.get()}px)`
        },
        children() {

          const parentMove = parentMoveCtx.consume()
          function moveCurrent(e: PointerEvent) {
            pointerMove(scrollX.getMoveEvent(e, 'x', {
              callback(direction, velocity) {
                const newItem = tabs[currentIndex() + direction]
                if (newItem) {
                  currentTab.set(newItem.display)
                  return false
                }
                return true
              },
            }))
          }

          renderArrayKey(memo(() => {
            const row = currentTab.get()
            const index = currentIndex()
            const list: {
              key: string
              step?: 'before' | 'after'
            }[] = []
            const before = tabs[index - 1]
            if (before) {
              list.push({
                key: before.display,
                step: 'before'
              })
            }
            list.push({
              key: row
            })
            const after = tabs[index + 1]
            if (after) {
              list.push({
                key: after.display,
                step: 'after'
              })
            }
            return list
          }), v => v.key, function (getValue, getIndex, key) {

            function thisMovie(e: PointerEvent) {
              pointerMoveDir(e, {
                onMove(e, dir, va) {
                  if (dir == 'x') {
                    const v = getValue()
                    if (!parentMove) {
                      moveCurrent(e)
                      return
                    }
                    if (v.key == tabs.at(-1)?.display) {
                      if (va.x < 0) {
                        parentMove(e)
                      } else {
                        moveCurrent(e)
                      }
                    } else if (v.key == tabs[0].display) {
                      if (va.x > 0) {
                        parentMove(e)
                      } else {
                        moveCurrent(e)
                      }
                    } else {
                      moveCurrent(e)
                    }
                  }
                }
              })
            }
            parentMoveCtx.provide(thisMovie)
            fdom.div({
              className() {
                const n = getValue()
                if (n.step == 'before') {
                  return tw`absolute top-0 w-full h-full right-full ${className}`
                }
                if (n.step == 'after') {
                  return tw`absolute top-0 w-full h-full left-full ${className}`
                }
                return tw`${className}`
              },
              s_border: '1px solid gray',
              onPointerDown(e) {
                e.stopPropagation()
                thisMovie(e)
              },
              children() {
                children(key, moveCurrent)
              }
            })
          })
        }
      })
    }
  })
}