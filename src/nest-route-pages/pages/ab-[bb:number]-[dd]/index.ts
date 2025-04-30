import { fdom, renderText } from "mve-dom";
import { GetValue, KVPair } from "wy-helper";

export default function (arg: GetValue<{
  bb: number
  dd: string
}>) {
  fdom.div({
    children() {
      renderText`ab-${() => arg().bb}-cc`
    }
  })
}