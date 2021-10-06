import { dom,DOMNodeAll } from "mve-dom";
import { createRouter, MCircle, MSCircle, QueryWrapper, Router, routerView } from "./router";
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
import { sameRootTree } from "./sameRootTree";
import { moveFilter } from "./sortAndFilter/move";

interface Paragraph{
	/**段落标题*/
	title:DOMNodeAll[]
	/**内容总结 */
	summary?:DOMNodeAll[]
	/**后续*/
	children?:Paragraph[]
}

function href(content:DOMNodeAll[],href:string,link=false){
	return {
		type:"a",
		attr:{
			href:link?href:"#"+href,
			target:link?"_blank":null
		},
		children:content.map(dom)
	}
}

function toParagraph(vs:Paragraph[],i=1){
	return dom({
		type:"ul",
		children:vs.map(v=>dom({
			type:"li",
			children:[
				dom({
					type:"h"+i,
					children:v.title.map(dom)
				}),
				dom({
					type:"span",
					children:(v.summary||[]).map(dom)
				}),
				toParagraph(v.children||[],i+1)
			]
		}))
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
	sortAndFilterMove:QueryWrapper
	sortAndFilterFilterChildren:QueryWrapper
	sortAndFilterFilterCacheChildren:QueryWrapper
	sameRootTree:QueryWrapper
}

export type ROOTFLAT=MSCircle<MRootRouter>

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
		sortAndFilterMove:createRouter(function(me){
			return moveFilter(me)
		}),
		sortAndFilterFilterChildren:createRouter(function(me){
			return filterOnly(me)
		}),
		sortAndFilterFilterCacheChildren:createRouter(function(me){
			return filterCacheOnly(me)
		}),
		sameRootTree:createRouter(sameRootTree)
	})
})([]) as Router<MRootRouter>



const index=createRouter(function(me,route){
	return dom({
		type:"div",
		children:[
			toParagraph([
				{
					title:[href(["桌面系统"],rootRoute.href("desktop",{}))],
					summary:[`
					一个桌面、窗口组件系统示例
					`]
				},
				{
					title:[href(['vue3+ant-design-vue+tsx的后台管理网站'],"https://wy2010344.gitee.io/vite-vue-ant-design-learn/",true)],
					summary:[`
					跟随github项目实现，移除对covue和covue-lib的依赖
					`]
				},
				{
					title:[href(["同级表格树"],rootRoute.href("sameRootTree",{}))],
					summary:["使用Table来完成的树结构，数据结构是树，在DOM上是表格"]
				},
				{
					title:[href(["一个简单的todo"],rootRoute.href("todo",{}))],
					summary:[`配合文章的示例《`,href(["mve：从一个简单的todo开始——使用vite"],"https://juejin.cn/post/7003976837860704287",true),"》"]
				},
				{
					title:[href(["一个测试的todo"],rootRoute.href("simpleTodo",{}))],
					summary:["以前写的一个todo，测试modelChildrenReverse和childrenReverse"]
				},
				{
					title:[href(["todoMVC"],rootRoute.href("todoMVC/all",{}))],
					summary:[`tastejs的todomvc。tastejs的todomvc是一个帮助你选择前端框架的方案示例`,{type:"br"},href(["https://todomvc.com/"],"https://todomvc.com/",true)],
					children:[
						{
							title:[href(["todoMVC"],rootRoute.href("ask/all",{}))],
							summary:[`其实跟上面一样，只是路由模块化，使在不同路由下`]
						}
					]
				},
				{
					title:[href(["井字棋tic-tac-toe"],rootRoute.href("tic_tac_toe",{}))],
					summary:[
						`react教程《`,href(["入门教程: 认识 React"],"https://react.docschina.org/tutorial/tutorial.html"),"》在mve下的实现"
					],
					children:[
						{
							title:[href(["简化思路"],rootRoute.href("tic_tac_toe_simplify",{}))]
						},
						{
							title:[href(["undo-redo思路"],rootRoute.href("tic_tac_toe_my_style",{}))],
							summary:[`不是很赞成react每次全局副本，难道用户每次点击数据库就要全量备份一次？历史记录应该记录操作栈，进而可以undo-redo`]
						}
					]
				},
				{
					title:["mve-过滤排序解决方案"],
					children:[
						{
							title:[href(["modelChildren+flex+order方案"],rootRoute.href("sortAndFilterFlexOrder",{}))],
							summary:[`仍然用ArrayModel+modelChildren复用DOM元素，巧妙地使用flex的order来作排序`]
						},
						{
							title:[href(["modelChildren+move方案"],rootRoute.href("sortAndFilterMove",{}))],
							summary:[`使用ArrayModel+modelChildren复用DOM元素，但使用ArrayModel::move来调整顺序`]
						},
						{
							title:[href(["filterChildren方案"],rootRoute.href("sortAndFilterFilterChildren",{}))],
							summary:[`使用filterChildren观察生成的列表，每次重新生成，无法复用DOM元素`]
						},
						{
							title:[href(["filterCacheChildren方案"],rootRoute.href("sortAndFilterFilterCacheChildren",{}))],
							summary:[`使用filterCacheChildren观察生成列表，就地复用DOM元素`]
						}
					]
				}
			]),
			dom({type:"hr"}),
			//moveFilter(me),
			support(me)
		]
	})
})
