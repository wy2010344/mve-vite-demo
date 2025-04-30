import { dom, fdom } from "mve-dom";
import { EmptyFun } from "wy-helper";


const allBaseType = [
  "变量类型",
  "Pair类型",
  "Record类型",
  "字符串实例",
  "数字实例",
  "符号实例",
  "字符串类",
  "数字类",
  "符号类"
] as const

type AllBaseType = typeof allBaseType[number]


/**
 * 其实需要靶向测试,即每种类型生成随机值,再测试
 * 但是类型仍然是相当复杂的
 */
export default function () {



  const data: {
    [key in AllBaseType]: {
      [key in AllBaseType]: EmptyFun
    }
  } = {
    '变量类型': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    'Pair类型': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    'Record类型': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '字符串实例': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '数字实例': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '符号实例': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '字符串类': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '数字类': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    },
    '符号类': {
      '变量类型'() { },
      'Pair类型'() { },
      'Record类型'() { },
      '字符串实例'() { },
      '数字实例'() { },
      '符号实例'() { },
      '字符串类'() { },
      '数字类'() { },
      '符号类'() { }
    }
  }


  function getData(left: AllBaseType, right: AllBaseType) {
    if (left == '变量类型') {
      /**
       * 变量类型和普通类型相交
       * 如变量类型是(String a)与(String b)相交,即是一种交集,无法确定它们的交集表达
       * ({x:8} a)与({y:8} b) 相交,它们的超集能相交不为空,则取子集联合,即有一个包含的上限,是它们超集的交集
       */
    }
  }

  const columndefs = [
    {
      head() {
        dom.th().render()
      },
      cell() {

      }
    },
    {
      head() {
        dom.td().renderText``
      },
      cell() {

      }
    }
  ]

  fdom.div({

    className: 'overflow-x-auto w-full',
    children() {
      fdom.table({
        className: 'daisy-table daisy-table-xs daisy-table-pin-rows daisy-table-pin-cols text-center',
        children() {
          fdom.thead({
            children() {
              fdom.tr({
                children() {
                  columndefs.forEach(columnDef => {
                    columnDef.head()
                  })
                }
              })
            }
          })
          fdom.tbody({
            children() {
              fdom.tr({
                children() {

                }
              })
            }
          })
        }
      })
    }
  })
}