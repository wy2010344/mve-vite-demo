import { hookAddDestroy } from "mve-core";
import { createSignal, flexDisplayUtil } from "wy-helper";
import demo3 from "./demo3";
import { hookDestroy } from "mve-helper";
import demo5 from "./demo5";
import demo6 from "./demo6";
import demo1 from "./demo1";
import demo2 from "./demo2";
import { fdom } from "mve-dom";
import { hookDrawRect, renderCanvas, simpleFlex } from "mve-dom-helper/canvasRender";
import demo4 from "../d3/force/demo4";

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
  renderCanvas({
    className: 'touch-none',
    width: w.get,
    height: h.get,
  }, () => {
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
        p.rect(0, 0, n.axis.x.size(), n.axis.y.size())
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
        demo3()
        // demo4()
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
