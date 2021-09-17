import { EOParseResult } from "mve-core/util"
import { dom } from "mve-dom"
import { add } from "./simpleAdd"
import { simpleTodo } from "./simpleTodo"
import { todo } from "./todo"
import { tree } from "./tree"

export type Acts={
	[key:string]:{
		title:string
		render():EOParseResult<Node>
	}
}

export function listActs(){
	return dom({
		type:"ul",
		children:Object.keys(acts).map(url=>{
			const v=acts[url]
			return dom({
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
								location.hash="#"+url
							}
						}
					})
				]
			})
		})
	})
}

export const acts:Acts={
	index:{
		title:"首页",
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
	simpleAdd:{
		title:"简单的加法",
		render(){
			return dom.root(function(me){
				return {
					type:"div",
					children:add(me)
				}
			})
		}
	},
	simpleTodo:{
		title:"简单的Todo",
		render(){
			return dom.root(function(me){
				return {
					type:"div",
					children:simpleTodo(me)
				}
			})
		}
	},
  todo:{
    title:"todo",
    render(){
			return dom.root(function(me){
				return {
					type:"div",
					children:todo(me)
				}
			})
		}
  },
  tree:{
    title:"tree",
    render(){
			return dom.root(function(me){
				return {
					type:"div",
					children:tree(me)
				}
			})
		}
  }
}