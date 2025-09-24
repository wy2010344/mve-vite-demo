import {
  hookAddRect,
  hookDrawRect,
  hookFill,
  simpleFlex,
} from 'mve-dom-helper/canvasRender'

export default function () {
  hookDrawRect({
    padding: 30,
    layout(v) {
      return simpleFlex({
        gap: 20,
      })
    },
    children() {
      hookDrawRect({
        padding: 30,
        layout(v) {
          return simpleFlex({
            gap: 20,
          })
        },
        draw(arg) {
          hookAddRect()
          hookFill('green')
        },
        children() {
          hookDrawRect({
            width: 20,
            height: 20,
            onClick(e) {
              console.log('click-1')
            },
            draw(arg) {
              hookAddRect()
              hookFill('red')
            },
          })
          hookDrawRect({
            width: 20,
            height: 20,
            onClick(e) {
              console.log('click-111')
            },
            draw(arg) {
              hookAddRect()
              hookFill('blue')
            },
          })
        },
      })
      hookDrawRect({
        width: 20,
        height: 20,
        onClick(e) {
          console.log('click-2')
        },
        draw(arg) {
          hookAddRect()
          hookFill('green')
        },
      })

      hookDrawRect({
        padding: 30,
        layout(v) {
          return simpleFlex({
            gap: 20,
          })
        },
        draw(arg) {
          hookAddRect()
          hookFill('green')
        },
        children() {
          hookDrawRect({
            width: 20,
            height: 20,
            onClick(e) {
              console.log('click-22')
            },
            draw(arg) {
              hookAddRect()
              hookFill('red')
            },
          })
          hookDrawRect({
            width: 20,
            height: 20,
            onClick(e) {
              console.log('click-222')
            },
            draw(arg) {
              hookAddRect()
              hookFill('blue')
            },
          })
        },
      })
      hookDrawRect({
        width: 80,
        height: 80,
        onClick(e) {
          console.log('click-3')
        },
        draw(arg) {
          hookAddRect()
          hookFill('green')
        },
      })
    },
  })
}
