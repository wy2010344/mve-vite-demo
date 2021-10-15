import { BaseStyleMap, cascadingStyle, dom, StyleBuilder } from "mve-dom/index";
import { Dom,createElement, Fragment } from "mve-dom/tsxSupport";
import { codeJar } from "../../codeJar";
import { currentPrismStyle, highlightElement, prismStyle } from "../../prismHelper";
import { DragResizePanelParam } from "../form";
import {mve} from 'mve-core/util'
import { mdxAst, mdxStringifyMve } from "../../vite-mdx-mve-tsx-plugin/mdxTransFier";
import { fragment } from 'mve-core/childrenBuilder'

function removeAstPosition(ast){
	delete ast.position
	if('children' in ast){
		const children=ast['children']
		if(Array.isArray(children)){
			for(const child of children){
				removeAstPosition(child)
			}
		}
	}
}


export function mdx示例(x:DragResizePanelParam){
	const markedType={
		lexed:{
			name:"语法树",
			hightlight(el:HTMLPreElement){
				highlightElement(el)
			},
			parse(v:string){
				try{
					const ast=mdxAst(v)
					if(removePosition()){
						removeAstPosition(ast)
					}
					return JSON.stringify(ast,null,2)
				}catch(e){
					return e+""
				}
			},
			render(p:{
				init(e):void
				style():BaseStyleMap,
				content():string
			}){
				return dom({
					type:"pre",
					cls:"language-json",
					init:p.init,
					style:p.style,
					text:p.content
				})
			}
		},
		generate:{
			name:"自定义生成",
			hightlight(el:HTMLPreElement){
				highlightElement(el)
			},
			parse(v:string){
				try{
					const ast=mdxStringifyMve(v)
					return ast
				}catch(e){
					return e+""
				}
			},
			render(p:{
				init(e):void
				style():BaseStyleMap,
				content():string
			}){
				return dom({
					type:"pre",
					cls:"language-tsx",
					init:p.init,
					style:p.style,
					text:p.content
				})
			}
		}
	}
	
	const removePosition=mve.valueOf(true)
	const saveContent=mve.atomValueOf('')
	const partOverFlex:StyleBuilder=function(v){
		v.height=x.contentHeight()-30 - 10 +'px'
		v.width=x.contentWidth() / 2 - 10 + 'px'
		v.display='flex'
		return v
	}
	const selectKey=mve.valueOf<keyof typeof markedType>("lexed")
	return <Dom type="div" style={{
		width(){return x.contentWidth()+'px'},
		height(){return x.contentHeight()+'px'},
		display:"flex"
	}}>
		<Dom type="div" style={{flex:1,padding:'5px'}}>
			<Dom type="div">
				切换风格
				<Dom type="select" attr={{placeholder:"default"}} value={currentPrismStyle}
					event={{
						change(e){
							currentPrismStyle(e.target.value)
						}
					}}
				>
					{prismStyle.map(v=><Dom type="option">{v}</Dom>)}
				</Dom>
			</Dom>
			<Dom type="div">
					<Dom type="div" style={cascadingStyle(partOverFlex)}>
						{
							codeJar({
								content:`
# Marked in Node.js

Rendered by **marked**.

\`\`\`js
var a=98
function b(){
}
\`\`\`

{/*这是注释*/}


<Div a="9" b={34 + 9} c={{}} d> {/*45*/} afewf </Div>

`,
								highlight(e,pos){
									highlightElement(e)
									saveContent(e.innerText)
								},
								element:{
									type:"pre",
									style:{
										resize:'none',
										flex:1,
										overflow:'auto'
									},
									cls:"language-md"
								}
							})}
					</Dom>
			</Dom>
		</Dom>
		<Dom type="div" style={{flex:1,padding:'5px'}}>
				<Dom type="div">
					{fragment({
						children:Object.entries(markedType).map(([k,v])=><Dom type="button" text={v.name}
						attr={{
							disabled(){
								return selectKey()==k?true:undefined
							}
						}}
						event={{
							click(){
								selectKey(k as any)
							}
						}}
					/>)
					})}
					移除位置
					<Dom type="input" attr={{type:"checkbox"}} prop={{checked:removePosition}}
						event={{
							change(e){
								removePosition(e.target.checked)
							}
						}}
					/>
				</Dom>
				<Dom type="div" style={cascadingStyle(partOverFlex)}>
					{fragment({
						children:Object.entries(markedType).map(([k,v])=>{
							let el
							return v.render({
								init(e){
									el=e,
									v.hightlight(el)
								},
								style:cascadingStyle(function(v){
									v.display=k==selectKey()?'':'none'
									v.flex=1
									v.overflow='auto'
									return v
								}),
								content:mve.delaySetAfter(function(){
									return v.parse(saveContent())
								},function(h,set){
									set(h)
									if(el){
										v.hightlight(el)
									}
								})
							})
						})
					})}
				</Dom>
		</Dom>
	</Dom>
}