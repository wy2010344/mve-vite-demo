import { dom } from "mve-dom";
import { createRouter, QueryWrapper, routerView } from "./router";
import { todoMVC, TodoRouter } from "./todo/index";
import { 桌面 } from "./desktop";
import { add } from "./simpleAdd";
import { simpleTodo } from "./simpleTodo";
import { todo } from "./todo";
import { tree } from "./tree";
import { ticTacToe } from "./tic-tac-toe";
import { ticTacToeSimplify } from "./tic-tac-toe/simplify";
import { aHref, linkSub, support } from "./support";
import { EOChildren }from 'mve-core/childrenBuilder'
import { ticTacToeUndoRedo } from "./tic-tac-toe/undoRedo";
import { flexSortAndFilter } from "./sortAndFilter/flexOrder";
import { filterOnly } from "./sortAndFilter/filterOnly";
import { filterCacheOnly } from "./sortAndFilter/filterCacheOnly";


const index=createRouter(function(me,route){
	return dom({
		type:"div",
		children:[
			dom({
				type:"ul",
				children:[
					goLi("首页",function(){
						rootRoute.go("index",{})
					},[
						dom("当前页")
					]),
					goLi("桌面系统",function(){
						rootRoute.go("desktop",{})
					},[
						dom("一个桌面、窗口组件系统示例")
					]),
					goLi("todo",function(){
						rootRoute.go("todo",{})
					},[
						dom("一个超简单的todo，配合文章的示例")
					]),
					goLi("simpleTodo",function(){
						rootRoute.go("simpleTodo",{})
					},[
						dom("以前写的一个todo，测试modelChildrenReverse和childrenReverse")
					]),
					linkSub("todoMVC",[
						goLi("todoMVC",function(){
							rootRoute.go("todoMVC/all",{})
						},[
							dom(`tastejs的todomvc`),
							dom({type:"br"}),
							aHref("https://todomvc.com/")
						]),
						goLi("active",function(){
							rootRoute.go("todoMVC/active",{b:"2"})
							},[
							dom(`其实跟上面todoMVC一样，只是绑定在不同路由下`)
						]),
					]),
					linkSub("tic-tac-toe",[
						goLi("tic-tac-toe",function(){
							rootRoute.go("tic_tac_toe",{})
						},[dom('仿react的tic-tac-toe')]),
						goLi("tic-tac-toe-simplify",function(){
							rootRoute.go("tic_tac_toe_simplify",{})
						},[
							dom('仿react的tic-tac-toe'),
							dom('简化版')
						]),
						goLi("tic-tac-toe-my-style",function(){
							rootRoute.go("tic_tac_toe_my_style",{})
						},[
							dom('仿react的tic-tac-toe'),
							dom('我的方案：主要是如数据库是无法支持副作用的，所以历史记录应该像文档一样记录操作栈，然后可以undo-redo')
						]),
					]),
					linkSub("过滤排序",[
						goLi("modelChildren-flex-order过滤排序的解决方案",function(){
							rootRoute.go("sortAndFilterFlexOrder",{})
						},[
							dom("modelChildren，ArrayModel的过滤排序方案，使用flex-order")
						]),
						goLi("filterChildren的过滤排序方案",function(){
							rootRoute.go("sortAndFilterFilterChildren",{})
						},[
							dom("不利用的sort-filter")
						]),
						goLi("filterCacheChildren的过滤排序方案",function(){
							rootRoute.go("sortAndFilterFilterCacheChildren",{})
						},[
							dom("就地复用方案的sort-filter")
						]),
					])
				]
			}),
			dom({type:"hr"}),
			//moveFilter(me),
			support(me)
		]
	})
})

function goLi(title:string,click:()=>void,des?:EOChildren<Node>){
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
			dom({
				type:"div",
				children:des
			})
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
	tic_tac_toe_simplify:QueryWrapper
	tic_tac_toe_my_style:QueryWrapper
	sortAndFilterFlexOrder:QueryWrapper
	sortAndFilterFilterChildren:QueryWrapper
	sortAndFilterFilterCacheChildren:QueryWrapper
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
		}),
		tic_tac_toe_simplify:createRouter(function(me){
			return ticTacToeSimplify(me)
		}),
		tic_tac_toe_my_style:createRouter(function(me){
			return ticTacToeUndoRedo(me)
		}),
		sortAndFilterFlexOrder:createRouter(function(me){
			return flexSortAndFilter(me)
		}),
		sortAndFilterFilterChildren:createRouter(function(me){
			return filterOnly(me)
		}),
		sortAndFilterFilterCacheChildren:createRouter(function(me){
			return filterCacheOnly(me)
		})
	})
})([])