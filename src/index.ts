import { dom, DOMNodeAll } from "mve-dom";
import { 桌面 } from "./desktop";
import { CreateSubRouter, createRouter } from "./router";
import { add } from "./simpleAdd";
import { simpleTodo } from "./simpleTodo";
import { todoMVC } from "./todo/index";
import { todo } from "./todo";
import { tree } from "./tree";



const index=createRouter(function(me,route){
	return dom({
		type:"ul",
		children:Object.keys(rootRouter).map(function(url){
			const o=rootRouter[url]
			return dom({
				type:"li",
				children:[
					dom({
						type:"a",
						attr:{
							href:"javascript:void(0)"
						},
						text:o.title,
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
})

interface RouterWithDes{
	title:string
	route:CreateSubRouter
	description:DOMNodeAll
}

export const rootRouter:{[key:string]:RouterWithDes}={
	index:{
		title:"首页",
		route:index,
		description:`
		顶层所有索引
		`
	},
	desktop:{
		title:"桌面",
		route:桌面,
		description:`
		一个桌面系统
		`
	},
	simpleAdd:{
		title:"简单的加法",
		route:createRouter(function(me,route){
			return add(me)
		}),
		description:`
		简单的加法
		`
	},
	simpleTodo:{
		title:"简单的Todo",
		route:createRouter(function(me,route){
			return simpleTodo(me)
		}),
		description:`
		一个简单的todo
		`
	},
  todo:{
    title:"todo",
    route:createRouter(function(me,route){
			return todo(me)
		}),
		description:`
		另一个简单的todo
		`
  },
  tree:{
    title:"tree",
    route:createRouter(function(me,route){
			return tree(me)
		}),
		description:`
		树状层级结构
		`
  },
	todoMve:{
		title:"todoMVC",
		route:todoMVC,
		description:`
		tastejs的todomvc
		https://todomvc.com/
		`
	}
}