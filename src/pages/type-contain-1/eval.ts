import { KVPair } from "wy-helper";
import { EndNode } from "./parse";
import { n } from "../../hookThreeView";
import { symbol } from "d3";
import { List, pair } from "wy-helper/kanren";
import { CLOS, NAp, Scope, Value } from "./model";
import { norm } from "./readBack";




function evalCall(
  fun: EndNode,
  arg: EndNode,
  scope: Scope,
  noMessage: boolean
): Value {
  const fun1 = evalOneExp(fun, scope, noMessage)
  const arg1 = evalOneExp(arg, scope, noMessage)
  if (fun1 instanceof CLOS) {
    return evalOneExp(
      fun1.body,
      new KVPair(
        fun1.arg,
        arg1,
        scope
      ),
      noMessage
    )
  } else {
    return new NAp(fun1, arg1)
    errorFor(fun, '不是函数类型', noMessage)
  }
}
export function evalOneExp(exp: EndNode, scope: Scope, noMessage: boolean): Value {
  if (exp.type == 'infix') {
    const infixValue = exp.infix.value
    if (infixValue == ',') {
      const left = exp.left
      if (left.type == 'infix' && left.infix.value == '=') {
        const leftKey = left.left
        if (leftKey.type == 'ref') {
          const value = evalOneExp(left.right, scope, noMessage)
          return evalOneExp(exp.right, new KVPair(
            leftKey.value,
            value,
            scope
          ), noMessage)
        } else {
          errorFor(left, `等号左边需要是ref`, noMessage)
        }
      } else {
        const value = norm(scope, exp, noMessage) //evalOneExp(left, scope, noMessage)
        console.log("求值", value)
        return evalOneExp(exp.right, scope, noMessage)
      }
    } else if (infixValue == '=>') {
      //函数定义
      const left = exp.left
      if (left.type == 'ref') {
        return new CLOS(scope, left.value, exp.right)
      } else {
        errorFor(exp, `函数定义左边只能是ref`, noMessage)
      }
    } else if (infixValue == '->') {
      return evalCall(exp.right, exp.left, scope, noMessage)
    } else if (infixValue == '<-') {
      return evalCall(exp.left, exp.right, scope, noMessage)
    } else {
      errorFor(exp, `未知中缀 ${infixValue}`, noMessage)
    }
  } else {
    if (exp.type == 'ref') {
      const ta = scope?.get(exp.value)
      if (ta) {
        if (!noMessage) {
        }
        return ta.value
      } else {
        errorFor(exp, `未知变量${exp.value}`, noMessage)
      }
    } else if (exp.type == 'symbol') {
      return Symbol(exp.value)
    } else {
      return exp.value
    }
  }
}

function errorFor(node: EndNode, message: string, noMessage: boolean) {
  if (noMessage) {
    throw message
  }
  node.messages.push({
    type: 'error',
    value: message
  })
}

