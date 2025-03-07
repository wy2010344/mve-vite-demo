import { hookDestroy } from "mve-helper";
import { subscribeEventListener } from "wy-dom-helper";
import { createSignal } from "wy-helper";


/**
 * contain-mobile 可以包含手机屏幕
 * also-mobile 可以包含手机屏幕,也是手机屏幕比例
 * mobile 只能作为手机屏幕
 * not-mobile 不是手机屏幕的比例,也不能包含手机屏幕
 */
type ShowModelType = 'contain-mobile' | 'also-mobile' | 'mobile' | 'not-mobile'
export function onlyMobile() {


  function judgeMobile(): ShowModelType {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w / h > 3 / 4) {
      //非mobile形状
      if (h > 879) {
        return 'contain-mobile'
      } else {
        return 'not-mobile'
      }
    } else {
      if (h > 879) {
        return 'also-mobile'
      }
      return 'mobile'
    }
  }
  const showMobile = createSignal(judgeMobile())
  hookDestroy(subscribeEventListener(window, 'resize', e => {
    showMobile.set(judgeMobile())
  }))
  return showMobile.get
}