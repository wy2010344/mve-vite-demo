import { faker } from "@faker-js/faker";
import { absoluteDisplay, AbsoluteNode, renderAbsoulte, renderADom, adom } from "mve-dom-helper";
import { createSignal, emptyArray, flexDisplayUtil, quote, StoreRef } from "wy-helper";
import { renderArray } from "mve-helper";
import { fsvg } from "mve-dom";


/**
 * @todo 布局是父容器配置子容器
 *  子容器读取到父容器的布局参数,提供给自己的布局方案
 *  这套方案又能读取子容器自身的个性化参数,实现最终的自定义
 * 
 *  如果文字或图片,生成建议尺寸
 *  但父容器的布局是否采用它的建议尺寸?不,是容器强制使用用户自己的覆盖尺寸
 * @param n 
 * @returns 
 */
export default function () {
  const app = document.getElementById('app')!
  renderAbsoulte(app, () => {
    const a = createSignal(0)
    const list = createSignal<readonly number[]>(emptyArray as any[])
    const alist = createSignal<readonly number[]>(emptyArray as any[])
    adom.div({
      m_display() {
        return flexDisplayUtil({
          direction: "y",
          alignItems: 'end',
          gap: 10
        })
        // console.log("render", list.get().length)
        // if (list.get().length % 3) {
        //   return flexDisplay({
        //     direction: "y"
        //   })
        // } else {
        //   return flexDisplay({
        //     direction: "x"
        //   })
        // }
      },
      css_dddd: 89,
      // databc: "abc",
      // arihidden: true,
      onClick() {

      },
      onClickCapture() {

      },
      children() {
        adom.div({
          width: 30,
          height(n) {
            console.log("dd", n)
            return 40
          },
          s_background: faker.color.rgb()
        })
        renderList(list, a)
        renderList(alist, a)
        adom.button({
          // width: 40,//'auto',
          // height: 50,
          width: 'auto',
          height: 'auto',
          s_whiteSpace: "nowrap",
          // s_background: faker.color.rgb(),
          childrenType: "text",
          onClick() {
            a.set(a.get() + 1)
            list.set(list.get().concat(Date.now()))
            alist.set(alist.get().concat(Date.now()))
          },
          children() {
            return `${list.get().length}数据`
          }
        })
      }
    })
  })
}

function renderList(list: StoreRef<readonly number[]>, a: StoreRef<number>) {

  renderArray(list.get, (row, getIndex) => {
    const n = adom.div({
      // width: 40,
      // height: 50,
      width: 'auto',
      height: 'auto',
      s_whiteSpace: "nowrap",
      s_background: faker.color.rgb(),
      childrenType: "text",
      onClick() {
        list.set(list.get().filter(v => v != row))
      },
      children() {
        return `${a.get()}:${n.index()}====${row}---${getIndex()}`
      }
    })
  })
}