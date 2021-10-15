import { cascadingStyle, dom, domText, StyleBuilder } from "mve-dom";
import { DragResizePanelParam } from "../form";
import { mve } from 'mve-core/util'
import marked from 'marked'
import { codeJar } from "../../codeJar";
import { currentPrismStyle, highlightElement, prismStyle } from "../../prismHelper";


const markedType={
	parse:{
		name:"渲染",
		type:"div",
		attr:{},
		hightlight(el:HTMLDivElement){
			el.querySelectorAll('pre code').forEach(function(el){
				highlightElement(el)
			})
		},
		render(v:string){
			return marked(v)
		}
	},
	lexed:{
		name:"语法树",
		type:"pre",
		attr:{
			class:"language-json"
		},
		hightlight(el:HTMLPreElement){
			highlightElement(el)
		},
		render(v:string){
			return JSON.stringify(marked.lexer(v),null,2)
		}
	}
}
export function marked示例(x:DragResizePanelParam){
	const saveContent=mve.atomValueOf('')
	const partOverFlex:StyleBuilder=function(v){
		v.height=x.contentHeight()-30 - 10 +'px'
		v.width=x.contentWidth() / 2 - 10 + 'px'
		v.display='flex'
		return v
	}
	
	const selectKey=mve.valueOf<keyof typeof markedType>("parse")
	return dom({
		type:"div",
		style:{
			width(){
				return x.contentWidth()+'px'
			},
			height(){
				return x.contentHeight()+'px'
			},
			display:"flex"
		},
		children:[
			dom({
				type:"div",
				style:{
					flex:1,
					padding:"5px"
				},
				children:[
					dom({
						type:"div",
						children:[
							domText({
								text:"切换风格"
							}),
							dom({
								type:"select",
								attr:{
									placeholder:"default"
								},
								value:currentPrismStyle,
								children:prismStyle.map(v=>dom({
									type:"option",
									text:v,
									value:v
								})),
								event:{
									change(e){
										currentPrismStyle(e.target.value)
									}
								}
						})
					]
				}),
				dom({
					type:"div",
					style:cascadingStyle(partOverFlex),
					children:[
						codeJar({
							content:`
# Marked in Node.js

Rendered by **marked**.

\`\`\`js
var a=98
function b(){
}
\`\`\`



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
								cls:"language-markdown"
							}
						})
					]
				})
			]
		}),
		dom({
				type:"div",
				style:{
					flex:1,
					padding:"5px"
				},
				children:[
					dom({
						type:"div",
						children:Object.entries(markedType).map(([k,v])=>dom({
							type:"button",
							text:v.name,
							attr:{
								disabled(){
									return selectKey()==k?true:undefined
							}
						},
						event:{
							click(){
								selectKey(k as any)
							}
							}
						}))
					}),
					dom({
						type:"div",
						style:cascadingStyle(partOverFlex),
						children:
						Object.entries(markedType).map(([k,v])=>{
							let el:any
							return dom({
								type:v.type,
								init(e){
									el=e
									v.hightlight(el)
								},
								attr:v.attr,
								prop:{
								innerHTML:mve.delaySetAfter(function(){
									return v.render(saveContent())
								},function(h,set){
									set(h)
									if(el){
										v.hightlight(el)
									}
								})
							},
							style:cascadingStyle(function(v){
								v.display=k==selectKey()?'':'none'
								v.flex=1
								v.overflow='auto'
								return v
							}),
						})
					})
				})
			]
		})
		]
	})
}