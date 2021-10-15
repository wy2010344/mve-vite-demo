
import { dom } from "mve-dom/index"
import { EOChild } from 'mve-core/childrenBuilder'
import { BaseMdxAstType, HeadingDepth } from "./mdxTransFier"
import { Dom,Text,createElement, Fragment } from "mve-dom/tsxSupport"


export type MdxAstType = BaseMdxAstType<EOChild<Node>>

function isEOChild(v:MdxAstType):v is EOChild<Node>{
	return typeof(v)=='function'
}

/**
 * 这只是对文档的重定义，事实上可能是分割
 * @param out 
 * @param p 
 * @returns 
 */
export function transMdx(out:MdxAstType[],p?:{
	heading?(depth:HeadingDepth,children:JSX.Element):JSX.Element
	code?(lang:string,code:string,meta:string):JSX.Element
	paragraph?(children:JSX.Element):JSX.Element
	strong?(children:JSX.Element):JSX.Element
	text?(value:string):JSX.Element
	thematicBreak?():JSX.Element
}):JSX.Element{
	if(!out){
		return <Fragment/>
	}
	p=p||{}
	return Fragment(null,...out.map(v=>{
		if(isEOChild(v)){
			return v
		}else{
			const type=v.type
			if(type=="heading"){
				const children=transMdx(v.children,p)
				if(p.heading){
					return p.heading(v.depth,children)
				}else{
					return <Dom type={`h${v.depth}`}>{children}</Dom>
				}
			}else
			if(type=="code"){
				if(p.code){
					return p.code(v.lang,v.value,v.meta)
				}else{
					return <Dom type="code" cls={v.lang?`language-${v.lang}`:undefined} attr={{meta:v.meta}} text={v.value}/>
				}
			}else
			if(type=="paragraph"){
				const children=transMdx(v.children,p)
				if(p.paragraph){
					return p.paragraph(children)
				}else{
					return <Dom type="p" children={children}/>
				}
			}else
			if(type=="strong"){
				const children=transMdx(v.children,p)
				if(p.strong){
					return p.strong(children)
				}else{
					return <Dom type="strong" children={children}/>
				}
			}else
			if(type=="text"){
				if(p.text){
					return p.text(v.value)
				}else{
					return <Text children={v.value}/>
				}
			}else
			if(type=="list"){
				const children=transMdx(v.children,p)
				return <Dom type={v.ordered?"ol":"ul"} attr={{start:v.start}} children={children}/>
			}else
			if(type=="listItem"){
				const children=transMdx(v.children,p)
				return <Dom type="li" children={children}/>
			}else
			if(type=="thematicBreak"){
				if(p.thematicBreak){
					return p.thematicBreak()
				}else{
					return <Dom type="hr"/>
				}
			}else
			{
				console.warn("不知道类型",v)
			}
		}
	}))
}