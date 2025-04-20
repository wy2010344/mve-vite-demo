import { KVPair, quote, removeWhere } from "wy-helper"
import { KPair } from "wy-helper/kanren"

export class Any<T extends string> {
  private constructor(
    public readonly flag: T
  ) { }
  static all = new Any('all')
  static string = new Any('string')
  static number = new Any('number')
  static empty = new Any('empty')
  static symbol = new Any('symbol')
}


/**
 * 泛型类型
 */
export class VarType {
  constructor(
    public readonly belong: AllMayType
  ) { }
}

export class Fun<T> {
  constructor(
    /**
     * 入参集合
     */
    readonly arg: T,
    /**
     * 入参集合代入返回的集合
     */
    readonly out: T,
    readonly apply: (a: any) => any
  ) { }
}


export class Union<T> {
  constructor(
    public readonly list: T[]
  ) { }
}

type AllMayBaseType = VarType
  | KVPair<AllMayType>
  | Fun<AllMayType>
  | KPair<AllMayType, AllMayType>
  | string
  | number
  | Any<'symbol'>
  | Any<"all">
  | Any<"string">
  | Any<"number">
  | Any<"empty">
export type AllMayType = AllMayBaseType | Union<AllMayBaseType>

export function allMayTypeToString(n: AllMayType): string {
  if (n instanceof Any) {
    if (n == Any.all) {
      return 'All'
    } else if (n == Any.number) {
      return 'Number'
    } else if (n == Any.string) {
      return 'String'
    } else if (n == Any.empty) {
      return 'Empty'
    } else if (n == Any.symbol) {
      return 'Symbol'
    } else {
      throw '未定义'
    }
  } else if (typeof n == 'number') {
    return n + ''
  } else if (typeof n == 'string') {
    return n
  } else if (n instanceof Union) {
    return `(${n.list.map(allMayTypeToString).join(' | ')})`
  } else if (n instanceof KPair) {
    return `(${allMayTypeToString(n.left) + ' + ' + allMayTypeToString(n.right)})`
  } else if (n instanceof KVPair) {
    return `(${n.key}:${allMayTypeToString(n.value)}${n.rest ? `& ${allMayTypeToString(n.rest)}` : ''})`
  } else if (n instanceof Fun) {
    return `(${allMayTypeToString(n.arg)} => ${allMayTypeToString(n.out)})`
  } else if (n instanceof VarType) {
    return `(var ${allMayTypeToString(n)})`
  } else {
    throw `unkonwn type ${n}`;
  }
}

export type Scope = KVPair<AllMayType> | undefined

function toList(map: Record<string, AllMayType>) {
  let ret: Scope = undefined
  for (let key in map) {
    ret = new KVPair(key, map[key], ret)
  }
  return ret
}

export const topScope = toList({
  Empty: Any.empty,
  All: Any.all,
  String: Any.string,
  Number: Any.number,
  quote: new Fun(Any.all, Any.all, quote),
  /**
   * 怎么都不太对...
   */
  plus: new Fun<AllMayType>(
    Any.number,
    Any.number,
    (a) => {
      return new Fun<AllMayType>(Any.number, Any.number, function (b) {
        if (typeof a == 'number' && typeof b == 'number') {
          return a + b
        }
        return 'number'
      })
    }
  )
})

/**
 * 之前类似合一,存在变量的绑定
 * 这里已经过了合一阶段,即结构相似所以包含,位置推断
 * 以及一边执行一边替换,得到相同的结构
 * @param a 
 * @param b 
 * @returns 
 */

export function include(a: AllMayType, b: AllMayType): boolean {
  if (b == a) {
    //相同返回,包括Any<"*">,undefined,字面值类型
    return true
  }
  if (b == Any.empty) {
    //空集合
    return true
  }
  if (b instanceof VarType) {
    return include(a, b.belong)
  }
  if (b instanceof Union) {
    return b.list.every(rb => include(a, rb))
  }

  // if (a instanceof VarType) {
  //   if (b instanceof VarType) {
  //     return include(a, b.belong)
  //   }
  //   return false
  // }
  if (a instanceof Any) {
    if (a.flag == 'all') {
      return true
    }
    if (a.flag == 'string') {
      return typeof b == 'string'
    }
    if (a.flag == 'number') {
      return typeof b == 'number'
    }
    return false
  }
  if (a instanceof Union) {
    return a.list.some(v => include(v, b))
  }
  if (a instanceof Fun) {
    if (b instanceof Fun) {
      //(x:String)=>number包含(x:'abc')=>any
      if (include(a.arg, b.arg)) {
        const v = new VarType(b.arg)
        const aOut = a.apply(v)
        const bOut = b.apply(v)
        return include(bOut, aOut)
      }
    }
    return false
  }

  if (a instanceof KPair) {
    if (b instanceof KPair) {
      return include(a.left, b.left) && include(a.right, b.right)
    }
    return false
  }
  if (a instanceof KVPair) {
    if (b instanceof KVPair) {
      /**
       * b作为子集,key可能更多.
       * {
       *  x:String
       * }
       * 包含
       * {
       *  x:'dd',
       *  y:8
       * }
       */
      let x: KVPair<AllMayType> | undefined = a
      while (x) {
        const target = b.get(x.key)
        if (!target) {
          return false
        }
        if (!include(x.value, target.value)) {
          return false
        }
        x = x.rest
      }
      return true
    }
    return false
  }

  return false
}

function unionToList(a: AllMayType, slice?: boolean) {
  return a instanceof Union ? slice ? a.list.slice() : a.list : [a]
}

/**
 * 求并集
 * @param a 
 * @param b 
 * @returns 
 */
export function toUnion(a: AllMayType, b: AllMayType): AllMayType {
  const axs = unionToList(a, true)
  const bxs = unionToList(b)
  bxs.forEach(bx => {
    if (!axs.find(v => include(v, bx))) {
      removeWhere(axs, v => include(bx, v))
      axs.push(bx)
    }
  })
  return listToAllMayType(axs)
}
/**
 * 差集,就是这个元素,属于a与b,但不属于a与b的交集
 * @param a 
 * @param b 
 */
export function toExpect(a: AllMayType, b: AllMayType): AllMayType {
  const list: AllMayBaseType[] = []
  const axs = unionToList(a)
  const bxs = unionToList(b)
  axs.forEach(ax => {
    if (!include(b, ax)) {
      list.push(ax)
    }
  })
  bxs.forEach(bx => {
    if (!include(a, bx)) {
      list.push(bx)
    }
  })
  return listToAllMayType(list)
}
function listToAllMayType(list: AllMayBaseType[]): AllMayType {
  if (list.length > 1) {
    return new Union(list)
  }
  if (list.length == 1) {
    return list[0]
  }
  return Any.empty
}
/**
 * 求交集
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
    if (include(b, ax)) {
      list.push(ax)
    } else if (ax instanceof KVPair) {
      bxs.forEach(bx => {
        if (bx instanceof KVPair) {
          let doCheck = true
          let ret = ax
          let bTemp: KVPair<AllMayType> | undefined = bx
          while (bTemp && doCheck) {
            const key = bTemp.key
            const value = bTemp.value
            const af = ax.get(key)
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
      })
    }
  })
  return listToAllMayType(list)
}

type a = "x" | {
  y: 9
}

type b = {
  x: 8
} | "z"

type c = a & b

let m: c = {
  y: 9,
  x: 8
}