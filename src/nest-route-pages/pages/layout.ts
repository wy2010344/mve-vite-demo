import { routerConsume } from "daisy-mobile-helper";
import { fdom, renderText } from "mve-dom";
import { Branch, getBranchKey, renderOneKey } from "mve-helper";
import { EmptyFun, GetValue } from "wy-helper";
import { loadContext } from "../loadContext";
import { renderMobileView } from "~/onlyMobile";

export default function (
  args: any,
  getBranch: GetValue<Branch>
) {

  const { renderBranch } = loadContext.consume()
  renderMobileView(function ({
    width, height
  }, mock) {

    fdom.div({
      children() {
        renderOneKey(
          getBranch,
          getBranchKey,
          function (key) {
            renderBranch(getBranch)
          }
        )
      }
    })
  })
}