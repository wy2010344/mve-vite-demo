import { fdom, renderText } from "mve-dom";
import { hookDestroy, renderOne } from "mve-helper";
import { subscribeEventListener } from "wy-dom-helper";
import { createSignal, GetValue } from "wy-helper";
import fixRightTop from "./fixRightTop";
import themeDropdown from "./themeDropdown";


/**
 * contain-mobile 可以包含手机屏幕
 * also-mobile 可以包含手机屏幕,也是手机屏幕比例
 * mobile 只能作为手机屏幕
 * not-mobile 不是手机屏幕的比例,也不能包含手机屏幕
 */
type ShowModelType = 'fake-and-mobile' | 'also-mobile' | 'mobile' | 'not-mobile'
export function onlyMobile() {


  function judgeMobile(): ShowModelType {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w / h > 3 / 4) {
      //非mobile形状
      if (h > 879) {
        return 'fake-and-mobile'
      } else {
        return 'not-mobile'
      }
    } else {
      if (w > 424) {
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


export function renderMobileView(
  renderDisplay: (width: GetValue<number>, mock?: boolean) => void,
) {
  const isMobile = onlyMobile()
  renderOne(isMobile, function (showType) {
    if (showType == 'mobile') {
      const width = createSignal(window.innerWidth)
      hookDestroy(subscribeEventListener(window, 'resize', e => {
        width.set(window.innerWidth)
      }))
      fdom.div({
        className: 'w-full h-full',
        children() {
          renderDisplay(width.get)
        }
      })
    } else if (showType == 'fake-and-mobile' || showType == 'also-mobile') {
      fdom.div({
        className: 'daisy-mockup-phone',
        children() {
          fdom.div({
            className: 'daisy-mockup-phone-camera'
          })
          fdom.div({
            className: 'daisy-mockup-phone-display bg-base-100 daisy-card flex flex-col items-stretch',
            children() {
              fdom.div({
                className: 'h-10'
              })
              fdom.div({
                className: 'flex-1 min-h-0 relative',
                children() {
                  renderDisplay(() => 390, true)
                }
              })
            }
          })
        }
      })
    } else {
      renderText`屏幕比例不支持,需要小于3/4`
    }
  })

}