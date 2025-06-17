import { renderMobileView } from "../../onlyMobile";
import { addEffect, alignSelf, arrayCountCreateWith, batchSignalEnd, ClampingScrollFactory, createSignal, defaultSpringAnimationConfig, destinationWithMargin, eventGetPageY, flexDisplayUtil, memo, scrollForEdge, ScrollFromPage } from "wy-helper";
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawUrlImage, hookDrawTextWrap, renderCanvas } from "mve-dom-helper/canvasRender";

import Scroller from 'scroller';
import { hookTrackSignal } from "mve-helper";
import { faker, he } from "@faker-js/faker";
import { animateSignal, pointerMove } from "wy-dom-helper";
import { OnScroll, OnScrollHelper } from "mve-dom-helper";

const fr = ClampingScrollFactory.get()
const edgeFr = ClampingScrollFactory.get(100)
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

      const data = arrayCountCreateWith(100, (i) => {
        return i
      })

      const totalHeight = memo(() => {
        let totalHeight = 0
        container.children().forEach(child => {
          totalHeight += 4 + child.axis.y.size()
        })
        return totalHeight
      })
      const helper = new OnScrollHelper('y')
      const container = hookDrawRect({
        width,
        height,
        paddingTop() {
          return -helper.get()
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
          scrollY.pointerEventListner(e.original)
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
                      grow: 1,
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
                      gap: 12
                    })
                  },
                  // draw(ctx, n, path) {
                  //   return {
                  //     operates: [
                  //       { type: "fill", style: "yellow" }
                  //     ]
                  //   }
                  // },
                  alignSelf: alignSelf('stretch'),
                  grow: 1,
                  children() {
                    hookDrawText({
                      config: {
                        text: faker.person.fullName()
                      },
                    })
                    // hookDrawRect({
                    //   grow: 1,
                    //   alignSelf: alignSelf('stretch'),
                    //   draw(ctx, n, path) {
                    //     return {
                    //       operates: [
                    //         { type: "fill", style: "blue" }
                    //       ]
                    //     }
                    //   },
                    // })
                    hookDrawTextWrap({
                      config: {
                        maxLines: 3,
                        text: faker.lorem.lines(4),
                        fontSize: '12px'
                      },
                      alignSelf: alignSelf('stretch'),
                      // grow: 1,
                      // draw(ctx, n, draw, p) {
                      //   return {
                      //     operates: [
                      //       { type: "fill", style: "red" },
                      //       { type: "draw", callback: draw }
                      //     ]
                      //   }
                      // },
                    })
                  }
                })
              },
            })
          })
        },
      })

      const scrollY = helper.hookLazyInit({
        maxScroll() {
          return totalHeight() - container.axis.y.size()
        }
      })
    })
  })

}