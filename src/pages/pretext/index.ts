import { renderMobileView } from '../../onlyMobile';
import { createSignal } from 'wy-helper';
import {
  LayoutNode,
  Scroll,
  flex,
  grow,
  loadCanvasKit,
  registerFont,
  registerScroll,
  renderCanvas,
  renderEditableText,
  renderRect,
  renderScrollContent,
  renderWrappedText,
} from 'mve-dom-helper/canvasRender';
import { faker } from '@faker-js/faker';
import { fdom } from 'mve-dom';
import explain from '../../explain';
import markdown from '../../markdown';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

await loadCanvasKit('/canvas-kit/canvaskit.js');
await loadDemoFont();

export default function () {
  explain(() => {
    markdown`
# pretext text canvas demo

演示基于新 canvas 引擎的 \`renderWrappedText\` / \`renderEditableText\` 用法。
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
      {
        children() {
          renderRect({
            width,
            height,
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
                  gap: 8,
                  directionJustify: 'start',
                }),
                children() {
                  renderSectionTitle('1. Basic: fontSize + fontFamily');
                  renderTextBlock({
                    text: 'The quick brown fox jumps over the lazy dog. 敏捷的棕色狐狸跳过了懒狗。',
                    fontSize: 16,
                    lineHeight: 24,
                    bg: '#e0f2fe',
                  });

                  renderSectionTitle('2. maxLines truncation with ellipsis');
                  renderTextBlock({
                    text: faker.lorem.paragraphs(3),
                    fontSize: 14,
                    lineHeight: 20,
                    maxLines: 2,
                    bg: '#fef3c7',
                  });

                  renderSectionTitle('3. pre-wrap (line breaks)');
                  renderTextBlock({
                    text: 'function hello() {\n  console.log("Hello World!");\n  return 42;\n}\n\n// Comments\n/* blocks */',
                    fontWeight: 700,
                    fontSize: 13,
                    lineHeight: 20,
                    bg: '#ede9fe',
                  });

                  renderSectionTitle('4. letterSpacing');
                  renderTextBlock({
                    text: 'Spaced Out Text 每个字之间都有间距',
                    fontSize: 18,
                    lineHeight: 30,
                    letterSpacing: 4,
                    bg: '#d1fae5',
                  });

                  renderSectionTitle('5. CJK 文本换行');
                  renderTextBlock({
                    text: '这是一个非常长的中文文本，用于测试中文文本的换行行为。AcrylonitrileButadieneStyrene是一种热塑性塑料。',
                    fontSize: 16,
                    lineHeight: 24,
                    bg: '#fbcfe8',
                  });

                  renderSectionTitle('6. Dynamic: editable text');
                  const selectionText = createSignal(faker.lorem.sentences(3));
                  renderRect({
                    paddingInline: 12,
                    layout: flex({
                      direction: 'y',
                      alignFix: true,
                      alignItem: 'stretch',
                    }),
                    draw(ctx) {
                      ctx.fillStyle = '#fce7f3';
                      ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
                    },
                    children() {
                      renderEditableText({
                        text: selectionText.get,
                        setText: selectionText.set,
                        fontFamily: 'Noto Sans SC',
                        fontSize: 15,
                        maxLines: 4,
                      });
                    },
                  });

                  renderSectionTitle('7. Multi-line list');
                  const items = Array.from({ length: 20 }, (_, i) => ({
                    title: faker.person.fullName(),
                    bio: faker.lorem.sentences(2),
                  }));

                  items.forEach(row => {
                    renderRect({
                      height: 56,
                      paddingInline: 8,
                      paddingBlock: 4,
                      layout: flex({
                        direction: 'x',
                        gap: 8,
                        alignFix: true,
                        alignItem: 'stretch',
                        directionJustify: 'start',
                      }),
                      draw(ctx) {
                        ctx.fillStyle = '#f5f5f4';
                        ctx.fillRect(
                          0,
                          0,
                          this.outerWidth(),
                          this.outerHeight()
                        );
                      },
                      children() {
                        renderRect({
                          width: 40,
                          height: 40,
                          draw(ctx) {
                            ctx.beginPath();
                            ctx.arc(20, 20, 18, 0, Math.PI * 2);
                            ctx.fillStyle = '#a78bfa';
                            ctx.fill();
                          },
                        });
                        renderRect({
                          exts: [grow({ argGrow: 1 })],
                          layout: flex({
                            direction: 'y',
                            gap: 2,
                            alignFix: true,
                            alignItem: 'stretch',
                          }),
                          children() {
                            renderWrappedText({
                              text: row.title,
                              fontFamily: 'Noto Sans SC',
                              fontSize: 14,
                              fontWeight: 700,
                            });
                            renderWrappedText({
                              text: row.bio,
                              fontFamily: 'Noto Sans SC',
                              fontSize: 12,
                              maxLines: 2,
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
      }
    );
  });
}

function renderSectionTitle(title: string) {
  renderRect({
    paddingInline: 12,
    paddingBlock: 4,
    layout: flex({ direction: 'y', alignFix: true, alignItem: 'stretch' }),
    draw(ctx) {
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
    },
    children() {
      renderWrappedText({
        text: title,
        fontFamily: 'Noto Sans SC',
        fontSize: 13,
        fontWeight: 700,
      });
    },
  });
}

function renderTextBlock(args: {
  text: string;
  fontSize: number;
  lineHeight?: number;
  maxLines?: number;
  letterSpacing?: number;
  fontWeight?: number;
  bg: string;
}) {
  renderRect({
    paddingInline: 12,
    layout: flex({ direction: 'y', alignFix: true, alignItem: 'stretch' }),
    draw(ctx) {
      ctx.fillStyle = args.bg;
      ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
    },
    children() {
      renderWrappedText({
        text: args.text,
        fontFamily: 'Noto Sans SC',
        fontSize: args.fontSize,
        fontWeight: args.fontWeight ?? 400,
        maxLines: args.maxLines,
        lineHeightMultiplier: args.lineHeight
          ? args.lineHeight / args.fontSize
          : 1.4,
        letterSpacing: args.letterSpacing ?? 0,
      });
    },
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
