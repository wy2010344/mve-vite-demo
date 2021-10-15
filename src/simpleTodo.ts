import { clsOf, dom } from "mve-dom/index";
import {mve} from "mve-core/util"
import {modelChildren,modelChildrenReverse} from "mve-core/modelChildren"
import {fragment } from 'mve-core/childrenBuilder'

interface List{
	content:mve.Value<string>
	complete:mve.Value<boolean>
}

const liClass=clsOf('li')

export function simpleTodo(me:mve.LifeModel){
	const list=mve.arrayModelOf<List>([
		{
			content:mve.valueOf("ddd"),
			complete:mve.valueOf(false)
		},
		{
			content:mve.valueOf("aaa"),
			complete:mve.valueOf(true)
		},
		{
			content:mve.valueOf("ccc"),
			complete:mve.valueOf(false)
		}
	])
	let input:HTMLInputElement
	return fragment({
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
				children:[
					dom({
						type:"li",
						text:"前面一条",
					}),
					listItemOf(list),
					dom({
						type:"li",
						text:"后面一条",
					}),
				]
			}),
			dom({
				type:"hr"
			}),
			dom({
				type:"h2",
				text:"测试局部反转"
			}),
			dom({
				type:"ul",
				children:[
					dom({
						type:"li",
						text:"前面一条",
					}),
					listItemReverseOf(list),
					dom({
						type:"li",
						text:"后面一条",
					}),
				]
			}),
			dom({
				type:"hr"
			}),
			dom({
				type:"h2",
				text:"测试全局反转"
			}),
			dom({
				type:"ul",
				childrenReverse:true,
				children:[
					dom({
						type:"li",
						text:"前面一条",
					}),
					listItemOf(list),
					dom({
						type:"li",
						text:"后面一条",
					})
				]
			}),
			dom({
				type:"hr"
			}),
			dom({
				type:"h2",
				text:"测试交替"
			}),
			dom({
				type:"ul",
				childrenReverse:true,
				children:[
					dom({
						type:"li",
						text:"前面一条",
					}),
					listItemOf(list),
					dom({
						type:"li",
						text:"中间一条",
					}),
					listItemReverseOf(list),
					dom({
						type:"li",
						text:"后面一条",
					}),
				]
			})
		]
	})
}

function modelChildrenRender(list:mve.ArrayModel<List>,me:mve.LifeModel,p:List,i:mve.GValue<number>){
	let checkbox:HTMLInputElement
	return dom({
		type:"li",
		cls:liClass,
		init(){
			console.log("初始化",p.content())
			return function(){
				console.log("销毁",p.content())
			}
		},
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
}
function listItemReverseOf(list:mve.ArrayModel<List>){
	return modelChildrenReverse(list,function(me,row,i){
		return modelChildrenRender(list,me,row,i)
	})
}
function listItemOf(list:mve.ArrayModel<List>){
	return modelChildren(list,function(me,p,i){
		return modelChildrenRender(list,me,p,i)
	})
}