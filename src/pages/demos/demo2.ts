import { faker } from "@faker-js/faker";
import { fdom } from "mve-dom";
import { animateSignal, pointerMoveDir, } from "wy-dom-helper";
import { eventGetPageX, FrictionalFactory, scrollForEdge, ScrollFromPage } from "wy-helper";

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
      const scrollX = animateSignal(0)
      const bs = FrictionalFactory.get()
      let content: HTMLElement
      const container = fdom.div({
        s_width: '320px',
        s_height: '240px',
        s_overflow: 'hidden',
        s_background: '#444',
        onPointerDown: e => {
          scrollX.stop()
          pointerMoveDir(e, {
            onMove(e, dir) {
              return ScrollFromPage.from(e, {
                getPage: eventGetPageX,
                scrollDelta(delta, velocity) {
                  scrollForEdge(scrollX, delta, container.clientWidth, content.offsetWidth)
                }
              })
            }
          })
        },
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