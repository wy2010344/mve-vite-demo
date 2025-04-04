import { fsvg } from "mve-dom";
import { EmptyFun } from "wy-helper";


export function renderSizeSvg(
  attrs: {
    viewBox: string
  },
  children: EmptyFun,
  size: string
) {
  return fsvg.svg({
    ...attrs,
    fill: "currentColor",
    stroke: 'currentColor',
    strokeWidth: 0,
    width: size,
    height: size,
    children
  })
}