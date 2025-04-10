import { createRoot, fdom, fsvg, renderText, svg } from 'mve-dom'
import demo1 from './pages/demo1'
import magnifiedDock from './pages/magnified-dock'
import observer from './oberver'
import canvas from './canvas'
import changePortal from './changePortal'
import clipDemo from './clipDemo'
import tree from './pages/tree'
import absoluteDemo from './pages/absoluteDemo'
import canvas2 from './pages/canvas-demo'
import typeContain from './typeContain'
import three from './three'
import scrollDemo1 from './scroller-demo/demo1'
import scrollDemo1p from './scroller-demo/demo1p'
import pagingx from './scroller-demo/pagingx'
import snapDemo from './scroller-demo/snapDemo'
import scrollerDemo1 from './pages/demos/scrollerDemo1'
import reorderDemo from './pages/reorder-demo'
import demo2 from './pages/demos/demo2'
import calendar from './pages/calendar'
import dailycost from './daily-record'
import { history, getHistoryState } from './history'
import { hookDestroy, hookPromiseSignal, promiseSignal, renderArray, renderIf, renderOne } from 'mve-helper'
import themes from "daisyui/functions/themeOrder"
import { IconContext } from "mve-icons";
import { emptyFun, run } from 'wy-helper'
import { renderPop } from 'mve-dom-helper'
const app = document.querySelector<HTMLDivElement>('#app')!
const pages = import.meta.glob('./pages/**')
const destroy = createRoot(app, () => {
  IconContext.provide({
    renderItem(tag, attrs, children) {
      svg[tag as 'svg'](attrs).render(children)
    },
    renderRoot(attrs, children) {
      svg.svg({
        ...attrs,
        fill: "currentColor",
        stroke: 'currentColor',
        strokeWidth: '0'
      }).render(children)
    }
  })


  const { get, loading } = hookPromiseSignal(() => {
    let pathname = getHistoryState().pathname
    const load = pages[`./pages/${pathname || 'index'}.ts`]
    return load
  })
  renderIf(loading, () => {
    fdom.span({
      className: 'absolute left-1 top-1 daisy-loading daisy-loading-spinner daisy-loading-xl',
    })
  })
  renderPop()

  renderOne(get, function (result) {
    if (result) {
      if (result.type == 'success') {
        const value = result.value as any
        try {
          value.default()
        } catch (err) {
          console.error(err)
          renderError(`该资源${getHistoryState().pathname}执行失败 ${err}`)
        }
      } else {
        console.error(result.value)
        renderError(`加载资源失败${getHistoryState().pathname}, ${result.value}`)
      }
    } else {
      renderIf(loading, () => {
        fdom.span({
          className: 'daisy-loading daisy-loading-spinner daisy-loading-xl',
        })
      }, () => {
        renderError(`未找到资源${getHistoryState().pathname}`)
      })
    }
  })
  // dailycost()
  // calendar()
  // demo2()
  // scrollerDemo1()
  // reorderDemo()
  // changePortal()
  // canvas()
  // canvas2()
  // exitAnimate()
  // scrollDemo1()
  // scrollDemo1p()
  // pagingx()
  // snapDemo()
  // konvaDemo()
  // observer()
  // demo1()
  // typeContain()
  // tree()
  // absoluteDemo(app)
  // three()
  // clipDemo()
  // magnifiedDock()
  // forceDemo()
  // forceDemo2()
  // forceDemo3()
  // forceDemo4()
})

function renderError(message: string) {
  fdom.div({
    role: 'alert',
    className: 'daisy-alert daisy-alert-error',
    children() {
      fsvg.svg({
        xmlns: 'http://www.w3.org/2000/svg',
        // width: '24px',
        // height: '24px',
        className: 'h-6 w-6 shrink-0 stroke-current',
        fill: 'none',
        viewBox: '0 0 24 24',
        children() {
          fsvg.path({
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            strokeWidth: 2,
            d: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
          })
        }
      })
      fdom.span({
        childrenType: 'text',
        children: message,
      })
    }
  })
}

window.addEventListener("unload", destroy)