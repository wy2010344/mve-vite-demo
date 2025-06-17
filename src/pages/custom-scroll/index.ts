import { fdom } from "mve-dom";
import { hookDestroy } from "mve-helper";
import { animateSignal, pointerMove } from "wy-dom-helper";
import { addEffect, ClampingScrollFactory, createSignal, destinationWithMargin, eventGetPageX, eventGetPageY, scrollForEdge, ScrollFromPage } from "wy-helper";
import { measureMaxScroll, OnScroll, OnScrollHelper } from 'mve-dom-helper';

export default function () {



  const helperX = new OnScrollHelper('x')
  const helperY = new OnScrollHelper('y')
  const maxScrollX = helperX.measureMaxScroll()
  const scrollX = helperX.hookLazyInit({
    maxScroll: maxScrollX.get
  })
  const maxScrollY = helperY.measureMaxScroll()
  const scrollY = helperY.hookLazyInit({
    maxScroll: maxScrollY.get
  })
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
      maxScrollX.hookInit(container, content,)
      maxScrollY.hookInit(container, content,)
    }
  })
}