import { KVPair, quote, removeWhere } from "wy-helper"
import { KPair } from "wy-helper/kanren"
import { Union } from "./union"

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
 * 似乎不需要,因为把类型当值来计算
 * 
 */

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





export type AllMayBaseType = KVPair<AllMayType>
  | Fun<AllMayType>
  | KPair<AllMayType, AllMayType>
  | string
  | number
  | symbol
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
  } else if (typeof n == 'symbol') {
    return `#${n.description}#`
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
  if (b instanceof Union) {
    return b.list.every(rb => include(a, rb))
  }
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
    if (a.flag == 'symbol') {
      return typeof b == 'symbol'
    }
    return false
  }
  if (a instanceof Union) {
    return a.list.some(v => include(v, b))
  }
  if (a instanceof Fun) {
    if (b instanceof Fun) {
      /**
       * a:(x:'abc')=>number包含b: (x:String)=>99
       * 即需要类型a的地方,可以把b传递过去
       * 调用a时只会传递'abc',返回只要求是number
       */
      if (include(b.arg, a.arg)) {
        /**
         * out是直接签名类型
         * 不能使用out进行比较
         * 因为函数本身就是一种类型签名,用于计算,依赖入参,返回返回的类型参数.
         *  相当于泛型,根据值中带入的类型
         * 
         *  一个函数,类型代表入参的约束,一种校验
         *  但真实的集合要小一些,返回的集合又与真实的集合相关
         *  
         *  在IDE检验时,也在执行Lambda了.
         * 
         *  联合很容易,即使里面有重合.
         *  但交叉不容易,交叉减去部分,不确定
         *    只能取可依赖的交叉,比如KVPair的交叉
         * 
         * 这里把集合当成一个值
         * 
         * 函数之间的合集,要能正常使用,入参取较小那个,出参取较大那个 较大的集合
         * 函数之间的交集,要能正常使用,入参取较大那个,出参取较小那个 较小的集合
         *   ts中是这样的
         */
        const bOut = b.apply(a.arg)
        return include(a.out, bOut)
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

type x1<T extends '7' | '6'> = (a: '9' | '7' | T) => 9
type x2 = (a: '9' | '8') => number

type x3<T extends '6'> = x1<T> | x2
type x4<T extends '7'> = x1<T> & x2

let m1!: x3<'6'>
let m1x = m1('9')

let m2!: x4<'7'>
let m2x = m2('8')


function ab(x: x3<'6'>) {

}

ab(m2)


type K3 = x2 & {
  a: 9
}

function k1<T extends number>(n: T) {
  return {
    x: n,
    y: n
  }
}

let xm = k1(9)

function abb(
  g: <T extends 9 | 8>(n: T) => {
    x: T, y: T
  }
) {

}
abb(k1)