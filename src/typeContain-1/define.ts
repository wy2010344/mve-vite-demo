/**
 * 不再使用鸭辩型多态性,只有确定类型
 * 可以联合
 * 确定类型有其方法
 * 
 * 在类型推导中,值可以含有类型
 * 使用一层结构体约束,其实
 * 可以但go一样提取鸭辩类型
 * 
 * 不用结构体约束,约束放在应用场合去校验
 * 只是在合一的时候,按什么顺序合一,鸭辩的结果不一样,主要是record里顺序不一定
 *  这种合一,结构变量匹配. 
 *  现在已经是合并后的状态,而不是在编程语言中需要隐式自动推导.
 * 
 * 但是,局部的联合似乎更可取,sealed class,不出现意外. 
 */

import { ReadMap } from "wy-helper"



export class Any<T> {
  private constructor(
    readonly flag: T
  ) { }
  static any = new Any('any')
  static string = new Any('string')
  static number = new Any('number')
}


export class VarType {
  constructor(
    public readonly belong: AllMayType
  ) { }
}

export class Fun<T> {
  constructor(
    public readonly arg: T,
    public readonly out: T
  ) { }
}


export class Union<T> {
  constructor(
    public readonly list: T[]
  ) { }
}

/**
 * 结构体的定义
 * 如果belong为空,则是自定义类型
 * 否则就得依每一个去自定义
 */
export class Struct {
  constructor(
    readonly fields: ReadMap<string, AllMayType>
  ) { }
}

export type AllMayType = VarType
  | Union<AllMayType>
  | Fun<AllMayType>
  | Struct
  | string
  | number
  | Any<"any">
  | Any<"string">
  | Any<"number">
  | undefined


/**
 * a 包含 b
 * @param a 
 * @param b 
 * @returns 
 */
export function include(a: AllMayType, b: AllMayType): boolean {
  if (b == a) {
    //如果VarType,number,string去去除b,VarType是必须归属的
    return true
  }

  if (b instanceof VarType) {
    return include(a, b.belong)
  }

  if (b instanceof Union) {
    return b.list.every(v => include(a, v))
  }


  if (a instanceof Any) {
    if (a.flag == 'any') {
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
      return include(a.arg, b.arg) && include(b.out, a.out)
    }
    return false
  }

  if (a instanceof Struct) {
    if (b instanceof Struct) {
      for (const [key, value] of b.fields) {
        const pField = a.fields.get(key)
        if (!include(pField, value)) {
          return false
        }
      }
      return true
    }
    return false
  }

  return false
}