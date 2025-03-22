import { renderMobileView } from "../onlyMobile";
import { addEffect, arrayCountCreateWith, createSignal, flexDisplayUtil, memo } from "wy-helper";
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawUrlImage, hookDrawTextWrap, renderCanvas } from "mve-dom-helper/canvasRender";

import Scroller from 'scroller';
import { hookTrackSignal } from "mve-helper";
import { faker } from "@faker-js/faker";
export default function () {
  renderMobileView(function ({
    width,
    height
  }, mock) {

    renderCanvas({
      className: 'touch-none',
      width,
      height,
    }, () => {

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
        width,
        height,
        paddingTop() {
          return -scrollTop.get()
        },
        layout() {
          return simpleFlex({
            direction: 'y',
            alignFix: true,
            alignItems: "stretch",
            gap: 4
          })
        },
        draw(ctx, n, path) {
          return {
            operates: [
              {
                type: "fill",
                style: 'white'
              }
            ]
          }
        },
        onPointerDown(e) {
          moveLastPoint = e.original
          scroller.doTouchStart([moveLastPoint], moveLastPoint.timeStamp);
        },
        paddingRight: 4,
        children() {
          data.forEach((row, i) => {
            hookDrawRect({
              layout(v) {
                return simpleFlex({
                  direction: "x",
                  gap: 4
                })
              },
              draw(ctx, n, p) {
                return {
                  operates: [
                    {
                      type: "fill",
                      style: i % 2 ? '#A5D2EE' : '#EEEEEE'
                    }
                  ]
                }
              },
              paddingLeft: 4,
              children() {
                hookDrawRect({
                  paddingBottom: 4,
                  paddingTop: 4,
                  height: 88,
                  width: 80,
                  layout(v) {
                    return simpleFlex({
                      direction: "y",
                    })
                  },
                  children() {
                    hookDrawUrlImage({
                      ext: {
                        grow: 1
                      },
                      relay: "height",
                      src: faker.image.avatarGitHub()
                    })
                  },
                })
                hookDrawRect({
                  /**
                   * 这里
                   * 本来应该由父容器决定stretch固定高度
                   * 但却来自了子容器?
                   *  directionFix需要来自自身的尺寸,自身尺寸却通过所有子元素获得,而不通过父元素获得?
                   *  需要在子元素里使用grow,则自动填充满!
                   */
                  layout(v) {
                    return simpleFlex({
                      direction: 'y',
                      directionFix: "start",
                      alignFix: true,
                      alignItems: "start",
                      gap: 8
                    })
                  },
                  ext: {
                    align: 'stretch',
                    grow: 1
                  },
                  children() {
                    hookDrawText({
                      config: {
                        text: faker.person.fullName()
                      },
                    })
                    hookDrawTextWrap({
                      config: {
                        maxLines: 2,
                        text: faker.lorem.lines(4),
                        fontSize: '12px'
                      },
                      ext: {
                        align: 'stretch',
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
    })
  })

}