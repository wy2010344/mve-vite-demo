import { fdom, renderText } from "mve-dom";
import { Branch, getBranchKey, renderArrayKey, renderOneKey } from "mve-helper";
import { EmptyFun, GetValue } from "wy-helper";
import { loadContext } from "~/nest-route-pages/loadContext";

export default function (
  args: {

  },
  getBranch: GetValue<Branch>,
  load: (path: string) => Branch
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
      renderText`Layout2`
      renderArrayKey(() => {
        const a = getBranch()
        const key = a.nodes![1]
        const idx = tabs.findIndex(v => v.path == key)
        const before = tabs[idx - 1]
        const list: {
          branch: Branch
          step?: 'before' | 'after'
        }[] = []
        if (before) {
          list.push({
            branch: load('abc/' + before.path),
            step: 'before'
          })
        }
        list.push({
          branch: a
        })
        const after = tabs[idx + 1]
        if (after) {
          list.push({
            branch: load('abc/' + after.path),
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