import { dom, fdom } from "mve-dom";
import { EmptyFun } from "wy-helper";

export default function (children: EmptyFun) {
  fdom.div({
    className: 'fixed right-1 top-1 flex gap-1 items-center',
    children
  })
}