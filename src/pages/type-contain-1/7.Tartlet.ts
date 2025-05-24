/**
‹expr› ::= ‹id›
        |  ( Π ( ( ‹id› ‹expr› ) ) ‹expr› )
        |  ( λ ( ‹id› ) ‹expr› )
        |  ( ‹expr› ‹expr› )
        |  ( Σ ( ( ‹id› ‹expr› ) ) ‹expr› )
        |  ( cons ‹expr› ‹expr› )
        |  ( car ‹expr› )
        |  ( cdr ‹expr› )
        |  ( add1 ‹expr› )
        |  ( ind-Nat ‹expr› ‹expr› ‹expr› ‹expr› )
        |  ( = ‹expr› ‹expr› ‹expr› )
        |  ( replace ‹expr› ‹expr› ‹expr› )
        |  ( ind-Absurd ‹expr› ‹expr› )
        |  ( the ‹expr› ‹expr› )
        |  ' ‹id›
        |  same
        |  Nat
        |  zero
        |  Trivial
        |  sole
        |  Absurd
        |  U
        |  Atom

expr ::= id
        | id of expr *> expr //依赖积类型
        | id => expr //Lambda
        | expr -> expr | expr <- expr //函数调用
        | id of expr +> expr //依赖和类型
        | expr : expr //cons
        | // car,cdr,在等号右边解构
        | 

 */

import { kvPair, KVPair } from "wy-helper";
import { pair } from "wy-helper/kanren";

type Id = string;
type Keyword = string;

type Expr =
  | { tag: "Var", name: Id }
  | { tag: "Pi", param: Id, domain: Expr, codomain: Expr }
  | { tag: "Sigma", param: Id, domain: Expr, codomain: Expr }
  | { tag: "Lam", param: Id, body: Expr }
  | { tag: "App", func: Expr, arg: Expr }
  | { tag: "The", typeExpr: Expr, expr: Expr }
  | { tag: "Quote", name: Id }

  | { tag: "Cons", left: Expr, right: Expr }
  | { tag: "Car", value: Expr }
  | { tag: "Cdr", value: Expr }
  | { tag: "Atom" | "Trivial" | "Sole" | "Absurd" | "U" | "Nat" | "Zero" | "Same" }


type Context = KVPair<Id>
let gensymCounter = 0;
function gensym(): Id {
  return `#g${gensymCounter++}`;
}
function alphaEquivAux(
  e1: Expr,
  e2: Expr,
  xs1: Context,
  xs2: Context
): boolean {
  if (e1.tag == 'Var' && e2.tag == "Var") {
    const x1 = xs1.get(e1.name)
    const x2 = xs2.get(e2.name)
    if (x1 && x2) {
      return x1.value == x2.value
    }
    return x1 == x2
  }
  if ((e1.tag == "Pi" && e2.tag == "Pi")
    || (e1.tag == 'Sigma' && e2.tag == "Sigma")) {
    if (!alphaEquivAux(e1.domain, e2.domain, xs1, xs2)) {
      return false
    }
    const fresh = gensym()
    return alphaEquivAux(
      e1.codomain,
      e2.codomain,
      kvPair(e1.param, fresh, xs1),
      kvPair(e2.param, fresh, xs2)
    )
  }
  if (e1.tag == 'Lam' && e2.tag == "Lam") {
    const fresh = gensym()
    return alphaEquivAux(
      e1.body,
      e2.body,
      kvPair(e1.param, fresh, xs1),
      kvPair(e2.param, fresh, xs2)
    )
  }
  if (e1.tag == 'App' && e2.tag == 'App') {
    return alphaEquivAux(e1.func, e2.func, xs1, xs2)
      && alphaEquivAux(e1.arg, e2.arg, xs1, xs2);
  }

  if (e1.tag === "The" && e2.tag === "The") {
    if (e1.typeExpr.tag === "Absurd" && e2.typeExpr.tag === "Absurd") {
      return true; // η-law for Absurd
    }
    return false;
  }

  if (e1.tag == "Quote" && e2.tag == 'Quote') {
    return e1.name == e2.name
  }

  if (e1.tag == 'Cons' && e2.tag == 'Cons') {
    return alphaEquivAux(e1.left, e2.left, xs1, xs2)
      && alphaEquivAux(e1.right, e2.right, xs1, xs2);
  }

  if (e1.tag == 'Car' && e2.tag == "Car") {
    return alphaEquivAux(e1.value, e2.value, xs1, xs2)
  }


  if (e1.tag == 'Cdr' && e2.tag == "Cdr") {
    return alphaEquivAux(e1.value, e2.value, xs1, xs2)
  }

  return e1.tag == e2.tag
}



type Environment = KVPair<any>

/**
 * 求值化简?
 * @param p 
 * @param e 
 * @returns 
 */
function val(p: Environment, e: Expr) {
  if (e.tag == 'The') {
    return val(p, e.expr)
  }
  if (e.tag == 'U') {

  }
}