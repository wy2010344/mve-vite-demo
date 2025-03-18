import { hookAddDestroy } from "mve-core";
import { createSignal } from "wy-helper";
import demo3 from "../canvasDemo/demo3";
import { hookDestroy } from "mve-helper";
import demo4 from "../canvasDemo/demo4";
import demo5 from "../canvasDemo/demo5";
import demo6 from "../canvasDemo/demo6";
import demo1 from "../canvasDemo/demo1";
import demo2 from "../canvasDemo/demo2";
import { fdom } from "mve-dom";
import { renderCanvas } from "mve-dom-helper/canvasRender";

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
    width: w.get,
    height: h.get
  })

  console.log("dddd")
  renderCanvas(canvas, () => {
    // demo1()
    // demo2()
    // demo3()
    // demo4()
    demo5()
    // demo6()
  }, {

    beforeDraw(ctx: CanvasRenderingContext2D) {
      //这里竟然不会影响点击坐标??
      // ctx.translate(200, 200)
    }
  })
}
