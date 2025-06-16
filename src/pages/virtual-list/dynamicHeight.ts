import { getSubListInfo } from "mve-helper"
import { batchSignalEnd, createSignal, getSubListForVirtualList, GetValue, memo, ReadArray } from "wy-helper"
import hookMeasureHeight from "./hookMeasureHeight"



export function dynamicHeight() {
  const version = createSignal(0)
  const cacheMap = new Map<number, number>()
  const averageHeight = memo(() => {
    let h = 0
    let c = 0
    version.get()
    cacheMap.forEach(v => {
      h = h + v
      c++
    })
    if (c) {
      return h / c
    }
    return 100
  })

  function getHeightWithId(id: number) {
    version.get()
    const h = cacheMap.get(id)
    if (typeof h == 'number') {
      return h
    }
    return averageHeight() || 100
  }
  return {
    getHeightWithId,
    averageHeight,
    measureHeight(key: number, div: HTMLElement) {
      hookMeasureHeight(div, function () {
        cacheMap.set(key, div.clientHeight)
        version.set(version.get() + 1)
        batchSignalEnd()
      })
    }
  }
}

export function dynamidHeight2<T>(
  getList: GetValue<ReadArray<T>>,
  getCellHeight: (v: T) => number | undefined
) {

  const averageHeight = memo(() => {
    const array = getList()
    let h = 0
    let c = 0
    for (let i = 0; i < array.length; i++) {
      const rowHeight = getCellHeight(array[i])
      if (typeof rowHeight == 'number') {
        h = h + rowHeight
        c++
      }
    }
    if (c) {
      /**
       * 计算平均高度
       */
      return h / c
    }
    //不设个最小高度,会从0到结束
    return 100
  })


  function getHeight(v: T) {
    const h = getCellHeight(v)
    if (typeof h == 'number') {
      return h
    }
    return averageHeight()
  }

  return {
    getHeight,
    averageHeight
  }
}

export function forEachSub<T, K>(
  getList: GetValue<ReadArray<T>>,
  getId: (v: T) => K,
  subList: GetValue<readonly [number, number]>,
) {
  return function (callback: (key: K, value: T) => void) {
    const array = getList()
    const [beginIndex, endIndex] = subList()
    for (let i = beginIndex; i < endIndex; i++) {
      const row = array[i]
      callback(getId(row), row)
    }
  }
}

export function forEachSubReverse<T, K>(
  getList: GetValue<ReadArray<T>>,
  getId: (v: T) => K,
  subList: GetValue<readonly [number, number]>,
) {
  return function (callback: (key: K, value: T) => void) {
    const array = getList()
    const [beginIndex, endIndex] = subList()
    // console.log("range", beginIndex, endIndex)
    for (let i = endIndex; i > beginIndex; i--) {
      const row = array[i - 1]
      callback(getId(row), row)
    }
  }

}