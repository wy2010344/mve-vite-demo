import { EOParseResult } from "mve-core/util"
import { dom } from "mve-dom"
import { 桌面 } from "./desktop"
import { simpleAdd } from "./simpleAdd"
import { simpleTodo } from "./simpleTodo"
import { todo } from "./todo"
import { tree } from "./tree"

export type Act={
	title:string
	url:string
	render():EOParseResult<Node>
}

export function listActs(){
	return dom({
		type:"ul",
		children:acts.map(v=>dom({
			type:"li",
			children:[
				dom({
					type:"a",
					attr:{
						href:"javascript:void(0)"
					},
					text:v.title,
					event:{
						click(){
							location.hash="#"+v.url
						}
					}
				})
			]
		}))
	})
}

export const acts:Act[]=[
	{
		title:"首页",
		url:"index",
		render(){
			return dom.root(function(me){
				return {
					type:"div",
					children:[
						listActs()
					]
				}
			})
		}
	},
	{
		title:"桌面",
		url:"desktop",
		render:桌面
	},
	{
		title:"简单的加法",
		url:"simpleAdd",
		render:simpleAdd
	},
	{
		title:"简单的Todo",
		url:"simpleTodo",
		render:simpleTodo
	},
  {
    title:"todo",
    url:"todo",
    render:todo
  },
  {
    title:"tree",
    url:"tree",
    render:tree
  }
]