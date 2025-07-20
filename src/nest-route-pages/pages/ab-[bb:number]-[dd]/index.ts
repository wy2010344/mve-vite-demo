import { fdom, renderText } from "mve-dom";
import { LeafLoaderParam } from "mve-helper";
import { GetValue, KVPair } from "wy-helper";

export default function (arg: GetValue<LeafLoaderParam>) {
  fdom.div({
    children() {
      renderText`ab-${() => JSON.stringify(arg().query)}-cc`
    }
  })
}