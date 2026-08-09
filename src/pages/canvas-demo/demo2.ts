import { fdom } from 'mve-dom';
import { renderCanvas, renderRect } from 'mve-dom-helper/canvasRender';

export default function () {
  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width: '400px',
      s_height: '400px',
    }),
    {
      children() {
        renderRect({
          x: 100,
          y: 100,
          width: 300,
          height: 300,
          draw(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, 300, 300);
            ctx.lineWidth = 10;
            ctx.strokeStyle = 'green';
            ctx.stroke();
            ctx.clip('nonzero');
          },
          children() {
            renderRect({
              x: -30,
              y: -30,
              width: 300,
              height: 300,
              mouseDown(e) {
                console.log('before-click', e.x, e.y);
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, 300, 300);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'yellow';
                ctx.stroke();
              },
            });
            renderRect({
              x: -30,
              y: -30,
              width: 300,
              height: 300,
              mouseDown(e) {
                console.log('click', e.x, e.y);
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, 300, 300);
                ctx.lineWidth = 10;
                ctx.strokeStyle = 'blue';
                ctx.stroke();
              },
            });
          },
        });
      },
    }
  );
}
