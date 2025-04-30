import { fdom, renderText } from "mve-dom";
import { EmptyFun } from "wy-helper";

export default function (
  args: {

  },
  renderChildren: EmptyFun
) {

  fdom.div({
    children() {
      renderText`Layout2`
      renderChildren()
    }
  })
}