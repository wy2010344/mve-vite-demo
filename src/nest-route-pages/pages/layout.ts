import { routerConsume } from "daisy-mobile-helper";
import { fdom, renderText } from "mve-dom";
import { Branch, BranchLoaderParam, getBranchKey, renderOneKey } from "mve-helper";
import { EmptyFun, GetValue } from "wy-helper";
import { loadContext } from "../loadContext";
import { renderMobileView } from "~/onlyMobile";

export default function (get: GetValue<BranchLoaderParam>
) {

  function getNext() {
    return get().next
  }
  const { renderBranch } = loadContext.consume()
  console.log("d", get())
  renderMobileView(function ({
    width, height
  }, mock) {

    fdom.div({
      children() {
        renderOneKey(
          getNext,
          getBranchKey,
          function (key) {
            renderBranch(getNext)
          }
        )
      }
    })
  })
}