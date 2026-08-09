import { fdom } from 'mve-dom';
import { renderCanvas, renderRect } from 'mve-dom-helper/canvasRender';

export default function () {
  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width: '300px',
      s_height: '300px',
    }),
    {
      children() {
        renderRect({
          x: 10,
          y: 10,
          width: 30,
          height: 30,
          mouseClick(e) {
            console.log('1');
          },
          draw(ctx) {
            ctx.beginPath();
            ctx.roundRect(0, 0, 30, 30, [10, 20, 30, 40]);
            ctx.fillStyle = 'red';
            ctx.fill();
          },
        });

        renderRect({
          x: 200,
          y: 200,
          width: 60,
          height: 60,
          mouseClick(e) {
            console.log('2');
          },
          draw(ctx) {
            ctx.beginPath();
            ctx.rect(40, 40, 20, 20);
            ctx.fillStyle = 'green';
            ctx.fill();
          },
        });
      },
    }
  );
}
