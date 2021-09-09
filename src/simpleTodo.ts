import { clsOf, dom } from "mve-dom/index";
import {mve} from "mve-core/util"
import {modelChildren} from "mve-core/modelChildren"




interface List{
	content:mve.Value<string>
	complete:mve.Value<boolean>
}

const liClass=clsOf('li')
export function simpleTodo(){
	return dom.root(function(me){
		const list=mve.arrayModelOf<List>([])
		let input:HTMLInputElement
		return {
			type:"div",
			children:[
				dom({
					type:"input",
					init(v){
						input=v
					}
				}),
				dom({
					type:"button",
					text:"添加",
					event:{
						click(){
							const v=input.value.trim()
							if(v){
								list.unshift({
									content:mve.valueOf(v),
									complete:mve.valueOf(false)
								})
								input.value=""
							}else{
								alert("请输入内容")
							}
						}
					}
				}),
				dom({
					type:"style",
					text:`
.${liClass}{
	display:flex;
	justify-content:space-between;
}
					`
				}),
				dom({
					type:"ul",
					children:modelChildren(list,function(me,p,i){
						let checkbox:HTMLInputElement
						return dom({
							type:"li",
							cls:liClass,
							children:[
								dom({
									type:"input",init(v){checkbox=v},
									attr:{
										type:"checkbox",
									},
									prop:{
										checked:p.complete
									},
									event:{
										change(e){
											p.complete(checkbox.checked)
										}
									}
								}),
								dom({
									type:"span",
									style:{
										"text-decoration"(){
											return p.complete()?"line-through":""
										}
									},
									text:p.content
								}),
								dom({
									type:"a",
									text:"x",
									attr:{
										href:"javascript:void(0)"
									},
									event:{
										click(){
											list.remove(i())
										}
									}
								})
							]
						})
					})
				})
			]
		}
	})
}