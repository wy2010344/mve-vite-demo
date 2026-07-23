import { createSignal, emptyArray, superCall } from 'wy-helper';
import {
  Renderer,
  Node,
  rgba,
  colorToCSS,
  LayoutSize,
  layoutSize,
  LayoutFun,
  LayoutNode,
  engineGlobalContext,
  renderCanvas,
  flex,
  renderRect,
  renderScroll,
  renderScrollContent,
  drawRect,
  scrollBarSize,
} from 'mve-dom-helper/canvasRender';
import { StateHolder } from 'mve-core';
import { fdom } from 'mve-dom';
import { renderArray, renderOneKey } from 'mve-helper';

let canvasEl: HTMLCanvasElement;

export default function () {
  renderCanvas(
    fdom.canvas({
      width: 600,
      height: 800,
    }),
    {
      layout: flex({
        directionJustify: 'center',
        gap: 3,
        alignFix: true,
      }),
      children() {
        const list = createSignal<readonly number[]>(emptyArray);
        renderScroll({
          width: 300,
          height: 400,
          layout: flex({
            direction: 'x',
            alignFix: true,
            alignItem: 'stretch',
            directionJustify: 'start',
          }),
          children() {
            renderScrollContent({
              grow: 1,
              layout: flex({
                alignFix: true,
                alignItem: 'stretch',
                gap: 10,
              }),
              children() {
                renderArray(list.get, function (value, getIndex) {
                  renderRect({
                    // width: 30,
                    height: 50,
                    draw(ctx) {
                      ctx.fillStyle = 'blue';
                      drawRect.call(this, ctx);
                    },
                    mouseClick(e) {
                      list.set(list.get().filter(x => x != value));
                    },
                  });
                });
              },
            });
            const scroll = this.node;
            renderRect({
              width: 10,
              layout: flex({
                directionJustify: 'start',
                alignFix: true,
                alignItem: 'stretch',
              }),
              draw(ctx) {
                drawRect.call(this, ctx, true, true);
                superCall(this, 'draw', ctx);
              },
              children() {
                renderOneKey(
                  () => scrollBarSize.call(scroll, 'y'),
                  v => Boolean(v),
                  function (key, get) {
                    if (key) {
                      renderRect({
                        height() {
                          return get()?.size ?? 0;
                        },
                        y() {
                          return get()?.offset ?? 0;
                        },
                        draw(ctx) {
                          drawRect.call(this, ctx);
                        },
                      });
                    }
                  }
                );
              },
            });
          },
        });
        renderRect({
          width: 100,
          height: 50,
          draw(ctx) {
            ctx.fillStyle = 'red';
            drawRect.call(this, ctx);
          },
          mouseClick(e) {
            list.set(list.get().concat(Date.now()));
          },
        });
      },
    }
  );
  // }

  // // ─── ColorRow ────────────────────────────────────────────────────────

  // class ColorRow extends RectNode {
  //   private colors = [
  //     rgba(255, 99, 71),
  //     rgba(30, 144, 255),
  //     rgba(50, 205, 50),
  //     rgba(255, 165, 0),
  //     rgba(148, 103, 189),
  //   ];

  //   override toString() {
  //     return 'ColorRow';
  //   }

  //   override layout(_d: Direction): LayoutFun<LayoutNode> {
  //     const self = this;
  //     return {
  //       createLayout() {
  //         return {
  //           sizeFromChildren: () => 0,
  //           childSize(_i: number) {
  //             return 60;
  //           },
  //           childPosition(i: number) {
  //             let pos = 0;
  //             for (let j = 0; j < i; j++) {
  //               pos += 70;
  //             }
  //             return pos;
  //           },
  //         };
  //       },
  //     } as any;
  //   }

  //   override size(d: Direction): LayoutSize {
  //     if (d === Direction.y) return layoutSize(70, false);
  //     return this.sizeFromParent(d);
  //   }

  //   override buildChildren() {
  //     const h = this.context;
  //     for (let i = 0; i < this.colors.length; i++) {
  //       new ColorBlock(h, i, this.colors);
  //     }
  //   }
  // }

  // // ─── ColorBlock ──────────────────────────────────────────────────────

  // class ColorBlock extends RectNode {
  //   private idx: number;
  //   private allColors: number[];
  //   private activeColor: ReturnType<typeof createSignal<number>>;

  //   constructor(context: StateHolder<Node>, idx: number, allColors: number[]) {
  //     super(context);
  //     this.idx = idx;
  //     this.allColors = allColors;
  //     this.activeColor = createSignal(idx);
  //   }

  //   override toString() {
  //     return 'ColorBlock';
  //   }

  //   override grow() {
  //     return 1;
  //   }

  //   override size(_d: Direction): LayoutSize {
  //     return layoutSize(60, false);
  //   }

  //   override mouseDown() {
  //     const cur = this.activeColor.get();
  //     this.activeColor.set((cur + 1) % this.allColors.length);
  //   }

  //   override drawSelf(ctx: CanvasRenderingContext2D) {
  //     const color = this.allColors[this.activeColor.get()];
  //     ctx.fillStyle = colorToCSS(color);
  //     ctx.drawRect(0, 0, 60, 60);
  //     ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  //     ctx.lineWidth = 1;
  //     ctx.strokeRect(0.5, 0.5, 59, 59);
  //   }
  // }

  // // ─── DragBlock ───────────────────────────────────────────────────────

  // class DragBlock extends RectNode {
  //   private ox = createSignal(10);
  //   private oy = createSignal(160);
  //   private dragging = false;
  //   private startX = 0;
  //   private startY = 0;

  //   override toString() {
  //     return 'DragBlock';
  //   }

  //   override position(d: Direction): number {
  //     return d === Direction.x ? this.ox.get() : this.oy.get();
  //   }

  //   override size(_d: Direction): LayoutSize {
  //     return layoutSize(80, false);
  //   }

  //   override mouseDown(e: import('mve-dom-helper/canvasEngine').MouseEvent) {
  //     this.dragging = true;
  //     this.startX = e.globalX - this.ox.get();
  //     this.startY = e.globalY - this.oy.get();

  //     const g = this.context.consume(engineGlobalContext)!;
  //     const d1 = g.registerMouseMove(ev => {
  //       if (this.dragging) {
  //         this.ox.set(ev.x - this.startX);
  //         this.oy.set(ev.y - this.startY);
  //       }
  //     });
  //     const d2 = g.registerMouseUp(() => {
  //       this.dragging = false;
  //       d1();
  //       d2();
  //     });
  //     e.stopPropagation();
  //   }

  //   override drawSelf(ctx: CanvasRenderingContext2D) {
  //     ctx.fillStyle = colorToCSS(rgba(255, 182, 193));
  //     const r = 10,
  //       w = 80,
  //       h = 80;
  //     ctx.beginPath();
  //     ctx.moveTo(r, 0);
  //     ctx.arcTo(w, 0, w, h, r);
  //     ctx.arcTo(w, h, 0, h, r);
  //     ctx.arcTo(0, h, 0, 0, r);
  //     ctx.arcTo(0, 0, w, 0, r);
  //     ctx.closePath();
  //     ctx.fill();

  //     ctx.fillStyle = '#555';
  //     ctx.font = '13px sans-serif';
  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     ctx.fillText('拖拽', w / 2, h / 2);
  //     ctx.textAlign = 'start';
  //     ctx.textBaseline = 'alphabetic';
  //   }
  // }

  // // ─── ScrollSection ───────────────────────────────────────────────────

  // class ScrollSection extends RectNode {
  //   private scrollOffset = createSignal(0);
  //   private viewH = 120;
  //   private itemH = 32;
  //   private itemCount = 20;
  //   private contentH = this.itemCount * this.itemH;

  //   override toString() {
  //     return 'ScrollSection';
  //   }

  //   override size(d: Direction): LayoutSize {
  //     if (d === Direction.y) return layoutSize(this.viewH, false);
  //     return this.sizeFromParent(d);
  //   }

  //   override buildChildren() {
  //     const g = this.context.consume(engineGlobalContext)!;
  //     const maxScroll = Math.max(0, this.contentH - this.viewH);
  //     if (maxScroll > 0) {
  //       g.registerMouseWheel(e => {
  //         const absX = absolutePos(this, Direction.x);
  //         const absY = absolutePos(this, Direction.y);
  //         const w = this.sizeFromParent(Direction.x).value;
  //         const rx = e.x - absX;
  //         const ry = e.y - absY;
  //         if (rx >= 0 && rx <= w && ry >= 0 && ry <= this.viewH) {
  //           const next = Math.min(
  //             Math.max(this.scrollOffset.get() + e.delta, 0),
  //             maxScroll
  //           );
  //           this.scrollOffset.set(next);
  //           e.destroy();
  //         }
  //       });
  //     }
  //   }

  //   override drawSelf() {}

  //   override draw(ctx: CanvasRenderingContext2D) {
  //     const w = this.sizeFromParent(Direction.x).value;
  //     ctx.strokeStyle = '#ddd';
  //     ctx.lineWidth = 1;
  //     ctx.strokeRect(0, 0, w, this.viewH);

  //     ctx.save();
  //     ctx.beginPath();
  //     ctx.rect(0, 0, w, this.viewH);
  //     ctx.clip();

  //     const offset = -this.scrollOffset.get();
  //     for (let i = 0; i < this.itemCount; i++) {
  //       const y = i * this.itemH + offset;
  //       if (y + this.itemH < 0 || y > this.viewH) continue;
  //       ctx.fillStyle = i % 2 === 0 ? '#fafafa' : '#fff';
  //       ctx.drawRect(1, y, w - 2, this.itemH);
  //       ctx.fillStyle = '#444';
  //       ctx.font = '13px sans-serif';
  //       ctx.textBaseline = 'middle';
  //       ctx.fillText(`列表项 ${i + 1}`, 8, y + this.itemH / 2);
  //       ctx.textBaseline = 'alphabetic';
  //     }
  //     ctx.restore();

  //     const maxScroll = Math.max(0, this.contentH - this.viewH);
  //     if (maxScroll > 0) {
  //       const barH = Math.max(20, (this.viewH * this.viewH) / this.contentH);
  //       const barY = (this.scrollOffset.get() / maxScroll) * (this.viewH - barH);
  //       ctx.fillStyle = 'rgba(0,0,0,0.25)';
  //       ctx.drawRect(w - 5, barY, 3, barH);
  //     }
  //   }
  // }

  // function absolutePos(node: Node, d: Direction): number {
  //   let n = node.position(d);
  //   let p = node.parent;
  //   while (p) {
  //     n += p.position(d);
  //     p = p.parent;
  //   }
  //   return n;
}
