
/**
 * 
 * http://augustss.blogspot.com/2007/10/simpler-easier-in-recent-paper-simply.html
 */

import { kvPair, KVPair } from "wy-helper"
import { List, pair } from "wy-helper/kanren"


type Sym = string

type Expr = {
  meta: "Var"
  value: Sym
} | {
  meta: "App"
  fn: Type
  arg: Expr
} | {
  meta: "Lam"
  id: Sym
  idType: Type
  body: Expr
} | {
  meta: "Pi"
  id: Sym
  idType: Type
  body: Expr
} | {
  meta: "Kind"
  type: Kinds
}
type Type = Expr

enum Kinds {
  Star,
  Box
}


function setOne<T>(a: T) {
  const s = new Set<T>()
  s.add(a)
  return s
}
const emptySet = new Set<any>()
/**
 * 找出所有自由变量?
 * @param expr 
 */
function freeVars(expr: Expr): Set<Sym> {
  if (expr.meta == 'Var') {
    return setOne(expr.value)
  }
  if (expr.meta == 'App') {
    return freeVars(expr.fn).union(freeVars(expr.arg))
  }
  if (expr.meta == 'Lam' || expr.meta == 'Pi') {
    return freeVars(expr.idType).union(freeVars(expr.body).difference(setOne(expr.id)))
  }
  return emptySet
}

/**
 * 将x代入为v,化简表达式
 * @param v 变量名
 * @param x 变量代表的表达式
 * @returns 
 */
function subst(v: Sym, x: Expr) {
  /**
   * 
   * @param m 函数体
   * @returns 
   */
  function sub(m: Expr): Expr {
    if (m.meta == 'Var') {
      return m.value == v ? x : m
    }
    if (m.meta == 'App') {
      return {
        meta: "App",
        fn: sub(m.fn),
        arg: sub(m.arg)
      }
    }
    if (m.meta == 'Lam') {
      return abstr((id, idType, body) => {
        return {
          meta: "Lam",
          id,
          idType,
          body
        }
      }, m.id, m.idType, m.body)
    }
    if (m.meta == 'Pi') {
      return abstr((i, t, e) => {
        return {
          meta: "Pi",
          id: i,
          idType: t,
          body: e
        }
      }, m.id, m.idType, m.body)
    }
    return m
  }

  /**代入参数中的自由变量 */
  const fvx = freeVars(x)


  function cloneSym(e: Expr, i: Sym) {
    const vars = fvx.union(freeVars(e))
    while (true) {
      if (vars.has(i)) {
        i = i + '*'
      } else {
        return i
      }
    }
  }

  function abstr(
    con: (id: Sym, idType: Expr, body: Expr) => Expr,
    id: Sym,
    idType: Expr,
    body: Expr): Expr {
    if (v == id) {
      return con(id, sub(idType), body)
    }
    if (fvx.has(id)) {
      const id_ = cloneSym(body, id)
      const body_ = substVar(id, id_, body)
      return con(id_, sub(idType), sub(body_))
    }
    return con(id, sub(idType), sub(body))
  }
  return sub
}
/**
 * 将e中的s替换成s_
 * @param s 
 * @param s_ 
 * @param e 
 * @returns 
 */
function substVar(s: Sym, s_: Sym, e: Expr) {
  return subst(s, {
    meta: "Var",
    value: s_
  })(e)
}

/**
 * 归约到正常形式
 */
function nf(ee: Expr) {
  return spine(ee, null)
}
/**
 * 对应于App
 * @param ee 函数
 * @param args 累积的参数 
 * @returns 
 */
function spine(ee: Expr, args: List<Expr>): Expr {
  if (ee.meta == 'App') {
    return spine(ee.fn, pair(ee.arg, args))
  }
  if (ee.meta == 'Lam') {
    if (args) {
      return spine(
        subst(ee.id, args.left)(ee.body),
        args.right)
    } else {
      return {
        meta: "Lam",
        id: ee.id,
        idType: nf(ee.idType),
        body: nf(ee.body)
      }
    }
  }
  if (ee.meta == "Pi") {
    return app({
      meta: "Pi",
      id: ee.id,
      idType: nf(ee.idType),
      body: nf(ee.body)
    }, args)
  }
  return app(ee, args)
}
function app(f: Expr, as: List<Expr>): Expr {
  let r = f
  while (as) {
    r = {
      meta: "App",
      fn: r,
      arg: nf(as.left)
    }
    as = as.right
  }
  return r
}

type Env = KVPair<Type>


function tCheckRed(r: Env, f: Expr) {
  const expr = tCheck(r, f)
  return nf(expr)
}
function tCheck(env: Env, expr: Expr): Expr {
  if (expr.meta == 'Var') {
    return findVar(env, expr.value)
  }
  if (expr.meta == 'App') {
    const tf = tCheckRed(env, expr.fn)
    if (tf?.meta == 'Pi') {
      const ta = tCheck(env, expr.arg)
      if (betaEq(ta, tf.idType)) {
        throw new Error(`在执行中,不是合法的函数类型`)
      }
      return subst(tf.id, expr.arg)(tf.body)
    }
    throw new Error(`在执行中,不是函数类型`)
  }
  if (expr.meta == 'Lam') {
    /**
     * 函数的类型是PI类型
     * 
     */
    tCheck(env, expr.idType)
    const r_ = kvPair(expr.id, expr.idType, env)
    const te = tCheck(r_, expr.body)
    const lt: Expr = {
      meta: "Pi",
      id: expr.id,
      idType: expr.idType,
      body: te
    }
    tCheck(env, lt)
    return lt
  }

  if (expr.meta == 'Kind') {
    if (expr.type == Kinds.Star) {
      return kindBox
    }
    throw new Error(`寻找到一个Box`)
  }

  if (expr.meta == 'Pi') {
    /**
     * PI类型的类型是返回的类型
     */
    const s = tCheckRed(env, expr.idType)
    const r_ = kvPair(expr.id, expr.idType, env)
    const t = tCheckRed(r_, expr.body)
    if (allowedKinds.includes(s) && allowedKinds.includes(t)) {
      return t
    }
    throw new Error(`不合法的归约`)
  }
  throw new Error()
}

const kindBox: Expr = {
  meta: "Kind",
  type: Kinds.Box
}
const kindStar: Expr = {
  meta: "Kind",
  type: Kinds.Star
}
const allowedKinds: Expr[] = [kindBox, kindStar]

function findVar(env: Env, value: string) {
  const n = env?.get(value)
  if (n) {
    return n.value
  }
  throw new Error(`不能找到变量定义${value}`)
}



function betaEq(e1: Expr, e2: Expr) {
  return alphaEq(nf(e1), nf(e2))
}

function alphaEq(e1: Expr, e2: Expr): boolean {
  if (e1.meta == 'Var' && e2.meta == 'Var') {
    return e1.value == e2.value
  }
  if (e1.meta == 'App' && e2.meta == 'App') {
    return alphaEq(e1.fn, e2.fn) && alphaEq(e1.arg, e2.arg)
  }
  if (e1.meta == 'Lam' && e2.meta == "Lam") {
    return alphaEq(e1.body, substVar(e2.id, e1.id, e2.body))
  }
  return false
}