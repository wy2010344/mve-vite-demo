import { renderMobileView } from '../../onlyMobile';
import { alignSelf, createSignal, LayoutNode, Point } from 'wy-helper';
import {
  hookDrawRect,
  hookDrawText,
  simpleFlex,
  // hookDrawTextWrap as hookPretextTextWrap,
  hookPretextTextWrap,
  renderCanvas,
  hookFill,
  hookAddRect,
  hookClip,
  CMNode,
} from 'mve-dom-helper/canvasRender';
import { faker } from '@faker-js/faker';
import { OnScroll } from 'mve-dom-helper';
import { fdom } from 'mve-dom';
import explain from '../../explain';
import markdown from '../../markdown';

export default function () {
  explain(() => {
    markdown`
# pretext text canvas demo

演示基于 \`@chenglou/pretext\` 的 \`hookPretextTextWrap\` 用法。
    `;
  });
  renderMobileView(function ({ width, height }) {
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
              gap: 4,
              alignFix: true,
              alignItems: 'stretch',
            });
          },
          children() {
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
                hookFill('#f3f4f6');
                hookClip();
              },
              onPointerDown(e) {
                scrollY.pointerEventListner(e.original);
              },
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
                      gap: 8,
                    });
                  },
                  children() {
                    renderSectionTitle('1. Basic: fontSize + fontFamily');
                    hookPretextTextWrap({
                      config: {
                        text: 'The quick brown fox jumps over the lazy dog. 敏捷的棕色狐狸跳过了懒狗。',
                        fontSize: '16px',
                        fontFamily: 'Inter, sans-serif',
                        lineHeight: 24,
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw({ rect }) {
                        hookAddRect();
                        hookFill('#e0f2fe');
                      },
                    });

                    renderSectionTitle('2. maxLines truncation with ellipsis');
                    hookPretextTextWrap({
                      config: {
                        text: faker.lorem.paragraphs(3),
                        fontSize: '14px',
                        fontFamily: 'system-ui, sans-serif',
                        lineHeight: 20,
                        maxLines: 2,
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw({ rect }) {
                        hookAddRect();
                        hookFill('#fef3c7');
                      },
                    });

                    renderSectionTitle(
                      '3. pre-wrap (preserved whitespace/line breaks)'
                    );
                    hookPretextTextWrap({
                      config: {
                        text: 'function hello() {\n  console.log("Hello World!");\n  return 42;\n}\n\n// Comments\n/* blocks */',
                        fontWeight: 'bold',
                        fontSize: '13px',
                        fontFamily: '"Cascadia Code", "Fira Code", monospace',
                        lineHeight: 20,
                        whiteSpace: 'pre-wrap',
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw({ rect }) {
                        hookAddRect();
                        hookFill('#ede9fe');
                      },
                    });

                    renderSectionTitle('4. letterSpacing');
                    hookPretextTextWrap({
                      config: {
                        text: 'Spaced Out Text 每个字之间都有间距',
                        fontSize: '18px',
                        fontFamily: 'sans-serif',
                        lineHeight: 30,
                        letterSpacing: 4,
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw({ rect }) {
                        hookAddRect();
                        hookFill('#d1fae5');
                      },
                    });

                    renderSectionTitle('5. wordBreak: keep-all (CJK)');
                    const cjkText =
                      '这是一个非常长的中文文本，用于测试keep-all模式下中文文本的换行行为。AcrylonitrileButadieneStyrene是一种热塑性塑料。';
                    hookPretextTextWrap({
                      config: {
                        text: cjkText,
                        fontSize: '16px',
                        fontFamily: '"Noto Sans SC", sans-serif',
                        lineHeight: 24,
                        wordBreak: 'keep-all',
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw({ rect }) {
                        hookAddRect();
                        hookFill('#fbcfe8');
                      },
                    });

                    renderSectionTitle(
                      '6. Dynamic: text selection via withSelect'
                    );
                    const selectStart = createSignal(0);
                    const selectEnd = createSignal(0);
                    const selectionText = createSignal(
                      faker.lorem.sentences(3)
                    );
                    const pretextNode = hookPretextTextWrap({
                      config: {
                        text: selectionText.get(),
                        fontSize: '15px',
                        fontFamily: 'sans-serif',
                        lineHeight: 22,
                      },
                      paddingInline: 12,
                      alignSelf: alignSelf('stretch'),
                      draw(e) {
                        hookAddRect();
                        hookFill('#fce7f3');
                        const sel = pretextNode.helper.withSelect(
                          selectStart.get(),
                          selectEnd.get()
                        );
                        sel.draw(e.ctx, 2);
                      },
                      onPointerDown(e) {
                        const sel = pretextNode.helper.withSelect(
                          selectStart.get(),
                          selectEnd.get()
                        );
                        const idx = sel.getIndex(e);
                        selectStart.set(idx);
                        selectEnd.set(idx);
                      },
                      // onPointerMove(e) {
                      //   if (e.original.buttons) {
                      //     const sel = pretextNode.helper.withSelect(
                      //       selectStart.get(),
                      //       selectEnd.get()
                      //     );
                      //     const idx = sel.getIndex(e);
                      //     selectEnd.set(idx);
                      //   }
                      // },
                    });
                    hookDrawRect({
                      paddingInline: 12,
                      children() {
                        hookDrawText({
                          config() {
                            return {
                              text: `select range: [${selectStart.get()}, ${selectEnd.get()})`,
                              fontSize: '11px',
                            };
                          },
                        });
                      },
                    });

                    renderSectionTitle('7. Multi-line list with pretext');
                    const items = Array.from({ length: 20 }, (_, i) => ({
                      title: faker.person.fullName(),
                      bio: faker.lorem.sentences(2),
                    }));

                    items.forEach(row => {
                      hookDrawRect({
                        paddingInline: 8,
                        paddingBlock: 4,
                        layout(v) {
                          return simpleFlex({ direction: 'x', gap: 8 });
                        },
                        draw({ rect }) {
                          hookAddRect();
                          hookFill('#f5f5f4');
                        },
                        children() {
                          hookDrawRect({
                            width: 40,
                            height: 40,
                            draw({ path, rect }) {
                              path.arc(20, 20, 18, 0, Math.PI * 2);
                              hookFill('#a78bfa');
                            },
                          });
                          hookDrawRect({
                            grow: 1,
                            layout(v) {
                              return simpleFlex({ direction: 'y', gap: 2 });
                            },
                            children() {
                              hookDrawText({
                                config() {
                                  return {
                                    text: row.title,
                                    fontWeight: 'bold',
                                    fontSize: '14px',
                                  };
                                },
                              });
                              hookPretextTextWrap({
                                config: {
                                  text: row.bio,
                                  fontSize: '12px',
                                  fontFamily: 'sans-serif',
                                  lineHeight: 16,
                                  maxLines: 2,
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

function renderSectionTitle(title: string) {
  hookDrawRect({
    paddingInline: 12,
    paddingBlock: 4,
    draw({ rect }) {
      hookAddRect();
      hookFill('#e5e7eb');
    },
    children() {
      hookDrawText({
        config: {
          text: title,
          fontWeight: 'bold',
          fontSize: '13px',
          fontFamily: 'sans-serif',
        },
      });
    },
  });
}
