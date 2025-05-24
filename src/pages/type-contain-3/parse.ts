import { BaseDisplayT, buildInfix, endNotFillToToken, InfixConfig, InfixToken, matchBetween, matchCommonExt, matchSymbolOrSpecial, ruleGetNumber, ruleGetString, skipWhiteOrComment, specialMatch } from "wy-helper/infixLang"
import { andMatch, isChinese, isLowerEnglish, isUpperEnglish, or, orMatch, parseGet, Que, ruleStrBetweenGet1 } from "wy-helper/tokenParser"
export interface Token {
  begin: number;
  end: number;
  messages: Message[];
}
export type Message = {
  type: "error" | "type"
  value: string
}
export interface StringToken extends Token {
  type: "string";
  originalValue: string;
  value: string;
}
export interface SymbolToken extends Token {
  type: "symbol";
  originalValue: string;
  value: string;
}
export interface RefToken extends Token {
  type: "ref";
  value: string;
}
export interface NumberToken extends Token {
  type: "number";
  value: number;
  originalValue: string;
}
export function ruleGetSymbol() {
  const [value, begin, end] = ruleStrBetweenGet1("#".charCodeAt(0))
  const originalValue = begin.content.slice(begin.i, end.i)
  return {
    type: "symbol",
    value,
    originalValue,
    begin: begin.i,
    end: end.i
  } as SymbolToken
}


export type NNode = StringToken | RefToken | NumberToken | SymbolToken;
export const refRule = andMatch(
  orMatch(
    isLowerEnglish.matchCharBetween(),
    isUpperEnglish.matchCharBetween(),
    isChinese.matchCharBetween(),
  ),
  matchCommonExt
)
export function ruleGetRef() {
  return parseGet<Que, RefToken>(refRule, function (begin, end) {
    const value = begin.content.slice(begin.i, end.i)
    return {
      type: "ref",
      begin: begin.i,
      end: end.i,
      value,
      messages: []
    } as RefToken
  }, 'symbol')
}
function rGetNumber() {
  const n = ruleGetNumber() as NumberToken
  n.messages = []
  return n
}

function rGetStr() {
  const n = ruleGetString() as StringToken
  n.messages = []
  return n
}

/**
 * ,比=优先级更低,
 * 即最前面的优先级最低
 * 
 * -> pipline
 * = 绑定变量(包括函数内,参数内的绑定类型、类似于默认值)
 * => lambda化,即前面的注入作用域,用于后边
 * , 多条语句顺序执行
 * 
 * 
 * 函数似乎最好使用curry化
 * 
 * 默认,累积左边到最后
 * rev:累积右边,到最左
 * 
 * 例如:9 -> plus <- 8 -> plus <- 8
 * <-先结合,即plus<-8结合成一个函数
 * ->后结合
 * 
 * @todo 定义循环引用,定义symbol类型,即#333#
 * 
 * 数字类型其实太鸡肋...
 */
export const infixLibArray: InfixConfig[] = [
  [','],
  {
    type: "rev",
    values: ['=']
  },
  //函数定义
  {
    type: "rev",
    values: ['=>']
  },
  //顺序执行
  ['->'],
  //右边是函数,左边是值
  {
    type: "rev",
    values: ['<-']
  },
  //expr of type
  ['of'],
  //type for expr
  ['for']
]
export type InfixNode<T> = {
  type: "infix";
  infix: InfixToken;
  left: InfixEndNode<T>;
  right: InfixEndNode<T>;
  messages: Message[]
}

export type InfixEndNode<T> = T | InfixNode<T>;
export type EndNode = NNode | InfixNode<NNode>
export const { parseSentence, getInfixOrder } = buildInfix<EndNode>(infixLibArray,
  skipWhiteOrComment,
  () => {
    return or([
      rGetStr,
      ruleGetSymbol,
      ruleGetRef,
      rGetNumber,
    ])
  },
  (infix, left, right) => {
    return {
      type: "infix",
      infix,
      left,
      right,
      messages: []
    } as const
  }
)

export type DisplayT = {
  type: "white" | "keyword" | "number" | "string" | "variable" | "symbol";
} & BaseDisplayT;
type DisplayValue = DisplayT & {
  messages: Message[]
}

function unsafeAdd(k: DisplayT['type']) {
  return function (v: BaseDisplayT) {
    const n = v as DisplayValue
    n.type = k
    return n
  }
}

export const toFillToken = endNotFillToToken<EndNode, DisplayValue>(function (endNode) {
  if (endNode.type == 'string') {
    return {
      type: "string",
      value: endNode.originalValue,
      begin: endNode.begin,
      end: endNode.end,
      messages: endNode.messages
    }
  } else if (endNode.type == 'number') {
    return ({
      type: "number",
      value: endNode.originalValue,
      begin: endNode.begin,
      end: endNode.end,
      messages: endNode.messages
    })
  } else if (endNode.type == 'ref') {
    return ({
      type: "variable",
      value: endNode.value,
      begin: endNode.begin,
      end: endNode.end,
      messages: endNode.messages
    })
  } else if (endNode.type == 'symbol') {
    return {
      type: "symbol",
      value: endNode.originalValue,
      begin: endNode.begin,
      end: endNode.end,
      messages: endNode.messages
    }
  } else {
    throw new Error("unknown type")
  }
}, unsafeAdd('keyword'), unsafeAdd("white"))