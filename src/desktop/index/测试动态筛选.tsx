import { dragResizePanel } from "../form";

import { createElement, Dom, Fragment } from 'mve-dom/tsxSupport'
import { delayMap } from "mve-dom/delayMap";
import { delayIf } from "mve-dom/delayIf"
import { mve } from 'mve-core/util'


const list = Array(100).fill('').map((v, i) => i)

export const 测试动态筛选 = dragResizePanel(function (x) {

  const filter = mve.valueOf(2)
  return {
    title: "测试动态筛选",
    content: <Fragment>
      <Dom type="div">文字</Dom>
      <Dom type="input" attr={{ type: "number" }} event={{
        change(e) {
          const value = Number(e.target.value)
          filter(value)
        }
      }} />

      {delayIf(
        () => 100 % filter() == 0,
        v => v,
        function (me, row) {
          return <Dom type="div" style={{
            height: "30px",
            background: "black"
          }}>
            <Dom type="input" />
          </Dom>
        }
      )}

      {delayMap(
        () => {
          const vs = list.filter(v => v % filter() == 0)
          if (filter() % 2 == 0) {
            vs.reverse()
          }
          return vs
        },
        v => v,
        function (me, row, i) {
          return <Dom type="div">
            {row} --- {i()}
            <Dom type="input" />
          </Dom>
        }
      )}


    </Fragment>
  }
})