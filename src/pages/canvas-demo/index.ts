import { hookAddDestroy } from 'mve-core'
import { createSignal, flexDisplayUtil } from 'wy-helper'
import demo3 from './demo3'
import { hookDestroy } from 'mve-helper'
import demo5 from './demo5'
import demo6 from './demo6'
import demo1 from './demo1'
import demo2 from './demo2'
import { fdom } from 'mve-dom'
import { windowSize } from 'wy-dom-helper'
import {
  hookAddRect,
  hookDrawRect,
  hookFill,
  renderCanvas,
  simpleFlex,
} from 'mve-dom-helper/canvasRender'
import drawText from './drawText'
import demo7 from './demo7'

export default function () {
  renderCanvas(
    fdom.canvas({
      className: 'touch-none',
      s_width() {
        return windowSize.width() + 'px'
      },
      s_height() {
        return windowSize.height() + 'px'
      },
    }),
    () => {
      const n = hookDrawRect({
        width: windowSize.width,
        height: windowSize.height,
        layout() {
          return simpleFlex({
            direction: 'x',
            directionFix: 'center',
            alignFix: true,
          })
        },
        draw(e) {
          hookAddRect()
          hookFill('gray')
        },
        children() {
          // demo1()
          // demo2()
          // demo3()
          // demo5()
          // demo6()
          // drawText()
          demo7()
        },
      })
    },
    {
      // translateX: 300,
      // translateY: 300,
      beforeDraw(ctx: CanvasRenderingContext2D) {
        //这里竟然不会影响点击坐标??
        ctx.translate(200, 200)
      },
      afterDraw(ctx) {
        // ctx.translate(-300, -300)
      },
    }
  )
}
