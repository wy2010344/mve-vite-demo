import { KVPair } from "wy-helper";
import { ExpDefine, TypeExp as fromTypeExp } from "./typeEqual";
import { List, pair } from "wy-helper/kanren";
import { freshen } from "./readBack";



type TypeExp = fromTypeExp | {
  meta: 'Nat'
} | {
  meta: "->"
  from: TypeExp,
  to: TypeExp
} | {
  meta: "zero"
} | {
  meta: "add1"
  value: TypeExp
} | {
  meta: "lambda"
  arg: string
  body: TypeExp
}
class CLOS {
  constructor(
    readonly env: Context,
    readonly arg: string,
    readonly body: ExpDefine
  ) { }
}


class ZERO {
  private constructor() { }
  static instance = new ZERO()
}

class ADD1 {
  constructor(
    readonly pred: ExpValue
  ) { }
}

class NEU {
  constructor(
    readonly type: TypeExp,
    readonly neu: ExpValue
  ) { }
}

/**变量 */
class NVar {
  constructor(
    readonly name: string
  ) { }
}

/**函数调用 */
class NAp {
  constructor(
    readonly fun: ExpValue,
    readonly arg: ExpValue
  ) { }
}


class NRec {
  constructor(
    readonly type: TypeExp,
    readonly target: ExpValue,
    readonly base: ExpValue,
    readonly step: ExpValue
  ) { }
}

/**
 * 类型与值的双向绑定
 */
class THE {
  constructor(
    readonly type: TypeExp,
    readonly value: ExpValue
  ) { }
}


function isNorm(v: any) {
  return v instanceof THE
}


class LambdaType {
  constructor(
    readonly from: ExpValue,
    readonly to: ExpValue
  ) { }
}


type ExpValue = ZERO | ADD1 | NEU | NRec | LambdaType


type Context = KVPair<ExpValue>
/**
 * 求值
 * @param p 
 * @param e 
 */
function val(p: Context, e: ExpDefine): ExpValue {
  if (e.meta == 'the') {
    return val(p, e.exp)
  } else if (e.meta == 'zero') {
    return ZERO.instance
  } else if (e.meta == 'add1') {
    return new ADD1(
      val(p, e.value)
    )
  } else if (e.meta == 'var') {
    return p.get(e.value)?.value!
  } else if (e.meta == 'lambda') {
    return new CLOS(
      p,
      e.arg,
      e.body
    )
  } else if (e.meta == 'rec') {
    return doRec(
      e.type,
      val(p, e.target),
      val(p, e.base),
      val(p, e.step)
    )
  } else if (e.meta == 'call') {
    return doAp(
      val(p, e.fun),
      val(p, e.arg)
    )
  }
}

function doAp(fun: ExpValue, arg: ExpValue): ExpValue {
  if (fun instanceof CLOS) {
    return val(
      new KVPair(
        fun.arg,
        arg,
        fun.env
      ),
      fun.body
    )
  }
  if (fun instanceof NEU) {
    if (fun.type.meta == '->') {
      const A = fun.type.from
      const B = fun.type.to
      const ne = fun.neu
      return new NEU(
        B,
        new NAp(
          ne,
          new THE(
            A,
            arg
          )
        )
      )
    }
  }
}

function doRec(type: TypeExp, target: ExpValue, base: ExpValue, step: ExpValue) {
  if (target instanceof ZERO) {
    return base
  } else if (type instanceof ADD1) {
    return doAp(
      doAp(step, type.pred),
      doRec(type, type.pred, base, step)
    )
  } else if (type instanceof NEU) {
    if (type.meta == 'Nat') {
      const neu = type.neu
      return new NEU(
        type,
        new NRec(
          type,
          neu,
          new THE(type, base),
          new THE(
            {
              meta: "->",
              from: {
                meta: "Nat"
              },
              to: {
                meta: "->",
                from: type,
                to: type
              }
            },
            step
          )
        )
      )
    }
  }
}


function readBack(usedNames: List<string>, type: TypeExp, value: ExpValue): TypeExp {
  if (type.meta == 'Nat') {
    if (value instanceof ZERO) {
      return {
        meta: "zero"
      }
    } else if (value instanceof ADD1) {
      return {
        meta: "add1",
        value: readBack(usedNames, {
          meta: "Nat"
        }, value.pred)
      }
    } else if (value instanceof NEU) {
      return readBackNeutral(usedNames, value.neu)
    }
  } else if (type.meta == '->') {
    const A = type.from
    const B = type.to
    const x = freshen(usedNames, 'x')
    return {
      meta: "lambda",
      arg: x,
      body: readBack(
        pair(x, usedNames),
        B,
        doAp(value, new NEU(A, new NVar(x)))
      )
    }
  }
}

function readBackNeutral(usedNames: List<string>, ne: ExpValue): TypeExp {
  if (ne instanceof NVar) {
    return {
      meta: "var",
      value: ne.name
    }
  } else if (ne instanceof NAp) {
    if (ne.arg instanceof THE) {
      return {
        meta: "call",
        fun: readBackNeutral(usedNames, ne.fun),
        arg: readBack(usedNames, ne.arg.type, ne.arg.value)
      }
    }
  } else if (ne instanceof NRec) {
    return {
      meta: "rec",
      type: ne.type,
      target: readBackNeutral(usedNames, ne.target),
      base: readBack(usedNames,)
    }
  }
}