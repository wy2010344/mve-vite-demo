import { createRoot, svg } from "mve-dom"
import { hookPromiseSignal, renderIf, renderOne, renderOneKey } from "mve-helper";
import { IconContext } from "mve-icons"
import { AbortPromiseResult, EmptyFun, GetValue, memo, quote } from "wy-helper";
import { branchesToPairs, PairBranch, PairLeaf, PairMore, TreeRoute } from 'wy-helper/router';
import { getHistoryState } from "../history";
const app = document.querySelector<HTMLDivElement>('#app')!
const pages = import.meta.glob('./pages/**')
const INDEX = 'index'
const LAYOUT = 'layout'
type BranchLoader = {
  default(arg: GetValue<Record<string, any>>, renderChildren: EmptyFun): void
}
type LeafLoader = {
  default(arg: GetValue<Record<string, any>>): void
}
type MoreLoader = {
  default(arg: GetValue<Record<string, any>>, rest: GetValue<string[]>): void
}
const tree = new TreeRoute<BranchLoader, LeafLoader, MoreLoader>({
  number(n: string) {
    if (!n) {
      throw new Error('不允许省略')
    }
    const x = Number(n)
    if (isNaN(x)) {
      throw new Error('not a number ' + n)
    }
    return x
  }
})
tree.buildFromMap(pages, './pages/')
tree.finishBuild()
type BranchOrLeaf = PairBranch<BranchLoader, LeafLoader, MoreLoader> | PairLeaf<LeafLoader> | PairMore<MoreLoader>
function renderBranch(getBranch: GetValue<BranchOrLeaf>) {
  renderOneKey(getBranch, v => v.layout || v.default || v.index, function (layout) {
    const branch = getBranch()
    if (branch.default) {
      //在终止中
      const { get } = hookPromiseSignal(() => branch.default)
      renderOne(get, function (value?: AbortPromiseResult<MoreLoader>) {
        if (value?.type == 'success') {
          value.value.default(() => getBranch().query, () => getBranch().restNodes!)
        } else if (value?.type == 'error') {

        } else {

        }
      })
    } else {
      if (branch.layout) {
        //在布局中
        /**
         * @todo 对于hookPromiseSignal
         * 如果error,在get时,可以重复尝试.
         */
        const { get } = hookPromiseSignal(() => branch.layout)
        renderOne(get, function (value?: AbortPromiseResult<BranchLoader>) {
          if (value?.type == 'success') {
            value.value.default(() => getBranch().query, () => {
              renderBranch(() => getBranch().next!)
            })
          } else if (value?.type == 'error') {

          } else {

          }
        })
      }
      if (branch.index) {
        //在终止中
        const { get } = hookPromiseSignal(() => branch.index)
        renderOne(get, function (value?: AbortPromiseResult<LeafLoader>) {
          if (value?.type == 'success') {
            value.value.default(() => getBranch().query)
          } else if (value?.type == 'error') {

          } else {

          }
        })
      }
    }
  })
}
/**
 * 虽说是层级加载,复用layout
 * 其实是预知了存在
 * 
 * 像react,子层级其实要作为数据传入容器,才能体现出差异性
 * 这里,当然,是同路径的区域,状态要保留
 */
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
  const getBranch = memo(() => {
    try {
      const nodes = getHistoryState().pathname.split('/').filter(quote)
      const out = tree.matchNodes(nodes)
      console.log("out", out)
      return branchesToPairs(out)
    } catch (err) {
      console.log("err", err)
    }
  })
  renderIf(getBranch, function () {
    console.log("get", getBranch())
    renderBranch(getBranch as GetValue<BranchOrLeaf>)
  })
})
window.addEventListener("unload", destroy)