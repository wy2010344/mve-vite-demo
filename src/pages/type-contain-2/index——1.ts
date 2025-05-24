/**
 * 从chat gpt学习
 */

import { KVPair } from "wy-helper"



type Term =
  | { tag: "Var", name: string }
  | { tag: "Type" }
  | { tag: "Lambda", param: string, paramType: Term, body: Term }
  | { tag: "App", fn: Term, arg: Term }
  | { tag: "Pi", param: string, paramType: Term, returnType: Term }
  | { tag: "NatLit", value: number }
  | { tag: "BoolLit", value: boolean }
  | { tag: "If", cond: Term, thenBranch: Term, elseBranch: Term }


type Context = KVPair<Term>

const Var = (name: string): Term => ({ tag: "Var", name });
const Type: Term = { tag: "Type" };
const Lambda = (x: string, t: Term, body: Term): Term => ({ tag: "Lambda", param: x, paramType: t, body });
const App = (f: Term, x: Term): Term => ({ tag: "App", fn: f, arg: x });
const Pi = (x: string, t: Term, ret: Term): Term => ({ tag: "Pi", param: x, paramType: t, returnType: ret });
const NatLit = (value: number): Term => ({ tag: "NatLit", value });
const BoolLit = (value: boolean): Term => ({ tag: "BoolLit", value });
const If = (cond: Term, t: Term, f: Term): Term =>
  ({ tag: "If", cond, thenBranch: t, elseBranch: f });

const Nat = Var("Nat")
const Bool = Var("Bool")
function typeOf(ctx: Context, term: Term): Term {
  switch (term.tag) {
    case 'Var':
      const df = ctx.get(term.name)
      if (df)
        return df.value
      throw new Error(`未绑定变量:${term.name}`)
    case "Type":
      //不处理Type:Kind的问题
      return Type
    case "Lambda":
      const newCtx = new KVPair(term.param, term.paramType, ctx)
      const bodyType = typeOf(newCtx, term.body)
      return Pi(term.param, term.paramType, bodyType)
    case "Pi":
      const newCtx2 = new KVPair(term.param, term.paramType, ctx)
      const returnType = typeOf(newCtx2, term.returnType)
      return Type
    case "App":
      const fnType = typeOf(ctx, term.fn)
      if (fnType.tag != "Pi")
        throw new Error(`非函数无法执行`)
      const argType = typeOf(ctx, term.arg)
      if (!equal(fnType.paramType, argType))
        //简单比较类型相等,不考虑归一化问题
        throw new Error(`函数类型不匹配`)
      /**替换param为arg到returnType中 */
      return substitute(fnType.returnType, fnType.param, term.arg)
    case "NatLit":
      return Nat;
    case "BoolLit":
      return Bool
    case "If":
      const condType = typeOf(ctx, term.cond)
      if (!equal(condType, Bool))
        throw new Error(`条件必须是布尔类型`)
      const thenType = typeOf(ctx, term.thenBranch)
      const elseType = typeOf(ctx, term.elseBranch)
      if (!equal(thenType, elseType))
        throw new Error(`条件分支必须具有相同类型`)
      return thenType
  }
}

/**
 * 替换
 * @param term 
 * @param name 
 * @param replacement 
 * @returns 
 */
function substitute(term: Term, name: string, replacement: Term): Term {
  switch (term.tag) {
    case "Var":
      return term.name == name ? replacement : term
    case "Type":
      return term
    case "Lambda":
      return {
        tag: "Lambda",
        param: term.param,
        paramType: substitute(term.paramType, name, replacement),
        body: term.param == name ? term.body : substitute(term.body, name, replacement)
      }
    case "App":
      return {
        tag: "App",
        fn: substitute(term.fn, name, replacement),
        arg: substitute(term.arg, name, replacement)
      }
    case "Pi":
      return {
        tag: "Pi",
        param: term.param,
        paramType: substitute(term.paramType, name, replacement),
        returnType: term.param == name ? term.returnType : substitute(term.returnType, name, replacement)
      }
    default:
      return term
  }
}

function equal(a: Term, b: Term) {
  return JSON.stringify(a) === JSON.stringify(b)
}


/**
 * 归一化,求值?
 * normalization
 * @param term 
 */
function normalize(term: Term): Term {
  switch (term.tag) {
    case 'App':
      const fnNorm = normalize(term.fn)
      const argNorm = normalize(term.arg)
      if (fnNorm.tag == 'App' && fnNorm.fn.tag == 'Var' && fnNorm.fn.name == 'Add') {
        const left = fnNorm.arg
        const right = argNorm
        if (left.tag == "NatLit" && right.tag == "NatLit") {
          return NatLit(left.value + right.value)
        }
      }
      if (fnNorm.tag == "Lambda") {
        return normalize(substitute(fnNorm.body, fnNorm.param, argNorm))
      }
      return {
        tag: "App",
        fn: fnNorm,
        arg: argNorm
      }
    case "Lambda":
      return {
        tag: "Lambda",
        param: term.param,
        paramType: term.paramType,
        body: normalize(term.body)
      }
    case "Pi":
      return {
        tag: "Pi",
        param: term.param,
        paramType: normalize(term.paramType),
        returnType: normalize(term.returnType)
      }
    case "If":
      const cond = normalize(term.cond)
      if (cond.tag == 'BoolLit')
        return normalize(cond.value ? term.thenBranch : term.elseBranch)
      return {
        ...term,
        cond
      }
    default:
      return term
  }
}

const a = Var("a")
const n = Var("n")
const Vector = Pi("n", Nat, Pi("a", Type, Type))

const globalCtx = KVPair.fromObject({
  Bool: Type,
  Nat: Type,
  Add: Pi("n", Nat, Pi("m", Nat, Nat))
})

const add23 = App(App(Var("Add"), NatLit(2)), NatLit(3))
console.log(typeOf(globalCtx, add23))
console.log(normalize(add23))


