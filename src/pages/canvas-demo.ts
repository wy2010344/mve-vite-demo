import { hookAddDestroy } from "mve-core";
import { createSignal, flexDisplayUtil } from "wy-helper";
import demo3 from "../canvas-demo/demo3";
import { hookDestroy } from "mve-helper";
import demo4 from "../canvas-demo/demo4";
import demo5 from "../canvas-demo/demo5";
import demo6 from "../canvas-demo/demo6";
import demo1 from "../canvas-demo/demo1";
import demo2 from "../canvas-demo/demo2";
import { fdom } from "mve-dom";
import { hookDrawRect, renderCanvas, simpleFlex } from "mve-dom-helper/canvasRender";

export default function () {
  const w = createSignal(window.innerWidth)
  const h = createSignal(window.innerHeight)
  function resize() {
    w.set(window.innerWidth)
    h.set(window.innerHeight)
  }
  window.addEventListener("resize", resize)
  hookDestroy(() => {
    window.removeEventListener("resize", resize)
  })

  const canvas = fdom.canvas({
    className: 'touch-none',
    width: w.get,
    height: h.get
  })
  renderCanvas(canvas, () => {
    hookDrawRect({
      width: w.get,
      height: h.get,
      layout() {
        return simpleFlex({
          direction: 'x',
          directionFix: 'center',
          alignFix: true
        })
      },
      draw(ctx, n, p) {
        p.rect(0, 0, n.width(), n.height())
        return {
          operates: [
            {
              type: "fill",
              style: "gray"
            }
          ]
        }
      },
      children() {
        // demo1()
        // demo2()
        // demo3()
        demo4()
        // demo5()
        // demo6()
      }
    })
  }, {

    beforeDraw(ctx: CanvasRenderingContext2D) {
      //这里竟然不会影响点击坐标??
      // ctx.translate(200, 200)
    }
  })
}
