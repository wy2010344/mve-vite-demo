import { KVPair } from "wy-helper"
import { EndNode } from "./parse"


export class CLOS {
  constructor(
    readonly env: Scope,
    readonly arg: string,
    readonly body: EndNode
  ) { }
}

/**
 * 尚未评估的中性表达式
 */
export class NAp {
  constructor(
    readonly fun: Value,
    readonly arg: Value
  ) { }
}

export class NVar {
  constructor(
    readonly value: string
  ) { }
}
export type Value = CLOS | NAp | NVar | string | number | symbol | undefined

export type Scope = KVPair<Value> | undefined

