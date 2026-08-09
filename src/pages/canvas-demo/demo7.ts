import { fdom } from 'mve-dom';
import { flex, renderCanvas, renderRect } from 'mve-dom-helper/canvasRender';

export default function () {
  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width: '500px',
      s_height: '450px',
    }),
    {
      children() {
        renderRect({
          width: 480,
          height: 430,
          padding: 30,
          layout() {
            return flex({
              gap: 20,
            });
          },
          children() {
            renderRect({
              padding: 30,
              layout() {
                return flex({
                  gap: 20,
                });
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.fillStyle = 'green';
                ctx.fill();
              },
              children() {
                renderRect({
                  width: 20,
                  height: 20,
                  mouseClick(e) {
                    console.log('click-1');
                  },
                  draw(ctx) {
                    ctx.beginPath();
                    ctx.rect(0, 0, 20, 20);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                  },
                });
                renderRect({
                  width: 20,
                  height: 20,
                  mouseClick(e) {
                    console.log('click-111');
                  },
                  draw(ctx) {
                    ctx.beginPath();
                    ctx.rect(0, 0, 20, 20);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                  },
                });
              },
            });
            renderRect({
              width: 20,
              height: 20,
              mouseClick(e) {
                console.log('click-2');
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, 20, 20);
                ctx.fillStyle = 'green';
                ctx.fill();
              },
            });

            renderRect({
              padding: 30,
              layout() {
                return flex({
                  gap: 20,
                });
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.fillStyle = 'green';
                ctx.fill();
              },
              children() {
                renderRect({
                  width: 20,
                  height: 20,
                  mouseClick(e) {
                    console.log('click-22');
                  },
                  draw(ctx) {
                    ctx.beginPath();
                    ctx.rect(0, 0, 20, 20);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                  },
                });
                renderRect({
                  width: 20,
                  height: 20,
                  mouseClick(e) {
                    console.log('click-222');
                  },
                  draw(ctx) {
                    ctx.beginPath();
                    ctx.rect(0, 0, 20, 20);
                    ctx.fillStyle = 'blue';
                    ctx.fill();
                  },
                });
              },
            });
            renderRect({
              width: 80,
              height: 80,
              mouseClick(e) {
                console.log('click-3');
              },
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, 80, 80);
                ctx.fillStyle = 'green';
                ctx.fill();
              },
            });
          },
        });
      },
    }
  );
}
