import { runG } from './generator'
import { fdom } from 'mve-dom'
export default function () {
  runG()
  fdom.div({
    childrenType: "text",
    children: 'abc'
  })
}