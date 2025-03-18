import { faker } from "@faker-js/faker";
import { fdom } from "mve-dom";
import { pointerMoveDir, signalAnimateFrame } from "wy-dom-helper";
import { destinationWithMarginTrans, eventGetPageX, FrictionalFactory, overScrollSlow, ScrollFromPage } from "wy-helper";

export default function () {


  fdom.div({
    s_width: '100%',
    s_height: '100vh',
    s_display: 'flex',
    s_alignItems: 'center',
    s_justifyContent: 'center',
    onTouchMove(e) {
      e.preventDefault()
    },
    children() {
      const scrollX = signalAnimateFrame(0)
      const bs = FrictionalFactory.get()
      let content: HTMLElement
      const container = fdom.div({
        s_width: '320px',
        s_height: '240px',
        s_overflow: 'hidden',
        s_background: '#444',
        onPointerDown: pointerMoveDir(function (e, dir) {
          return ScrollFromPage.from(e, {
            getPage: eventGetPageX,
            scrollDelta(delta, velocity) {
              const y = scrollX.get()
              scrollX.changeTo(
                y +
                overScrollSlow(y, delta, container.clientWidth, content.offsetWidth)
              )
            },
            onFinish(velocity) {
              const out = bs.destinationWithMarginIscroll({
                velocity,
                current: scrollX.get(),
                containerSize: container.clientWidth,
                contentSize: content.offsetWidth
              })
              destinationWithMarginTrans(out, scrollX)
            }
          })
        }),
        children() {
          content = fdom.div({
            s_display: 'flex',
            s_alignItems: 'center',
            s_width: 'fit-content',
            s_transform() {
              return `translateX(${-scrollX.get()}px)`
            },
            children() {
              for (let i = 0; i < 5; i++) {
                fdom.div({
                  s_height: '240px',
                  s_width: '200px',
                  s_display: 'flex',
                  s_alignItems: 'center',
                  s_justifyContent: 'center',
                  children() {
                    fdom.img({
                      s_borderRadius: '10px',
                      s_boxShadow: `inset 2px 2px 6px rgba(255,255,255,0.6),
		inset -2px -2px 6px rgba(0,0,0,0.6),
		0 1px 8px rgba(0,0,0,0.8)`,
                      src: faker.image.avatar()
                    })
                  }
                })
              }
            }
          })
        }
      })
    }
  })
}