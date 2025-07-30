import { createRoot, fdom, fsvg, svg } from 'mve-dom'
import { destroyGlobalHolder } from 'mve-core'
import { routerProvide } from 'mve-dom-helper/history'
import { argForceNumber, createTreeRoute, getBranchKey, renderOneKey, } from 'mve-helper'
import { IconContext } from "mve-icons";
import { renderPop } from 'mve-dom-helper'
import { createHashHistory } from 'history';
const app = document.querySelector<HTMLDivElement>('#app')!
const pages = import.meta.glob('./pages/**')
const { renderBranch, getBranch, preLoad } = createTreeRoute({
  treeArg: {
    number: argForceNumber
  },
  pages,
  prefix: './pages/',
  renderError
})
createRoot(app, () => {
  const { getHistoryState } = routerProvide(createHashHistory())
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
  renderOneKey(
    getBranch(() => getHistoryState().pathname),
    getBranchKey,
    function (key, branch) {
      renderBranch(branch)
    }
  )
  renderPop()
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

window.addEventListener("unload", destroyGlobalHolder)