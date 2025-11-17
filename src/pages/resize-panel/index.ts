import { faker } from '@faker-js/faker';
import { dom, fdom, renderPortal } from 'mve-dom';
import { hookDestroy, hookTrackSignal, renderIf, renderOne } from 'mve-helper';
import { IoCloseOutline } from 'mve-icons/io5';
import { pointerMove, subscribeEventListener } from 'wy-dom-helper';
import {
  addEffect,
  createSignal,
  doMoveAcc,
  DragMoveStep,
  movePanelResizeAuto,
} from 'wy-helper';
import Typed from 'typed.js';
import { hookAddDestroy } from 'mve-core';
import { createSign } from 'crypto';
export default function () {
  const show = createSignal<MouseEvent | undefined>(undefined);
  dom.button({
    onClick(e) {
      show.set(e);
    },
  }).renderText`提示`;

  renderOne(show.get, function (p) {
    if (p) {
      const onAutoHeight = createSignal(true);
      const onComplete = createSignal(false);
      const x = movePanelResizeAuto({
        size: 400,
        direction: 'x',
        position: p.pageX,
        margin: 10,
        minSize: 400,
        getMaxSize() {
          return window.innerWidth;
        },
      });
      const y = movePanelResizeAuto({
        size: 100,
        direction: 'y',
        position: p.pageY,
        margin: 10,
        minSize: 100,
        getMaxSize() {
          return window.innerHeight;
        },
      });
      function beginStep(
        e: DragMoveStep & {
          point: PointerEvent;
        }
      ) {
        const moveX = doMoveAcc(x.onMove(e));
        const moveY = doMoveAcc(y.onMove(e));
        let lastE = e.point;
        document.body.style.userSelect = 'none';

        pointerMove({
          onMove(e) {
            moveX(e.pageX - lastE.pageX);
            moveY(e.pageY - lastE.pageY);
            lastE = e;
          },
          onEnd(e) {
            document.body.style.userSelect = '';
          },
        });
      }
      fdom.div({
        s_left() {
          return `${x.position()}px`;
        },
        s_top() {
          return `${y.position()}px`;
        },
        s_width() {
          return `${x.size()}px`;
        },
        s_height() {
          return `${y.size()}px`;
        },
        className() {
          return `fixed bg-amber-500 ${
            !onAutoHeight.get() && `overflow-y-auto`
          }`;
        },
        children() {
          let typed: Typed | undefined = undefined;
          // let span: HTMLSpanElement
          const panel = fdom.div({
            children() {
              //header
              fdom.div({
                className:
                  'h-10 cursor-move bg-amber-100 flex justify-between items-center sticky top-0',
                onPointerDown(e) {
                  beginStep({
                    action: 'move',
                    point: e,
                  });
                },
                children() {
                  dom.h1().renderText`标题`;
                  fdom.button({
                    className: 'daisy-btn daisy-btn-circle',
                    onClick() {
                      show.set(undefined);
                    },
                    children() {
                      IoCloseOutline();
                    },
                  });
                },
              });
              //body
              fdom.div({
                children() {
                  const text = createSignal('');
                  setTimeout(() => {
                    text.set(faker.lorem.paragraphs(6));
                  }, 3000);
                  renderOne(text.get, function (text) {
                    if (text) {
                      const span = fdom.span();
                      addEffect(() => {
                        typed?.destroy();
                        typed = new Typed(span, {
                          strings: [text],
                          typeSpeed: 1,
                          // loop: tre,
                          // loopCount: Infinity,
                          cursorChar: '|',
                          onComplete() {
                            onComplete.set(true);
                            typed?.cursor.remove();
                          },
                        });
                      });
                    } else {
                      fdom.div({
                        className: 'daisy-loading daisy-loading-dots',
                      });
                    }
                  });
                  renderOne(onComplete.get, function (complete) {
                    if (complete) {
                      addEffect(() => {
                        setTimeout(() => {
                          onAutoHeight.set(false);
                          link.scrollIntoView();
                        }, 100);
                      });
                      const link = fdom.a({
                        className: 'daisy-link daisy-link-primary',
                        childrenType: 'text',
                        children: '重新生成',
                        onClick() {
                          onComplete.set(false);
                          onAutoHeight.set(true);
                          text.set('');
                          setTimeout(() => {
                            text.set(faker.lorem.paragraphs(6));
                          }, 3000);
                        },
                      });
                    }
                  });
                },
              });
            },
          });

          function wResize() {
            console.log('resize...');
            typed?.cursor.scrollIntoView();
            if (onAutoHeight.get()) {
              y.resizeScroll(panel.offsetHeight, finish => {
                if (finish) {
                  onAutoHeight.set(false);
                }
              });
            } else {
              x.fixResize();
              y.fixResize();
            }
          }
          hookDestroy(subscribeEventListener(window, 'resize', wResize));
          const ob = new ResizeObserver(wResize);
          addEffect(() => {
            ob.observe(panel);
          });
          hookDestroy(() => {
            ob.disconnect();
          });

          //top
          fdom.div({
            className: 'absolute cursor-ns-resize top-0 left-0 right-0 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true,
              });
            },
          });

          //bottom
          fdom.div({
            className: 'absolute cursor-ns-resize bottom-0 left-0 right-0 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true,
              });
            },
          });

          //left
          fdom.div({
            className: 'absolute cursor-ew-resize  top-0 bottom-0 left-0  w-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                left: true,
              });
            },
          });

          //right
          fdom.div({
            className: 'absolute cursor-ew-resize  top-0 bottom-0 right-0  w-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                right: true,
              });
            },
          });

          //top-left
          fdom.div({
            className: 'absolute cursor-nwse-resize top-0 left-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true,
                left: true,
              });
            },
          });

          //top-right
          fdom.div({
            className: 'absolute cursor-nesw-resize top-0 right-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                top: true,
                right: true,
              });
            },
          });

          //bottom-right
          fdom.div({
            className: 'absolute cursor-nwse-resize bottom-0 right-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true,
                right: true,
              });
            },
          });
          //bottom-left
          fdom.div({
            className: 'absolute cursor-nesw-resize bottom-0 left-0  w-1 h-1',
            onPointerDown(e) {
              beginStep({
                point: e,
                action: 'drag',
                bottom: true,
                left: true,
              });
            },
          });
        },
      });
    }
  });
}
