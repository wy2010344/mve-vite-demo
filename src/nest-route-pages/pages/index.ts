import { fdom, renderText, renderTextContent } from "mve-dom";
import { GetValue } from "wy-helper";

export default function (arg: GetValue<{}>, getNodes: GetValue<string[]>) {
  fdom.div({
    children() {
      renderTextContent(() => {
        return `${JSON.stringify(arg())} -- ${getNodes().join('/')}`
      })
    }
  })
}