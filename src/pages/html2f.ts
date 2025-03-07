import { fdom, renderText, renderTextContent } from "mve-dom";
import { toastError } from "../toast";
import { AllXmlNode, manyMatch, matchCharNotIn, orRuleGet, Que, ruleGet, ruleGetString, ruleStrBetweenGet, toXmlNodes, whiteList, whiteSpaceMatch } from "wy-helper/tokenParser";
import { createSignal, } from "wy-helper";
import { generateParseXml } from 'wy-helper/tokenParser'
import { isSVG } from "wy-dom-helper";

const nots = whiteList.concat('=/>'.split('').map(v => v.charCodeAt(0)))
const parseKey = ruleGet(manyMatch(matchCharNotIn(...nots), 1), ruleGetString)
const parseValue = orRuleGet(
  [
    ruleStrBetweenGet('"'.charCodeAt(0)),
    ruleStrBetweenGet('{'.charCodeAt(0), '}'.charCodeAt(0))
  ]
)
const parseXML = generateParseXml(
  parseKey,
  parseKey,
  parseValue
)
export default function () {
  const output = createSignal('')
  fdom.button({
    className: 'daisy-btn daisy-btn-primary',
    childrenType: 'text',
    children: '读取剪切版',
    async onClick() {
      const text = await navigator.clipboard.readText()
      if (!text) {
        toastError('没读取到文字')
        return
      }
      try {
        let nodes = toXmlNodes(text, parseXML)
        nodes = prettyNodes(nodes)
        console.log("node", nodes)
        const outText = allXmlNodesToF(nodes)
        console.log("nodes", outText)
        output.set(outText)
        navigator.clipboard.writeText(outText)
      } catch (err) {
        toastError(`解析xml失败:${err}`)
      }
    }
  })

  fdom.div({
    className: 'daisy-mockup-code w-full',
    children() {
      fdom.pre({
        children() {
          fdom.code({
            childrenType: 'text',
            children: output.get
          })
        }
      })
    }
  })
}

function prettyNode(node: AllXmlNode): AllXmlNode {
  if (typeof node == 'string') {
    return node
  } else {
    return {
      ...node,
      children: prettyNodes(node.children)
    }
  }
}

function prettyNodes(nodes: AllXmlNode[]) {
  return nodes.filter(x => {
    if (typeof x == 'string') {
      return x.trim()
    }
    return true
  }).map(prettyNode)
}

function allXmlNodesToF(nodes: AllXmlNode[]) {
  return nodes.map(allXmlNodeToF).join('\n')
}

const ARIA_PREFIX = 'aria-'
const DATA_PREFIX = 'data-'
function allXmlNodeToF(node: AllXmlNode): string {
  if (typeof node == 'string') {
    return `renderText\`${node.trim()}\``
  } else {
    const attrs: string[] = []
    for (const key in node.attrs) {
      const value = node.attrs[key]
      let aliasKey = key
      if (key.startsWith(ARIA_PREFIX)) {
        aliasKey = `aria_${key.slice(ARIA_PREFIX.length)}`
      }
      if (key.startsWith(DATA_PREFIX)) {
        aliasKey = `data_${key.slice(DATA_PREFIX.length)}`
      }
      if (key == 'class') {
        aliasKey = 'className'
      }
      if (typeof value == 'string') {
        let comma = "'"
        if (value.includes("'")) {
          comma = '`'
        }
        if (!isNaN(Number(value))) {
          comma = ''
        }
        attrs.push(`${aliasKey}:${comma}${value}${comma},`)
      } else {
        attrs.push(`${aliasKey}:${value},`)
      }
    }
    if (node.children.length) {
      let goOther = true
      if (node.children.length == 1) {
        const firstChild = node.children[0]
        if (typeof firstChild == 'string') {
          attrs.push(`childrenType:'text',`, `children:\`${firstChild}\`,`)
          goOther = false
        }
      }
      if (goOther) {
        attrs.push(`children(){
           ${allXmlNodesToF(node.children)}
        }`)
      }
    }
    return `${isSVG(node.type) ? 'fsvg' : 'fdom'}.${node.type}({
      ${attrs.join('\n')}
    })`
  }
}