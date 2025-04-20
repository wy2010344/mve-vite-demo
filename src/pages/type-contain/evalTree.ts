import { KVPair } from "wy-helper";
import { EndNode, InfixEndNode, NNode, InfixNode } from "./parse";
import { AllMayType, allMayTypeToString, Any, Fun, include, Scope, toIntersect, toUnion } from "./define";
import { KPair, pair } from "wy-helper/kanren";



function errorFor(node: EndNode, message: string, noMessage: boolean) {
  if (noMessage) {
    throw message
  }
  node.messages.push({
    type: 'error',
    value: message
  })
}

function evalApply(
  valueNode: EndNode,
  funNode: EndNode,
  scope: Scope,
  noMessage: boolean
): [AllMayType, Scope] {
  //执行函数
  const [value] = evalOneExp(valueNode, scope, noMessage)
  const [fun] = evalOneExp(funNode, scope, noMessage)
  // console.log("left", value, fun)
  if (!(fun instanceof Fun)) {
    errorFor(funNode, '不是函数类型', noMessage)
    return [Any.empty, scope]
  }
  if (!include(fun.arg, value)) {
    errorFor(valueNode, '不是子集', noMessage)
    return [Any.empty, scope]
  }
  try {
    return [fun.apply(value), scope]
  } catch (err) {
    errorFor(valueNode, err + '', noMessage)
    return [Any.empty, scope]
  }
}
/**
 * 表达式,包括(a=bb,xd=dd,sss)这种格式
 * @param n 
 * @param scope 
 * @returns 
 */
export function evalOneExp(n: EndNode, scope: Scope, noMessage: boolean): [AllMayType, Scope] {

  if (n.type == 'infix') {
    const infixValue = n.infix.value
    if (infixValue == '+') {
      const [left] = evalOneExp(n.left, scope, noMessage)
      const [right] = evalOneExp(n.right, scope, noMessage)
      return [pair<AllMayType, AllMayType>(left, right), scope]
    } else if (infixValue == ':') {
      const left = n.left
      if (left.type != 'symbol' && left.type != 'string') {
        errorFor(left, '目前只支持symobl与string类型', noMessage)
        return [Any.empty, scope]
      }
      const key = left.value
      const [right] = evalOneExp(n.right, scope, noMessage)
      return [new KVPair<AllMayType>(key, right), scope]
    } else if (infixValue == '|') {
      const [left] = evalOneExp(n.left, scope, noMessage)
      const [right] = evalOneExp(n.right, scope, noMessage)
      return [toUnion(left, right), scope]
    } else if (infixValue == '&') {
      const [left] = evalOneExp(n.left, scope, noMessage)
      const [right] = evalOneExp(n.right, scope, noMessage)
      return [toIntersect(left, right), scope]
    } else if (infixValue == '=') {
      const left = n.left
      if (left.type == 'symbol') {
        const key = left.value
        const [value] = evalOneExp(n.right, scope, noMessage)
        if (!noMessage) {
          left.messages.push({
            type: "type",
            value: allMayTypeToString(value)
          })
        }
        return [
          Any.empty,
          new KVPair(key, value, scope)
        ]
      } else {
        errorFor(left, `不支持这种值的绑定`, noMessage)
        return [Any.empty, scope]
      }
    } else if (infixValue == ',') {
      const [value, scope1] = evalOneExp(n.left, scope, noMessage)
      return evalOneExp(n.right, scope1, noMessage)
    } else if (infixValue == '=>') {
      //返回一个函数,函数有类型定义,
      const head = n.left
      if (head.type == 'infix' && head.infix.value == '=') {
        const headKey = head.left
        if (headKey.type != 'symbol') {
          errorFor(headKey, "目前只支持函数类型", noMessage)
          return [Any.empty, scope]
        }
        // console.log("exp", headKey.value)
        const [headValue] = evalOneExp(head.right, scope, noMessage)
        const newScope = new KVPair(headKey.value, headValue, scope)
        const [bodyValue] = evalOneExp(n.right, newScope, noMessage)
        return [new Fun(headValue, bodyValue, function (arg) {
          const nScope = new KVPair(headKey.value, arg, scope)
          //这里多次调用,其实不应该校验
          return evalOneExp(n.right, nScope, true)[0]
        }), scope]
      } else {
        errorFor(head, '函数头需要是绑定类型', noMessage)
        return [Any.empty, scope]
      }
    } else if (infixValue == '->') {
      return evalApply(n.left, n.right, scope, noMessage)
    } else if (infixValue == '<-') {
      return evalApply(n.right, n.left, scope, noMessage)
    } else {
      //单表达式,与=不处理
      errorFor(n, `无法处理的中缀${infixValue}`, noMessage)
      return [Any.empty, scope]
    }
  } else if (n.type == 'string') {
    return [n.value, scope]
  } else if (n.type == 'number') {
    return [n.value, scope]
  } else {
    const ta = scope?.get(n.value)
    if (ta) {
      if (!noMessage) {
        n.messages.push({
          type: "type",
          value: allMayTypeToString(ta.value)
        })
      }
      return [ta.value, scope]
    } else {
      errorFor(n, "未找到任何定义", noMessage)
    }
  }
  return [Any.empty, scope]
}