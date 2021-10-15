import { createMdxAstCompiler } from "@mdx-js/mdx"
import unified from "unified"
import { TreeLine } from "./treeLine"

const compiler = createMdxAstCompiler()

/**
 * mdx是需要作为模块解析的，因为有导入导出
 * 但mdx的结构需要加工。如果导出成了JSX.Element，就无法知道细节
 * mdx只有导出成为数据结构，叶子节点是JSX.Element，然后区分、自定义。
 * 因为数据结构的嵌套，最好不要再显写遍历，导出就是一个接受规则配置的函数，函数返回JSX.Element。
 * 或者后解析化
 * 
 * 第一步，先将mdx转化成某格式导出，需要JSON格式，但不是JSON，只是一种序列化
 * 
 * makrdown官网 playground https://markdown.com.cn/editor/
 * mdx官网 playground https://mdxjs.com/playground/
 * 
 * @param v 
 * @returns 
 */

export function mdxAst(v:string){
	const ast=compiler.parse(v)
	return ast
}

export interface MdxVisitOption{
	root?():JSX.Element
	code?(content:string,lang:string,meta:string):JSX.Element
}
export function mdxStringifyMve(v:string){
	const ast=mdxAst(v)
	const treeLine=TreeLine.root()
	treeLine.append('[')
	const children=ast['children']
	if(children){
		for(const child of children){
			circleVisit(child,treeLine)
		}
	}
	treeLine.append(']')
	return treeLine.toFile()
}

function circleVisit(ast:any,treeLine:TreeLine){
	const type=ast.type
	//子节点
	if(type=="mdxjsEsm"){
		//顶层 导入语句，如import { A } from '../A'
		treeLine.append(ast.value)
	}else
	if(type=="heading"){
		//顶层 h 标题
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"heading",`)
		subTree.append(`depth:${ast.depth},`)
		circleVisitChildren(ast,subTree)
		treeLine.append("},")
	}else
	if(type=="mdxFlowExpression"){
		//注释 如 {/*这是注释*/} 翻译成 /*这是注释*/ 可能在XML里不一样
		treeLine.append(ast.value)
	}else
	if(type=="code"){
		//顶层元素 code
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"code",`)
		if(ast.lang){
			subTree.append(`lang:"${ast.lang}",`)
		}
		if(ast.meta){
			subTree.append(`meta:"${ast.meta}",`)
		}
		subTree.append(`value:${JSON.stringify(ast.value)},`)
		treeLine.append("},")
	}else
	if(type=="inlineCode"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"inlineCode",`)
		subTree.append(`value:${JSON.stringify(ast.value)},`)
		treeLine.append("},")
	}else
	if(type=="paragraph"){
		//顶层 p 元素
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"paragraph",`)
		circleVisitChildren(ast,subTree)
		treeLine.append("},")
	}else
	if(type.startsWith("mdxJsx")){
		//xml元素，mve里不支持小写，先考虑全转成jsx
		circleVisitXML(ast,treeLine)
	}else
	if(type=="text"){
		//顶层文本
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"text",`)
		subTree.append(`value:${JSON.stringify(ast.value)},`)
		treeLine.append("},")
	}else
	if(type=="list"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"list",`)
		subTree.append(`ordered:${ast.ordered},`)
		subTree.append(`start:${ast.start},`)
		subTree.append(`spread:${ast.spread},`)
		circleVisitChildren(ast,subTree)
		treeLine.append("},")
	}else
	if(type=="listItem"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"listItem",`)
		subTree.append(`spread:${ast.spread},`)
		subTree.append(`checked:${ast.checked},`)
		if(ast.children && ast.children.length>0){
			const child=ast.children[0]
			if(child.type=="paragraph"){
				//需要移除
				circleVisitChildren(child,subTree)
			}
			//后面可能跟别的列表
			for(let i=1;i<ast.children.length;i++){
				circleVisitChildren(ast.children[i],subTree)
			}
		}else{
			console.warn("children不准确",ast)
		}
		treeLine.append("},")
	}else
	if(type=="strong"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"strong",`)
		circleVisitChildren(ast,subTree)
		treeLine.append("},")
	}else
	if(type=="thematicBreak"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"thematicBreak",`)
		treeLine.append("},")
	}else
	if(type=="image"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"image",`)
		if(ast.title){
			subTree.append(`title:${ast.title},`)
		}
		if(ast.url){
			subTree.append(`url:${ast.url},`)
		}
		if(ast.alt){
			subTree.append(`alt:${ast.alt},`)
		}
		treeLine.append("},")
	}else
	if(type=="link"){
		treeLine.append("{")
		const subTree=treeLine.appendChild()
		subTree.append(`type:"link",`)
		if(ast.title){
			subTree.append(`title:${ast.title},`)
		}
		if(ast.url){
			subTree.append(`url:${ast.url},`)
		}
		circleVisitChildren(ast,subTree)
		treeLine.append("},")
	}else{
		console.warn("顶层不知道类型",ast)
	}
}


function generateAttribute(attrs){
	const vs=[]
	for(const attr of attrs){
		const {name,value}=attr
		if(value){
			if(typeof(value)=='string'){
				vs.push(`${name}=${JSON.stringify(value)}`)
			}else{
				vs.push(`${name}={${value.value}}`)
			}
		}else{
			vs.push(name)
		}
	}
	return vs.join(' ')
}

function circleVisitXML(ast:any,treeLine:TreeLine){
	const type=ast.type
	if(type.startsWith("mdxJsx")){
		//复合结构
		const tagName=ast.name
		if(ast.children && ast.children.length!=0){
			treeLine.append(`<${tagName} ${generateAttribute(ast.attributes)}>`)
			const subLine=treeLine.appendChild()
			circleVisitXMLChildren(ast,subLine)
			treeLine.append(`</${tagName}>`)
		}else{
			treeLine.append(`<${tagName} ${generateAttribute(ast.attributes)}/>`)
		}
	}else
	if(type=="text"){
		//嵌入文本
		treeLine.append(ast.value)
	}else
	if(type=="mdxTextExpression"){
		//表达式
		treeLine.append(`{${ast.value}}`)
	}else
	if(type=="paragraph"){
		//这里应该允许？
		circleVisitXMLChildren(ast,treeLine)
	}else
	{
		console.warn("XML不知道类型",ast)
	}
}

function circleVisitChildren(ast:any,treeLine:TreeLine){
	if('children' in ast){
		const children=ast.children
		if(children){
			treeLine.append('children:[')
			for(const child of children){
				circleVisit(child,treeLine.appendChild())
			}
			treeLine.append('],')
		}
	}
}

function circleVisitXMLChildren(ast:any,treeLine:TreeLine){
	if('children' in ast){
		const children=ast.children
		if(children){
			for(const child of children){
				circleVisitXML(child,treeLine.appendChild())
			}
		}
	}
}
export type HeadingDepth=1|2|3|4|5|6|7
interface MDXHeading<T>{
	type:"heading"
	depth:HeadingDepth
	children: BaseMdxAstType<T>[]
}
interface MDXText{
	type:"text"
	value:string
}
interface MDXParagraph<T>{
	type:"paragraph"
	children:BaseMdxAstType<T>[]
}
interface MDXStrong<T>{
	type:"strong"
	children:BaseMdxAstType<T>[]
}
interface MDXCode{
	type:"code"
	lang?:string
	meta?:string
	value:string
}
interface MDXList<T>{ 	
	type:"list"
	ordered:boolean
	start:number | null
	spread:boolean
	children:MDXListItem<T>[]
}
interface MDXListItem<T>{
	type:"listItem"
	spread:boolean
	checked:boolean | null
	children:BaseMdxAstType<T>[]
}
interface MDXThematicBreak{
	type:"thematicBreak"
}
interface MDXInlineCode{
	type:"inlineCode"
	value:string
}
interface MDXImage{
	type:"image"
	title:string
	url:string
	alt:string
}
interface MDXLink<T>{
	type:"link"
	title?:string
	url?:string
	children:BaseSubMdxAstType<T>[]
}
/**内嵌级的元素 */
export type BaseSubMdxAstType<T>= MDXInlineCode
| MDXStrong<T>
| MDXText 
| MDXImage
| MDXLink<T>
| MDXList<T>
| T
/**顶级的元素 */
export type BaseTopMdxAstType<T>=MDXHeading<T>
| MDXParagraph<T>
| MDXCode  
| MDXThematicBreak 
| BaseSubMdxAstType<T>
export type BaseMdxAstType<T> = BaseTopMdxAstType<T> | MDXListItem<T>
