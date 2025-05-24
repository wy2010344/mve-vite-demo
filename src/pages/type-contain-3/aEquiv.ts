

import { Expr } from './expr'
import { KVPair, kvPair } from 'wy-helper'

/**
 * a 等价
 * @param a 
 * @param b 
 */
export function aEquiv(a: Expr, b: Expr) {

}

type Scope = KVPair<Symbol>

function aEquivAux(a: Expr, b: Expr, xs1: Scope, xs2: Scope): boolean {
  if (a.type == "id" && b.type == "id") {
    const m1 = xs1?.get(a.value)
    const m2 = xs2?.get(b.value)
    if (!m1 && !m2) {
      return a.value == b.value
    }
    if (m1 && m2) {
      return m1.value == m2.value
    }
    return false
  }
  if (a.type == 'λ' && b.type == 'λ') {
    const fresh = Symbol()
    const b1 = kvPair(a.id, fresh, xs1)
    const b2 = kvPair(b.id, fresh, xs2)
    return aEquivAux(a.body, b.body, b1, b2)
  }
  if (a.type == "Π" && b.type == "Π") {
    if (!aEquivAux(a.idType, b.idType, xs1, xs2)) {
      return false
    }
    const fresh = Symbol()
    const b1 = kvPair(a.id, fresh, xs1)
    const b2 = kvPair(b.id, fresh, xs2)
    return aEquivAux(a.body, b.body, b1, b2)
  }

  if (a.type == "Σ" && b.type == "Σ") {
    if (!aEquivAux(a.idType, b.idType, xs1, xs2)) {
      return false
    }
    const fresh = Symbol()
    const b1 = kvPair(a.id, fresh, xs1)
    const b2 = kvPair(b.id, fresh, xs2)
    return aEquivAux(a.body, b.body, b1, b2)
  }

  if (a.type == 'apply' && b.type == 'apply') {
    return aEquivAux(a.fn, b.fn, xs1, xs2) && aEquivAux(a.arg, b.arg, xs1, xs2)
  }
  return false
}