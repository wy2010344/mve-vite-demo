import { renderMobileView } from '../../onlyMobile';
import {
  arrayCountCreateWith,
  createSignal,
  memo,
  numberBetween,
} from 'wy-helper';
import {
  LayoutNode,
  Scroll,
  flex,
  grow,
  loadCanvasKit,
  registerFont,
  registerScroll,
  renderCanvas,
  renderRect,
  renderScrollContent,
  renderWrappedText,
} from 'mve-dom-helper/canvasRender';

import { faker } from '@faker-js/faker';
import explain from '~/explain';
import markdown from '~/markdown';
import { renderArray } from 'mve-helper';
import { fdom } from 'mve-dom';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

await loadCanvasKit('/canvas-kit/canvaskit.js');
await loadDemoFont();

const refresh = createSignal(0);

export default function () {
  explain(() => {
    markdown`
#mve-canvas

类似 react-canvas
    `;
  });
  renderMobileView(function ({ width, height }, mock) {
    renderCanvas(
      fdom.canvas({
        className: 'touch-none',
        s_width() {
          return `${width()}px`;
        },
        s_height() {
          return `${height()}px`;
        },
      }),
      {
        children() {
          renderRect({
            width,
            height,
            layout: flex({
              direction: 'y',
              gap: 10,
              alignFix: true,
              alignItem: 'stretch',
              directionJustify: 'start',
            }),
            children() {
              const x = createSignal(10);
              const data = memo(() =>
                arrayCountCreateWith(x.get() * 5, i => {
                  return i;
                })
              );

              renderRect({
                paddingInline: 20,
                height: 20,
                children() {
                  renderRect({
                    x() {
                      return this.paddingInlineStart() + x.get();
                    },
                    y: 0,
                    width: 20,
                    height: 20,
                    draw(ctx) {
                      ctx.beginPath();
                      ctx.ellipse(10, 10, 10, 10, 0, 0, Math.PI * 2);
                      ctx.fillStyle = 'green';
                      ctx.fill();
                    },
                    mouseDown(e) {
                      const initX = x.get();
                      const startX = e.globalX;
                      const engine = this.engineGlobal!;
                      const destroyMove = engine.registerMouseMove(move => {
                        const diff = move.x - startX;
                        const max =
                          (this.parent as LayoutNode).innerWidth() - 20;
                        x.set(numberBetween(0, diff + initX, max));
                      });
                      const destroyUp = engine.registerMouseUp(() => {
                        destroyMove();
                        destroyUp();
                      });
                    },
                  });
                },
              });
              renderWrappedText({
                text: () => `${data().length} 条记录`,
                fontFamily: 'Noto Sans SC',
                fontSize: 16,
              });

              renderRect({
                exts: [grow({ argGrow: 1 })],
                layout: flex({
                  direction: 'y',
                  alignFix: true,
                  alignItem: 'stretch',
                  directionJustify: 'start',
                }),
                children() {
                  const container = this.node as LayoutNode;
                  const scroll = new Scroll(container, 'y');
                  registerScroll(scroll);
                  renderScrollContent({
                    exts: [grow({ argGrow: 1 })],
                    y: () => -scroll.value(),
                    layout: flex({
                      direction: 'y',
                      alignFix: true,
                      alignItem: 'stretch',
                      gap: 4,
                      directionJustify: 'start',
                    }),
                    children() {
                      renderArray(data, function (row, getIndex) {
                        const avatar = new Image();
                        avatar.src = faker.image.avatarGitHub();
                        avatar.onload = () => {
                          refresh.set(refresh.get() + 1);
                        };
                        renderRect({
                          height: 88,
                          paddingInlineStart: 4,
                          layout: flex({
                            direction: 'x',
                            gap: 4,
                            alignFix: true,
                            alignItem: 'stretch',
                            directionJustify: 'start',
                          }),
                          draw(ctx) {
                            refresh.get();
                            ctx.fillStyle =
                              getIndex() % 2 ? '#A5D2EE' : '#EEEEEE';
                            ctx.fillRect(
                              0,
                              0,
                              this.outerWidth(),
                              this.outerHeight()
                            );
                          },
                          children() {
                            renderRect({
                              width: 80,
                              height: 88,
                              paddingBlockEnd: 4,
                              paddingBlockStart: 4,
                              layout: flex({
                                direction: 'y',
                                alignFix: true,
                                alignItem: 'stretch',
                                directionJustify: 'start',
                              }),
                              children() {
                                renderRect({
                                  exts: [grow({ argGrow: 1 })],
                                  width: 72,
                                  draw(ctx) {
                                    refresh.get();
                                    if (
                                      avatar.complete &&
                                      avatar.naturalWidth
                                    ) {
                                      ctx.drawImage(
                                        avatar,
                                        0,
                                        0,
                                        this.outerWidth(),
                                        this.outerHeight()
                                      );
                                    }
                                  },
                                });
                              },
                            });
                            renderRect({
                              exts: [grow({ argGrow: 1 })],
                              layout: flex({
                                direction: 'y',
                                gap: 12,
                                alignFix: true,
                                alignItem: 'stretch',
                                directionJustify: 'start',
                              }),
                              children() {
                                renderWrappedText({
                                  text: `${faker.person.fullName()}   ${getIndex()}`,
                                  fontFamily: 'Noto Sans SC',
                                  fontSize: 16,
                                });
                                renderWrappedText({
                                  text: faker.lorem.lines(4),
                                  fontFamily: 'Noto Sans SC',
                                  fontSize: 12,
                                  maxLines: 3,
                                });
                              },
                            });
                          },
                        });
                      });
                    },
                  });
                },
              });
            },
          });
        },
      }
    );
  });
}

async function loadDemoFont(): Promise<void> {
  for (const url of FONT_URLS) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const bytes = await resp.arrayBuffer();
      registerFont('Noto Sans SC', bytes);
      return;
    } catch {
      // 尝试下一个源
    }
  }
}
