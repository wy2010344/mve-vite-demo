import { hookDraw, hookFill } from 'mve-dom-helper/canvasRender'
import { objectFreeze } from 'wy-helper'

export default function () {
  hookDraw({
    x: 10,
    y: 10,
    onClick(e) {
      console.log('1')
    },
    withPath: true,
    draw({ ctx, path }) {
      // path.rect(0, 0, 20, 20)
      path.closePath()
      objectFreeze(path)
      path.roundRect(0, 0, 30, 30, [10, 20, 30, 40])
      hookFill('red')
    },
  })

  hookDraw({
    x: 200,
    y: 200,
    onClick(e) {
      console.log('2')
    },
    withPath: true,
    draw({ ctx, path }) {
      path.rect(40, 40, 20, 20)
      //使用了translate就不能点击了
      // ctx.translate(100, 100)
      hookFill('green')
    },
  })
}
