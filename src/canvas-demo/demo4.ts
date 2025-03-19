import { addEffect, arrayCountCreateWith, createSignal, flexDisplayUtil, memo } from "wy-helper";
import data from "./data";
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawUrlImage, hookDrawTextWrap } from "mve-dom-helper/canvasRender";

import Scroller from 'scroller';
import { hookTrackSignal } from "mve-helper";
import { faker } from "@faker-js/faker";
export default function () {


  let moveLastPoint: PointerEvent | undefined

  const scrollTop = createSignal(0)
  const data = arrayCountCreateWith(30, (i) => {
    return i
  })
  const scroller = new Scroller((left: number, top: number) => {
    scrollTop.set(top)
  }, {
    scrollingX: false,
    scrollingY: true,
    decelerationRate: 0.95,
    penetrationAcceleration: 0.08,
  })
  window.addEventListener("pointermove", e => {
    if (moveLastPoint) {
      moveLastPoint = e
      scroller.doTouchMove([moveLastPoint], moveLastPoint.timeStamp);
    }
  })

  function end(e: PointerEvent) {
    if (moveLastPoint) {
      moveLastPoint = undefined
      scroller.doTouchEnd(e.timeStamp);
    }
  }
  window.addEventListener("pointerup", end)
  window.addEventListener("pointercancel", end)

  hookTrackSignal(() => {
    addEffect(() => {
      scroller.setDimensions(420, 700, 420, (80 + 30) * data.length - 30);
    })
  })
  hookDrawRect({
    width: 420,
    height: 700,
    paddingTop() {
      return -scrollTop.get()
    },
    layout() {
      return simpleFlex({
        gap: 30
      })
    },
    draw(ctx, n, path) {
      path.rect(0, 0, n.width(), n.height())
      return {
        operates: [
          {
            type: "fill",
            style: 'yellow'
          }
        ],
        clipFillRule: "nonzero"
      }
    },
    onPointerDown(e) {
      moveLastPoint = e.original
      scroller.doTouchStart([moveLastPoint], moveLastPoint.timeStamp);
    },
    children() {
      data.forEach((row, i) => {
        hookDrawRect({
          height: 80,
          width: 700,
          layout(v) {
            return simpleFlex({
              direction: "x",
              gap: 4
            })
          },
          children() {
            hookDrawRect({
              width: 80,
              height: 80,
              layout(v) {
                return simpleFlex({
                  direction: "x",
                  alignFix: true
                })
              },
              draw(ctx, n, path) {
                path.rect(0, 0, n.width(), n.height())
                return {
                  clipFillRule: "nonzero",
                  operates: [
                    {
                      type: "fill",
                      style: "green"
                    }
                  ]
                }
              },
              children() {
                hookDrawUrlImage({
                  ext: {
                    grow: 1
                  },
                  relay: "width",
                  src: faker.image.avatarGitHub(),
                })
              },
            })
            hookDrawRect({
              draw(ctx, n, p) {
                p.rect(0, 0, n.width(), n.height())
                return {
                  operates: [
                    {
                      type: "fill",
                      style: 'green'
                    }
                  ]
                }
              },
              layout(v) {
                /**
                 * 这里
                 * 本来应该由父容器决定stretch固定高度
                 * 但却来自了子容器?
                 *  directionFix需要来自自身的尺寸,自身尺寸却通过所有子元素获得,而不通过父元素获得?
                 *  需要在子元素里使用grow,则自动填充满!
                 */
                return simpleFlex({
                  direction: 'y',
                  directionFix: "start",
                  alignFix: true,
                  alignItems: "start"
                })
              },
              ext: {
                stretch: true,
                grow: 1
              },
              children() {
                hookDrawText({
                  config: {
                    text: faker.person.fullName(),
                    fontSize: '20px',
                    fontFamily: 'serif'
                  },
                  drawInfo: {
                    style: "white"
                  }
                })
                hookDrawTextWrap({
                  config: {
                    maxLines: 3,
                    text: faker.lorem.lines(4),
                    fontSize: '10px',
                    fontFamily: 'serif'
                  },
                  drawInfo: {
                    style: "white"
                  },
                  ext: {
                    stretch: true,
                    grow: 1
                  }
                })
              }
            })
          },
        })
      })
    },
  })

}