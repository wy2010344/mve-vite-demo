import { dom, DOMNodeAll } from "mve-dom";
import { createRouter, QueryWrapper, routerView } from "./router";
import { todoMVC, TodoRouter } from "./todo/index";
import { 桌面 } from "./desktop";
import { add } from "./simpleAdd";
import { simpleTodo } from "./simpleTodo";
import { todo } from "./todo";
import { tree } from "./tree";
import { ticTacToe } from "./tic-tac-toe";



const index=createRouter(function(me,route){
	return dom({
		type:"ul",
		children:[
			goLi("首页",function(){
				rootRoute.go("index",{})
			}),
			goLi("桌面系统",function(){
				rootRoute.go("desktop",{})
			}),
			goLi("todoMVC",function(){
				rootRoute.go("todoMVC/all",{})
			}),
			goLi("active",function(){
				rootRoute.go("todoMVC/active",{b:"2"})
			},`
			tastejs的todomvc
			https://todomvc.com/
			`),
			goLi("tic-tac-toe",function(){
				rootRoute.go("tic_tac_toe",{})
			},`
			仿react的tic-tac-toe
			`)
		]
	})
})

function goLi(title:string,click:()=>void,des?:DOMNodeAll){
	return dom({
		type:"li",
		children:[
			dom({
				type:"a",
				attr:{
					href:"javascript:void(0)"
				},
				text:title,
				event:{
					click
				}
			}),
			dom(des||"")
		]
	})
}

export type MRootRouter={
	index:QueryWrapper
	desktop:QueryWrapper
	simpleAdd:QueryWrapper
	simpleTodo:QueryWrapper
	todo:QueryWrapper
	tree:QueryWrapper
	todoMVC:TodoRouter
	ask:TodoRouter
	tic_tac_toe:QueryWrapper
}

export const rootRoute=createRouter<MRootRouter>(function(me,router){
	return routerView(me,router,{
		index,
		desktop:桌面,
		simpleAdd:createRouter(function(me,r){
			return add(me)
		}),
		simpleTodo:createRouter(function(me,r){
			return simpleTodo(me)
		}),
		todo:createRouter(function(me,r){
			return todo(me)
		}),
		tree:createRouter(function(me,r){
			return tree(me)
		}),
		todoMVC,
		ask:todoMVC,
		tic_tac_toe:createRouter(function(me){
			return ticTacToe(me)
		})
	})
})([])