import { faker } from "@faker-js/faker";
import { dom, fdom, renderPortal } from "mve-dom";
import { hookDestroy, hookTrackSignal, renderIf, renderOne } from "mve-helper";
import { IoCloseOutline } from "mve-icons/io5";
import { pointerMove, subscribeEventListener } from "wy-dom-helper";
import { addEffect, createSignal, movePanelResizeAutoHeight, doMoveAcc, DragMoveStep } from "wy-helper";
import Typed from "typed.js";
import { hookAddDestroy } from "mve-core";
export default function () {



  const show = createSignal<MouseEvent | undefined>(undefined)
  dom.button({
    onClick(e) {
      show.set(e)
    }
  }).renderText`提示`

  renderOne(show.get, function (p) {
    if (p) {

      const width = createSignal(400)
      const height = createSignal(100)
      const x = movePanelResizeAutoHeight(width, {
        direction: "x",
        init: p.pageX,
        margin: 10,
        minSize: width.get(),
        getMaxSize() {
          return window.innerWidth
        },
      })
      const onAutoHeight = createSignal(true)
      const y = movePanelResizeAutoHeight(height, {
        direction: 'y',
        init: p.pageY,
        margin: 10,
        minSize: height.get(),
        getMaxSize() {
          return window.innerHeight
        },
      })
      const left = createSignal(x.init)
      const top = createSignal(y.init)
      x.setPosition(left)
      y.setPosition(top)

      function beginStep(e: DragMoveStep & {
        point: PointerEvent
      }) {
        const moveX = doMoveAcc(x.onMove(e))
        const moveY = doMoveAcc(y.onMove(e))
        let lastE = e.point
        document.body.style.userSelect = 'none'
        function didMove(e: PointerEvent) {
          moveX(e.pageX - lastE.pageX);
          moveY(e.pageY - lastE.pageY);
          lastE = e
        }
        pointerMove({
          onMove(e) {
            didMove(e)
          },
          onEnd(e) {
            didMove(e)
            document.body.style.userSelect = ''
          },
        })
      }
      fdom.div({
        s_left() {
          return left.get() + 'px'
        },
        s_top() {
          return top.get() + 'px'
        },
        s_width() {
          return width.get() + "px"
        },
        s_height() {
          return height.get() + 'px'
        },
        className() {
          return `fixed bg-amber-500 ${!onAutoHeight.get() && `overflow-y-auto`}`
        },
        children() {

          let span: HTMLSpanElement
          const body = fdom.div({
            children() {
              //header
              fdom.div({
                className: 'h-10 cursor-move bg-amber-100 flex justify-between items-center sticky top-0',
                onPointerDown(e) {
                  beginStep({
                    action: "move",
                    point: e,
                  })
                },
                children() {
                  dom.h1().renderText`标题`
                  fdom.button({
                    className: 'daisy-btn daisy-btn-circle',
                    onClick() {
                      show.set(undefined)
                    },
                    children() {
                      IoCloseOutline()
                    }
                  })
                }
              })
              //body
              fdom.div({
                children() {
                  const text = createSignal('')
                  setTimeout(() => {
                    text.set(faker.lorem.paragraphs(6))
                  }, 3000)
                  let typed: Typed | undefined = undefined
                  renderOne(text.get, function (text) {
                    if (text) {
                      span = fdom.span()
                      addEffect(() => {
                        typed?.destroy()
                        typed = new Typed(span, {
                          strings: [text],
                          typeSpeed: 1,
                          // loop: tre,
                          // loopCount: Infinity,
                          cursorChar: "|",
                          onComplete() {
                            onAutoHeight.set(false)
                          },
                        });
                      })
                    } else {
                      fdom.div({
                        className: 'daisy-loading daisy-loading-dots'
                      })
                    }
                  })
                  renderOne(onAutoHeight.get, function (autoHeight) {
                    if (!autoHeight) {
                      fdom.button({
                        className: 'daisy-btn daisy-btn-link',
                        childrenType: 'text',
                        children: '重新生成',
                        onClick() {
                          onAutoHeight.set(true)
                          text.set('')
                          setTimeout(() => {
                            text.set(faker.lorem.paragraphs(6))
                          }, 3000)
                        }
                      })
                    }
                  })
                }
              })
            }
          })


          function wResize() {
            if (onAutoHeight.get()) {

              y.resizeScroll(body.offsetHeight, () => {
                span?.nextElementSibling?.scrollIntoView()
              });
            } else {
              x.fixResize()
              y.fixResize()
            }
          }
          hookDestroy(subscribeEventListener(window, 'resize', wResize))
          const ob = new ResizeObserver(wResize)
          addEffect(() => {
            ob.observe(body)
          })
          hookDestroy(() => {
            ob.disconnect()
          })

          //top
          fdom.div({
            className: 'absolute cursor-ns-resize top-0 left-0 right-0 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true
              })
            }
          })

          //bottom
          fdom.div({
            className: 'absolute cursor-ns-resize bottom-0 left-0 right-0 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true
              })
            }
          })

          //left
          fdom.div({
            className: 'absolute cursor-ew-resize  top-0 bottom-0 left-0  w-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                left: true
              })
            }
          })

          //right
          fdom.div({
            className: 'absolute cursor-ew-resize  top-0 bottom-0 right-0  w-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                right: true
              })
            }
          })

          //top-left
          fdom.div({
            className: 'absolute cursor-nwse-resize top-0 left-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true,
                left: true
              })
            }
          })

          //top-right
          fdom.div({
            className: 'absolute cursor-nesw-resize top-0 right-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true,
                right: true
              })
            }
          })

          //bottom-right
          fdom.div({
            className: 'absolute cursor-nwse-resize bottom-0 right-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true,
                right: true
              })
            }
          })
          //bottom-left
          fdom.div({
            className: 'absolute cursor-nesw-resize bottom-0 left-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true,
                left: true
              })
            }
          })
        }
      })
    }
  })
}

