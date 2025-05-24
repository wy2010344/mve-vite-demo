import { List, pair } from "wy-helper/kanren"
import { evalOneExp } from "./eval"
import { CLOS, NAp, NVar, Scope, Value } from "./model"
import { KVPair } from "wy-helper"
import { EndNode } from "./parse"

class LambdaExp {
  constructor(
    readonly arg: string,
    readonly body: ReadBackExp
  ) { }
}

class ApplyExp {
  constructor(
    readonly fun: ReadBackExp,
    readonly arg: ReadBackExp
  ) { }
}

export type ReadBackExp = string | ApplyExp | LambdaExp



function memv(list: List<string>, value: string) {
  while (list) {
    if (list.left == value) {
      return true
    }
    list = list.right
  }
  return false
}

export function freshen(usedNames: List<string>, x: string) {
  if (memv(usedNames, x)) {
    return freshen(usedNames, `${x}*`)
  }
  return x
}


export function readBack(usedNames: List<string>, v: Value): ReadBackExp {
  if (v instanceof CLOS) {
    const y = freshen(usedNames, v.arg)
    const ny = new NVar(y)
    return new LambdaExp(
      y,
      readBack(
        pair(y, usedNames),
        evalOneExp(v.body, new KVPair(v.arg, ny, v.env), true)
      )
    )
  } else if (v instanceof NVar) {
    return v.value
  } else if (v instanceof NAp) {
    return new ApplyExp(
      readBack(usedNames, v.fun),
      readBack(usedNames, v.arg))
  } else {
    throw ''
  }
}
/**
 * 规范化
 * @param scope 
 * @param exp 
 * @returns 
 */
export function norm(scope: Scope, exp: EndNode, noMessage: boolean) {
  return readBack(null, evalOneExp(exp, scope, noMessage))
}