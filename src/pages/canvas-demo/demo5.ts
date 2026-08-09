import { createSignal, emptyArray } from 'wy-helper';
import { flex, renderCanvas, renderRect } from 'mve-dom-helper/canvasRender';
import { renderArray } from 'mve-helper';
import { fdom } from 'mve-dom';

export default function () {
  const a = createSignal(0);
  const list = createSignal(emptyArray as readonly number[]);

  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width: '450px',
      s_height: '600px',
    }),
    {
      children() {
        renderRect({
          width: 420,
          height: 580,
          layout() {
            return flex({
              direction: 'y',
              gap: 4,
            });
          },
          draw(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
            ctx.fillStyle = 'white';
            ctx.fill();
          },
          children() {
            renderRect({
              width: 200,
              height: 200,
              draw(ctx) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(0, 0, 200, 200);
              },
            });
            renderArray(list.get, function (row, getIndex) {
              renderRect({
                height: 30,
                draw(ctx) {
                  ctx.fillStyle = 'red';
                  ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
                  ctx.fillStyle = 'white';
                  ctx.font = '20px serif';
                  ctx.textBaseline = 'top';
                  ctx.fillText(
                    `${getIndex()},${a.get()}:${row}--${getIndex()}中文移动硬盘XXxxYYyy`,
                    0,
                    0
                  );
                },
                mouseClick() {
                  console.log('delete..');
                  list.set(list.get().filter(v => v != row));
                },
              });
            });
            renderRect({
              height: 70,
              draw(ctx) {
                ctx.fillStyle = 'red';
                ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.fillStyle = 'white';
                ctx.font = 'bold 60px serif';
                ctx.textBaseline = 'top';
                ctx.fillText('点击', 0, 0);
              },
              mouseClickCapture() {
                console.log('click-capture');
              },
              mouseClick() {
                a.set(a.get() + 1);
                list.set(list.get().concat(Date.now()));
                console.log('dd', list.get());
              },
            });
          },
        });
      },
    }
  );
}
