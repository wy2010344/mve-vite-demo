import { createRoot, fdom, fsvg, renderText, svg } from 'mve-dom'
import demo1 from './pages/demo1'
import magnifiedDock from './pages/magnified-dock'
import observer from './oberver'
import canvas from './canvas'
import changePortal from './changePortal'
import clipDemo from './clipDemo'
import tree from './pages/tree'
import absoluteDemo from './absoluteDemo'
import canvas2 from './pages/canvas-demo'
import typeContain from './typeContain'
import three from './three'
import scrollDemo1 from './scroller-demo/demo1'
import scrollDemo1p from './scroller-demo/demo1p'
import pagingx from './scroller-demo/pagingx'
import snapDemo from './scroller-demo/snapDemo'
import scrollerDemo1 from './demos/scrollerDemo1'
import reorderDemo from './pages/reorder-demo'
import demo2 from './demos/demo2'
import calendar from './pages/calendar'
import dailycost from './dailycost'
import { history, historyState } from './history'
import { hookDestroy, hookPromiseSignal, promiseSignal, renderArray, renderIf, renderOne } from 'mve-helper'
import route from './route'
import themes from "daisyui/functions/themeOrder"
import { getToasts } from './toast'
import { IconContext } from "mve-icons";
import { emptyFun } from 'wy-helper'
const app = document.querySelector<HTMLDivElement>('#app')!
const destroy = createRoot(app, () => {
  //@ts-ignore
  IconContext.provide({
    renderItem(tag: any, attrs: any, children: any) {
      svg[tag as 'svg'](attrs).render(children)
    },
    renderRoot(attrs: any, children: any) {
      svg.svg({
        ...attrs,
        fill: "currentColor"
      }).render(children)
    }
  })


  const { get, loading } = hookPromiseSignal(() => {
    let pathname = historyState.get().location.pathname
    if (pathname.startsWith('/')) {
      pathname = pathname.slice(1)
    }
    const load = (route as any)[pathname || 'index'];
    return load
  })
  renderIf(loading, () => {
    fdom.span({
      className: 'absolute left-1 top-1 daisy-loading daisy-loading-spinner daisy-loading-xl',
    })
  })
  fdom.div({
    className: "daisy-toast daisy-toast-top daisy-toast-center",
    children() {
      renderArray(getToasts, function (row) {
        row.render()
      })
    }
  })

  fdom.div({
    className: 'absolute right-1 top-1 daisy-dropdown mb-72',
    children() {
      fdom.div({
        className: 'daisy-dropdown daisy-dropdown-end ',
        children() {
          fdom.div({
            tabIndex: 0,
            role: 'button',
            className: 'daisy-btn m-1',
            children() {
              renderText`Theme`
              fsvg.svg({
                width: '12px',
                height: '12px',
                className: 'inline-block h-2 w-2 fill-current opacity-60',
                xmlns: 'http://www.w3.org/2000/svg',
                viewBox: '0 0 2048 2048',
                children() {
                  fsvg.path({
                    d: 'M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z',
                  })
                }
              })
            }
          })
          fdom.ul({
            tabIndex: 0,
            className: 'daisy-dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl',
            children() {
              for (const theme of themes) {
                fdom.li({
                  className: 'relative flex items-center',
                  children() {
                    fdom.div({
                      data_theme: theme,
                      className: 'grid grid-cols-2 gap-0.5 p-1 rounded-md shadow-sm shrink-0 bg-base-100 absolute right-0 z-10',
                      children() {
                        fdom.div({
                          className: 'size-1 rounded-full bg-base-content',
                        })
                        fdom.div({
                          className: 'size-1 rounded-full bg-primary',
                        })
                        fdom.div({
                          className: 'size-1 rounded-full bg-secondary',
                        })
                        fdom.div({
                          className: 'size-1 rounded-full bg-accent',
                        })
                      }
                    })
                    fdom.input({
                      type: 'radio',
                      name: 'theme-dropdown',
                      className: 'theme-controller daisy-btn daisy-btn-sm daisy-btn-block daisy-btn-ghost justify-start',
                      aria_label: theme,
                      value: theme,
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
  renderOne(get, function (result) {
    if (result) {
      if (result.type == 'success') {
        const value = result.value as any
        try {
          value.default()
        } catch (err) {
          renderError(`该资源${historyState.get().location.pathname}不是正常的组件`)
        }
      } else {
        renderError(`加载资源失败${historyState.get().location.pathname}, ${result.value}`)
      }
    } else {
      renderIf(loading, () => {
        fdom.span({
          className: 'daisy-loading daisy-loading-spinner daisy-loading-xl',
        })
      }, () => {
        renderError(`未找到资源${historyState.get().location.pathname}`)
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