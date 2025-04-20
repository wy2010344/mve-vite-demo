import { BaseDisplayT, buildInfix, DisplayT, endNotFillToToken, InfixConfig, InfixToken, matchBetween, matchCommonExt, matchSymbolOrSpecial, ruleGetNumber, ruleGetString, skipWhiteOrComment, specialMatch } from "wy-helper/infixLang"
import { andMatch, isChinese, isLowerEnglish, isUpperEnglish, or, orMatch, parseGet, Que } from "wy-helper/tokenParser"
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
  value: string;
}
export interface NumberToken extends Token {
  type: "number";
  value: number;
  originalValue: string;
}

export type NNode = StringToken | SymbolToken | NumberToken;
export const symbolRule = andMatch(
  orMatch(
    isLowerEnglish.matchCharBetween(),
    isUpperEnglish.matchCharBetween(),
    isChinese.matchCharBetween(),
  ),
  matchCommonExt
)
export function ruleGetSymbol() {
  return parseGet<Que, SymbolToken>(symbolRule, function (begin, end) {
    const value = begin.content.slice(begin.i, end.i)
    return {
      type: "symbol",
      begin: begin.i,
      end: end.i,
      value,
      messages: []
    } as SymbolToken
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
  //顺序执行
  [','],
  //逆向执行
  {
    type: "rev",
    values: ['=>']
  },
  {
    type: "rev",
    values: ['=']
  },
  //顺序执行
  ['->'],
  //右边是函数,左边是值
  {
    type: "rev",
    values: ['<-']
  },
  /**
   * 可以添加扩展符号,如pair的结合,kvpair的结合,union的结合,union的析出
   */
  //pair的结合
  ['+'],
  //或与且
  ['|', '&'],
  //kvpair的结合
  {
    type: "rev",
    values: [':']
  }
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
  } else if (endNode.type == 'symbol') {
    return ({
      type: "variable",
      value: endNode.value,
      begin: endNode.begin,
      end: endNode.end,
      messages: endNode.messages
    })
  } else {
    throw new Error("unknown type")
  }
}, unsafeAdd('keyword'), unsafeAdd("white"))
/*
in子句
xxx=aaa,
bbb=ddd,
xss=ccc
in bbb


声明一个类型,属于A类型,但又是一个变量
x<A
声明一个类型,是A的上界类型
x>A


构造object
x:99,
y:ass,
dvd:ddd 


xcvd->dss
vdss->ss
*/