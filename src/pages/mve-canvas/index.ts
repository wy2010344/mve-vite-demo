import { renderMobileView } from '../../onlyMobile';
import {
  alignSelf,
  arrayCountCreateWith,
  ClampingScrollFactory,
  createSignal,
  LayoutNode,
  memo,
  numberBetween,
  Point,
} from 'wy-helper';
import {
  hookDrawRect,
  simpleFlex,
  hookDrawText,
  hookDrawTextWrap,
  renderCanvas,
  hookFill,
  hookDrawUrlImage,
  hookAddRect,
  hookClip,
  CMNode,
} from 'mve-dom-helper/canvasRender';

import { faker } from '@faker-js/faker';
import { OnScroll } from 'mve-dom-helper';
import explain from '~/explain';
import markdown from '~/markdown';
import { pointerMoveDir } from 'wy-dom-helper';
import { renderArray } from 'mve-helper';
import { fdom } from 'mve-dom';
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
      () => {
        hookDrawRect({
          width,
          height,
          layout(v) {
            return simpleFlex({
              direction: 'y',
              gap: 10,
              alignFix: true,
              alignItems: 'stretch',
            });
          },
          children() {
            const x = createSignal(10);
            const data = memo(() =>
              arrayCountCreateWith(x.get() * 5, i => {
                return i;
              })
            );

            const rect = hookDrawRect({
              paddingInline: 20,
              height: 20,
              children() {
                /**
                 * 内部的坐标都应该translate到相应的位置
                 * 但绘制的矩形,可能需要最终绘制
                 */
                hookDrawRect({
                  y: 20,
                  x(n) {
                    return n.parent!.axis.x.paddingStart() + x.get();
                  },
                  onPointerDown(e) {
                    pointerMoveDir(e.original, {
                      onMove(initE, dir) {
                        if (dir == 'x') {
                          const initX = x.get();
                          return {
                            onMove(e) {
                              const diff = e.pageX - initE.pageX;
                              x.set(
                                numberBetween(
                                  0,
                                  diff + initX,
                                  rect.axis.x.innerSize()
                                )
                              );
                            },
                            onEnd(e) {},
                          };
                        }
                      },
                    });
                  },
                  draw({ path, rect }) {
                    hookAddRect();
                    path.ellipse(0, 0, 10, 10, 360, 0, 360);
                    hookFill('green');
                  },
                });
              },
            });
            hookDrawText({
              paddingInline: 10,
              config() {
                return {
                  text: `${data().length} 条记录`,
                };
              },
            });

            let container!: LayoutNode<CMNode, keyof Point<number>>;
            const scrollY = new OnScroll('y', {
              maxScroll() {
                return container.axis.y.size() - content.axis.y.size();
              },
            });
            const content = hookDrawRect({
              grow: 1,
              draw() {
                hookAddRect();
                hookFill('yellow');
                hookClip();
              },
              onPointerDown(e) {
                scrollY.pointerEventListner(e.original);
              },
              paddingRight: 4,
              children() {
                container = hookDrawRect({
                  grow: 1,
                  width(n) {
                    return n.parent!.axis.x.innerSize();
                  },
                  y(n) {
                    return -scrollY.get();
                  },
                  draw() {
                    hookAddRect();
                    hookFill('white');
                  },
                  layout() {
                    return simpleFlex({
                      direction: 'y',
                      alignFix: true,
                      alignItems: 'stretch',
                      gap: 4,
                    });
                  },
                  children() {
                    console.log('render');
                    // return
                    renderArray(data, function (row, getIndex) {
                      const r = hookDrawRect({
                        layout(v) {
                          return simpleFlex({
                            direction: 'x',
                            gap: 4,
                          });
                        },
                        skipDraw(n) {
                          const s = scrollY.get();
                          if (
                            n.axis.y.position() - s >
                            content.axis.y.innerSize()
                          ) {
                            return true;
                          }
                          if (n.axis.y.position() - s + n.axis.y.size() < 0) {
                            return true;
                          }
                          return false;
                        },
                        draw() {
                          hookAddRect();
                          hookFill(getIndex() % 2 ? '#A5D2EE' : '#EEEEEE');
                        },
                        paddingLeft: 4,
                        children() {
                          hookDrawRect({
                            paddingBottom: 4,
                            paddingTop: 4,
                            height: 88,
                            width: 80,
                            layout(v) {
                              return simpleFlex({
                                direction: 'y',
                              });
                            },
                            children() {
                              hookDrawUrlImage({
                                grow: 1,
                                relay: 'height',
                                src: faker.image.avatarGitHub(),
                              });
                            },
                          });
                          hookDrawRect({
                            /**
                             * 这里
                             * 本来应该由父容器决定stretch固定高度
                             * 但却来自了子容器?
                             *  directionFix需要来自自身的尺寸,自身尺寸却通过所有子元素获得,而不通过父元素获得?
                             *  需要在子元素里使用grow,则自动填充满!
                             */
                            layout(v) {
                              return simpleFlex({
                                direction: 'y',
                                directionFix: 'start',
                                alignFix: true,
                                alignItems: 'start',
                                gap: 12,
                              });
                            },
                            alignSelf: alignSelf('stretch'),
                            grow: 1,
                            children() {
                              hookDrawText({
                                config() {
                                  return {
                                    text: `${faker.person.fullName()}   ${getIndex()}`,
                                  };
                                },
                              });
                              // hookDrawRect({
                              //   alignSelf: alignSelf('stretch'),
                              //   grow: 1,
                              //   draw(e) {
                              //     hookAddRect()
                              //     hookFill('blue')
                              //   },
                              // })
                              // return
                              hookDrawTextWrap({
                                config: {
                                  maxLines: 3,
                                  text: faker.lorem.lines(4),
                                  fontSize: '12px',
                                },
                                alignSelf: alignSelf('stretch'),
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
      }
    );
  });
}
