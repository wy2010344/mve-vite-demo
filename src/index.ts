import { dom } from "mve-dom";
import { 桌面 } from "./desktop";
import { router } from "./router";
import { add } from "./simpleAdd";
import { simpleTodo } from "./simpleTodo";
import { todo } from "./todo";
import { tree } from "./tree";



const index=router(function(me,route){
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


export const rootRouter={
	index:{
		title:"首页",
		route:index,
	},
	desktop:{
		title:"桌面",
		route:桌面
	},
	simpleAdd:{
		title:"简单的加法",
		route:router(function(me,route){
			return add(me)
		})
	},
	simpleTodo:{
		title:"简单的Todo",
		route:router(function(me,route){
			return simpleTodo(me)
		})
	},
  todo:{
    title:"todo",
    route:router(function(me,route){
			return todo(me)
		})
  },
  tree:{
    title:"tree",
    route:router(function(me,route){
			return tree(me)
		})
  }
}