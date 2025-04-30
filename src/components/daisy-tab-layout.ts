import { animate } from "motion"
import { hookTrackSignal } from "mve-helper"
import { addEffect, GetValue } from "wy-helper"



export function hookTabLayout(
  change: GetValue<any>,
  className: string
) {


  hookTrackSignal(change, function (tp) {
    const node1 = document.getElementsByClassName(className)[0]
    addEffect(() => {
      const node2 = document.getElementsByClassName(className)[0]
      if (node1 && node2 && node1 != node2) {
        const b1 = (node1 as HTMLButtonElement).offsetLeft
        const b2 = (node2 as HTMLButtonElement).offsetLeft
        const diff = b1 - b2
        animate(node2, {
          x: [
            diff, 0
          ]
        })
        const child1 = node2.firstChild as HTMLSpanElement
        if (child1) {
          animate(child1, {
            x: [
              -diff, 0
            ]
          })
        }
      }
    })
  })
}