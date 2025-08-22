import { renderMobileView } from "../../onlyMobile";
import { alignSelf, arrayCountCreateWith, ClampingScrollFactory, memo } from "wy-helper";
import { hookDrawRect, simpleFlex, hookDrawText, hookDrawUrlImage, hookDrawTextWrap, renderCanvas, hookFill } from "mve-dom-helper/canvasRender";

import { faker } from "@faker-js/faker";
import { OnScroll } from "mve-dom-helper";

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

      const data = arrayCountCreateWith(3000, (i) => {
        return i
      })

      const totalHeight = memo(() => {
        let totalHeight = 0
        container.children().forEach(child => {
          totalHeight += 4 + child.axis.y.size()
        })
        return totalHeight
      })

      const scrollY = new OnScroll('y', {
        maxScroll() {
          return totalHeight() - container.axis.y.size()
        }
      })
      const container = hookDrawRect({
        width,
        height,
        paddingTop() {
          return -scrollY.get()
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
          hookFill('white')
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
              skipDraw(n) {
                if (n.axis.y.position() > container.axis.y.size()) {
                  return true
                }
                if (n.axis.y.position() + n.axis.y.size() < 0) {
                  return true
                }
                return false
              },
              draw(ctx, n, p) {
                hookFill(i % 2 ? '#A5D2EE' : '#EEEEEE')
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
                      config() {
                        return {
                          text: faker.person.fullName() + '   ' + i
                        }
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

    })
  })

}