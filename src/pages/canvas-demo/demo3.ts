import { alignSelf, createSignal } from 'wy-helper';
import {
  flex,
  grow,
  align,
  renderCanvas,
  renderRect,
} from 'mve-dom-helper/canvasRender';
import { drawTextWrap, measureTextWrap } from 'wy-dom-helper/canvas';
import { fdom } from 'mve-dom';

const img = new Image();
img.src = 'https://picsum.photos/363/423';
const refresh = createSignal(0);
img.onload = () => {
  refresh.set(refresh.get() + 1);
};

export default function () {
  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width: '500px',
      s_height: '600px',
    }),
    {
      children() {
        renderRect({
          width: 400,
          height: 500,
          layout() {
            return flex({
              gap: 10,
              direction: 'x',
              reverse: true,
              alignItem: 'center',
              alignFix: true,
              directionJustify: 'around',
            });
          },
          draw(ctx) {
            ctx.beginPath();
            ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
            ctx.fillStyle = 'yellow';
            ctx.fill();
          },
          children() {
            renderRect({
              height: 30,
              exts: [grow({ argGrow: 1 })],
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.fillStyle = 'red';
                ctx.fill();
              },
            });
            renderRect({
              width: 20,
              exts: [align({ argAlign: alignSelf('stretch') })],
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.fillStyle = 'green';
                ctx.fill();
              },
            });
            renderRect({
              width: 100,
              draw(ctx) {
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.lineWidth = 4;
                ctx.strokeStyle = 'green';
                ctx.stroke();
                const o = measureTextWrap(
                  ctx,
                  'abwefw aef aew awe awe awe awefewf aefawe ',
                  100,
                  {
                    fontFamily: 'serif',
                    fontSize: '20px',
                  }
                );
                ctx.fillStyle = 'red';
                drawTextWrap(ctx, o);
              },
            });
            renderRect({
              width: 100,
              padding: 20,
              draw(ctx) {
                refresh.get();
                ctx.beginPath();
                ctx.rect(0, 0, this.outerWidth(), this.outerHeight());
                ctx.lineWidth = 6;
                ctx.strokeStyle = 'blue';
                ctx.stroke();
                if (img.complete && img.naturalWidth > 0) {
                  ctx.drawImage(
                    img,
                    this.paddingInlineStart(),
                    this.paddingBlockStart(),
                    this.innerWidth(),
                    this.innerHeight()
                  );
                }
              },
            });
          },
        });
      },
    }
  );
}
