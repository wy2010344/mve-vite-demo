import { fdom, renderText } from "mve-dom";
import { Branch, BranchLoaderParam, getBranchKey, renderArrayKey, renderOneKey } from "mve-helper";
import { EmptyFun, GetValue, quote } from "wy-helper";
import { loadContext } from "~/nest-route-pages/loadContext";

export default function (
  arg: BranchLoaderParam
) {

  const { renderBranch } = loadContext.consume()

  const tabs = [
    {
      path: 'aa'
    },
    {
      path: 'bb'
    },
    {
      path: 'cc'
    }
  ]
  fdom.div({
    children() {
      renderText`Layout2--${() => JSON.stringify(arg.getQuery())}`
      renderArrayKey(() => {
        const a = arg.getChildren()
        const key = a.nodes![1]
        const idx = tabs.findIndex(v => v.path == key)
        const before = tabs[idx - 1]
        const list: {
          branch: Branch
          step?: 'before' | 'after'
        }[] = []
        if (before) {
          list.push({
            branch: arg.load(before.path),
            step: 'before'
          })
        }
        list.push({
          branch: a
        })
        const after = tabs[idx + 1]
        if (after) {
          list.push({
            branch: arg.load(after.path),
            step: 'after'
          })
        }
        console.log("list", list)
        return list
      }, v => getBranchKey(v.branch), function (getValue, idx, loadr) {
        renderBranch(() => getValue().branch)
      })
    }
  })
}