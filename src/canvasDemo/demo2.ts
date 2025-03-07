import { hookDraw } from "mve-dom-helper/canvasRender"

export default function () {


  hookDraw({
    x: 100,
    y: 100,
    withPath: true,
    draw(ctx, path) {
      path.rect(0, 0, 300, 300)

      return {
        operates: [
          { type: "stroke", width: 10, style: "green" },
        ],
        clipFillRule: "nonzero"
      }
    },
    beforeChildren() {
      hookDraw({
        x: -30,
        y: -30,
        withPath: true,
        onPointerDown(e) {
          console.log("before-click", e)
        },
        draw(ctx, path) {
          path.rect(0, 0, 300, 300)
          return {
            operates: [
              { type: "stroke", width: 10, style: "yellow" },
            ]
          }
        },
      })
    },
    children() {
      hookDraw({
        x: -30,
        y: -30,
        onPointerDown(e) {
          console.log("click", e)
        },
        withPath: true,
        draw(ctx, path) {
          path.rect(0, 0, 300, 300)

          return {
            operates: [
              { type: "stroke", width: 10, style: "blue" },
            ]
          }
        },
      })
    },
  })
}
