import { removeWhere } from "wy-helper"
import { AllMayBaseType, AllMayType, Any, include } from "."

export function unionToList(a: AllMayType): readonly AllMayBaseType[]
export function unionToList(a: AllMayType, slice: true): AllMayBaseType[]
export function unionToList(a: AllMayType, slice?: boolean) {
  return a instanceof Union ? slice ? a.list.slice() : a.list : [a]
}

export class Union<T> {
  private constructor(
    public readonly list: readonly T[]
  ) { }

  static from(a: AllMayType, b: AllMayType): AllMayType {
    const axs = unionToList(a, true)
    const bxs = unionToList(b)
    bxs.forEach(bx => {
      if (!axs.find(v => include(v, bx))) {
        //移除axs中包含bx的
        removeWhere(axs, v => include(bx, v))
        //增加到bx
        axs.push(bx)
        /**
         * 但对于函数
         * (x:string)=>8 | (x:8)=>string
         * 它的结果是empty
         * (x:string)=>8 | (x:'8')=>string
         * 入参取较小的,出参取较大的
         * 它的结果是(x:string)=>8|string
         * 它们并不相互包含,却是可以合并的.
         */
      }
    })
    return Union.listToAllMayType(axs)
  }

  private static listToAllMayType(list: AllMayBaseType[]): AllMayType {
    if (list.length > 1) {
      return new Union(list)
    }
    if (list.length == 1) {
      return list[0]
    }
    return Any.empty
  }
}