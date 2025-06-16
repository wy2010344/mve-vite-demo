import { fdom } from "mve-dom";
import { hookDestroy } from "mve-helper";
import { animateSignal, pointerMove } from "wy-dom-helper";
import { addEffect, ClampingScrollFactory, createSignal, destinationWithMargin, eventGetPageX, eventGetPageY, scrollForEdge, ScrollFromPage } from "wy-helper";
import { OnScroll } from "./scrollX";

export default function () {


  const scrollX = animateSignal(0)
  const scrollY = animateSignal(0)
  fdom.div({
    className: 'w-100 h-100 overflow-hidden relative',
    children(container: HTMLElement) {
      const content = fdom.div({
        className: 'w-500 h-500 absolute',
        s_background: `conic-gradient(red, orange, yellow, green, blue)`,
        s_top() {
          return -scrollY.get() + 'px'
        },
        s_left() {
          return -scrollX.get() + 'px'
        }
      })


      OnScroll.hookGet(content, {
        container,
        scroll: scrollX,
        direction: 'x'
      })
      OnScroll.hookGet(content, {
        container,
        scroll: scrollY,
        direction: 'y'
      })
    }
  })
}