import { KVPair } from "wy-helper"



const Nat = {
  type: "Nat"
} as const

type TypeDefine = {
  type: "Nat"
} | {
  type: "Lambda"
  from: TypeDefine
  to: TypeDefine
}


function typeEqual(t1: TypeDefine, t2: TypeDefine): boolean {
  if (t1.type == 'Nat' && t2.type == 'Nat') {
    return true
  }
  if (t1.type == "Lambda" && t2.type == 'Lambda') {
    return typeEqual(t1.from, t2.from) && typeEqual(t1.to, t2.to)
  }
  return false
}

function isType(a: any) {
  return typeEqual(a, a)
}





export type TypeExp = {
  meta: "the"
  type: TypeDefine
  exp: ExpDefine
} | {
  meta: "rec"
  type: TypeDefine
  target: TypeExp
  base: ExpDefine,
  step: ExpDefine
} | {
  meta: "var"
  value: string
} | {
  meta: "call"
  fun: TypeExp
  arg: ExpDefine
}

/**
 * 表达式类型
 */
export type ExpDefine = {
  meta: "zero"
} | {
  meta: "add1"
  value: ExpDefine
} | {
  meta: "lambda"
  arg: string
  body: ExpDefine
} | TypeExp




class ExpError extends Error {
  constructor(
    readonly exp: ExpDefine,
    message: string
  ) {
    super(message)
  }
}

type Context = KVPair<TypeDefine>
/**
 * 合成
 * @param context 
 * @param exp 
 */
function synth(context: Context, exp: TypeExp): TypeDefine {
  if (exp.meta == 'the') {
    if (!isType(exp.type)) {
      throw new ExpError(exp, `不是一个type ${exp.type}`)
    }
    check(context, exp.exp, exp.type)
    return exp.type
  } else if (exp.meta == 'rec') {
    const targetT = synth(context, exp.target)
    if (!typeEqual(targetT, Nat)) {
      throw new ExpError(exp.target, `期望获得Nat,但得到 ${targetT}`)
    }
    check(context, exp.base, exp.type)
    check(context, exp.step, {
      type: "Lambda",
      from: Nat,
      to: {
        type: "Lambda",
        from: exp.type,
        to: exp.type
      }
    })
    return exp.type
  } else if (exp.meta == 'var') {
    const f = context.get(exp.value)
    if (f) {
      return f.value
    }
    throw new ExpError(exp, `未找到定义`)
  } else if (exp.meta = 'call') {
    const fun = synth(context, exp.fun)
    if (fun.type == 'Lambda') {
      //如果是函数类型,返回函数定义的返回类型
      check(context, exp.arg, fun.from)
      return fun.to
    } else {
      throw new ExpError(exp.fun, `不是一个函数类型 ${fun}`)
    }
  } else {
    throw new ExpError(exp, `不知道的表达式`)
  }
}

function check(context: Context, exp: ExpDefine, t: TypeDefine) {
  if (exp.meta == 'zero') {
    if (!typeEqual(t, Nat)) {
      throw new ExpError(exp, `尝试使用 ${t}去匹配0`)
    }
  } else if (exp.meta == 'add1') {
    if (typeEqual(t, Nat)) {
      check(context, exp.value, Nat)
    } else {
      throw new ExpError(exp, `尝试使用${t}去匹配add1`)
    }
  } else if (exp.meta == 'lambda') {
    if (t.type == 'Lambda') {
      check(
        new KVPair(exp.arg, t.from, context),
        exp.body,
        t.to
      )
    } else {
      throw new ExpError(exp, `期望获得Lambda类型,但获得${t}`)
    }
  } else {
    const t2 = synth(context, exp)
    if (!typeEqual(t, t2)) {
      throw new ExpError(exp, `希望类型${t}但合成类型 ${t2}`)
    }
  }
}


// function checkProgram(context:Context,prog){
  
// }