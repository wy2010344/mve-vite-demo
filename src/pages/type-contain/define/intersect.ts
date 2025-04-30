import { KVPair } from "wy-helper";
import { AllMayBaseType, AllMayType, Any, include } from ".";
import { Union, unionToList } from "./union";

/**
 * 交集类似于加法
 * 合集类似于乘法
 * 当然可以按照分配律化简
 * 到底是先乘后加,还是先加后乘?
 * 
 * 交集主要是,难以确定是否是别个的子集. 
 * 
 * 也许不应该要这个交集
 * 交集用于显式的计算
 * pair是特殊的可以直接交集. 
 * 运算时从合集里析出什么,本质上就是求交集呀,如果有成员可以析出,如果无法判断
 * 
 * 假如使用类型宇宙呢?
 * 在类型宇宙里没有联合类型,都是某种具体类型.
 * 没有交集类型,析出类型,是使用switch分支假设存在,防御所有情况.
 * 本质上是联合在顶层构造,不属于动态构造,也就没有不确定的联合.
 * 
 * 
 * 函数和函数的交集
 * 也许是相同入参同相同出参
 * 这些化简有点难
 * 
 * 函数的交集,取入参的交集,与各自计算出的出参的交集,仍然需要根据出参的交集,反查入参的交集中符合条件的值
 * 也许函数不应该参与类型演算
 * 或者不应该求交集 
 */

function toIntersectOne(
  a: AllMayBaseType,
  b: AllMayBaseType,
  list: AllMayBaseType[]
) {
  if (include(a, b)) {
    list.push(b)
  } else if (include(b, a)) {
    list.push(a)
  } else {

    //函数的包含可以化简
    //类型彼此之间的包含不能化简

    if (a instanceof KVPair && b instanceof KVPair) {
      let doCheck = true
      let ret = a
      let bTemp: KVPair<AllMayType> | undefined = b
      while (bTemp && doCheck) {
        const key = bTemp.key
        const value = bTemp.value
        const af = a.get(key)
        if (af) {
          const av = af.value
          const fv = toIntersect(value, av)
          if (fv == Any.empty) {
            doCheck = false
          } else {
            ret = ret.add(key, fv)
          }
        } else {
          ret = ret.add(key, value)
        }
        bTemp = bTemp.rest
      }
      if (doCheck) {
        list.push(ret)
      }
    }
  }
}

/**
 * 求交集 可以使用分配率
 * 如果a中有{x:u},b中有{y:z},即会出现{x:u,y:z}
 * 情况比较复杂,ts中没有能化简
 * @param a 
 * @param b 
 */
export function toIntersect(a: AllMayType, b: AllMayType): AllMayType {
  const list: AllMayBaseType[] = []
  const axs = unionToList(a)
  const bxs = unionToList(b)
  axs.forEach(ax => {
    bxs.forEach(bx => {
      toIntersectOne(ax, bx, list)
    })
  })

  if (list.length) {
    let ret: AllMayType = list[0]
    for (let i = 1; i < list.length; i++) {
      ret = Union.from(ret, list[i])
    }
    return ret
  }
  return Any.empty
}