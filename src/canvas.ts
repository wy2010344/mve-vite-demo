import { dom, fdom } from 'mve-dom';
import { renderCanvas, renderRect } from 'mve-dom-helper/canvasRender';
import { renderArray } from 'mve-helper';
import { createSignal, PointKey, quote, superCall } from 'wy-helper';

export default function () {
  dom
    .div({
      className: 'w-full h-[100vh] flex flex-col items-center justify-center',
    })
    .render(() => {
      const list = createSignal<number[]>([]);
      const count = createSignal(0);
      dom.button({
        onClick() {
          list.set(list.get().concat(Date.now()));
          count.set(count.get() + 1);
        },
      }).renderText`列表数量${() => list.get().length}`;

      renderCanvas(
        fdom.canvas({
          s_width: `${500}px`,
          s_height: `${500}px`,
          className: 'border-solid border-[1px] border-red-300',
        }),
        {
          children() {
            renderRect({
              x: 100,
              y: 100,
              width: 100,
              height: 130,
              draw(ctx) {
                colorRectPath()(ctx);
                superCall(this, 'draw', ctx);
              },
              children() {
                renderRect({
                  x: 10,
                  y: 10,
                  width: 100,
                  height: 130,
                  draw(ctx) {
                    colorRectPath()(ctx);
                  },
                });
                renderRect({
                  x: 40,
                  y: 40,
                  width: 100,
                  height: 130,
                  draw(ctx) {
                    colorRectPath('yellow', true)(ctx);
                  },
                  children() {
                    renderRect({
                      x: 0,
                      y: 10,
                      width: 100,
                      height: 130,
                      draw(ctx) {
                        colorRectPath('orange')(ctx);
                      },
                    });

                    renderRect({
                      x: 0,
                      y: 30,
                      width: 100,
                      height: 130,
                      draw(ctx) {
                        colorRectPath('yellow')(ctx);
                      },
                    });
                  },
                });
              },
            });
            renderArray(list.get, (row, getIndex) => {
              renderRect({
                x: () => {
                  return getIndex() * 20 + 100;
                },
                y: () => {
                  return getIndex() * 20 + 100;
                },
                width: 100,
                height: 130,
                draw(ctx) {
                  colorRectPath('red')(ctx);
                },
                mouseClick(e) {
                  console.log('a', e, row);
                },
              });
            });
          },
        }
      );
    });
}

type SizeKey = 'width' | 'height';

type Info = SizeKey | PointKey;

function directionToSize(x: PointKey): SizeKey {
  if (x == 'x') {
    return 'width';
  } else {
    return 'height';
  }
}
function oppositeDirection(x: PointKey): PointKey {
  if (x == 'x') {
    return 'y';
  } else {
    return 'x';
  }
}
function oppositeSize(x: SizeKey): SizeKey {
  if (x == 'width') {
    return 'height';
  } else {
    return 'width';
  }
}

type PaddingInfo = {
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
};
function getPadding(n: PointKey, x: PaddingInfo) {
  if (n == 'x') {
    return x.paddingLeft! + x.paddingRight!;
  } else {
    return x.paddingTop! + x.paddingBottom!;
  }
}
function gatPaddingStart(n: PointKey, x: PaddingInfo) {
  if (n == 'x') {
    return x.paddingLeft!;
  } else {
    return x.paddingTop!;
  }
}

function colorRectPath(strokeStyle = 'blue', clip?: boolean) {
  return function rectPath(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 30, 100, 100);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 30, 100, 100);
    if (clip) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 30, 100, 100);
      ctx.clip();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 30;
      ctx.strokeRect(0, 30, 100, 100);
      ctx.restore();
    }
  };
}
