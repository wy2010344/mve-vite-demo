import { dom } from "mve-dom/index";
import { createRouter , FlatRouter, QueryWrapper, Router, routerView } from "mve-dom/router";
import { todoMVC, TodoRouter } from "./todo/index";
import { todoMVC as tsxTodoMVC, TodoRouter as TSXTodoRouter } from "./todo/tsx";
import { 桌面 } from "./desktop";
import { add } from "./simpleAdd";
import { simpleTodo } from "./simpleTodo";
import { todo } from "./todo";
import { tree } from "./tree";
import { ticTacToe } from "./tic-tac-toe";
import { ticTacToeSimplify } from "./tic-tac-toe/simplify";
import { support } from "./support";
import { ticTacToeUndoRedo } from "./tic-tac-toe/undoRedo";
import { flexSortAndFilter } from "./sortAndFilter/flexOrder";
import { filterOnly } from "./sortAndFilter/filterOnly";
import { filterCacheOnly } from "./sortAndFilter/filterCacheOnly";
import { sameRootTree } from "./sameRootTree";
import { moveFilter } from "./sortAndFilter/move";
import { createElement, Dom, TsxChild, mergeFromTsxChildren, fromTsxChild, Fragment } from "mve-dom/tsxSupport";
import { canvasReact } from "./canvasReact";

interface Paragraph{
	/**段落标题*/
	title:TsxChild
	/**内容总结 */
	summary?:TsxChild
	/**后续*/
	children?:Paragraph[]
}

function Href(p:{
	href:string
	link?:boolean
	children?:TsxChild
},...children:TsxChild[]){
	return dom({
		type:"a",
		attr:{
			href:p.link?p.href:"#"+p.href,
			target:p.link?"_blank":null
		},
		children:mergeFromTsxChildren(p.children,children)
	})
}

function toParagraph(vs:Paragraph[],i=1){
	return dom({
		type:"ul",
		children:vs.map(v=>dom({
			type:"li",
			children:[
				dom({
					type:"h"+i,
					children:[
						fromTsxChild(v.title)
					]
				}),
				dom({
					type:"span",
					children:[
						fromTsxChild(v.summary||'')
					]
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
	ask:TSXTodoRouter
	tic_tac_toe:QueryWrapper
	tic_tac_toe_simplify:QueryWrapper
	tic_tac_toe_my_style:QueryWrapper
	sortAndFilterFlexOrder:QueryWrapper
	sortAndFilterMove:QueryWrapper
	sortAndFilterFilterChildren:QueryWrapper
	sortAndFilterFilterCacheChildren:QueryWrapper
	sameRootTree:QueryWrapper
	canvasReact:QueryWrapper
}

export type ROOTFLAT=FlatRouter<MRootRouter>

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
		ask:tsxTodoMVC,
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
		sameRootTree:createRouter(sameRootTree),
		canvasReact:createRouter(function(me){
			return canvasReact(me)
		})
	})
})([]) as Router<MRootRouter>



const index=createRouter(function(me,route){
	return dom({
		type:"div",
		children:[
			toParagraph([
				{
					title:<Href href={rootRoute.href("desktop",{})}>桌面系统</Href>,
					summary:<Fragment>
						一个桌面、窗口组件系统示例
					</Fragment>
				},
				{
					title:<Href href="https://wy2010344.gitee.io/vite-vue-ant-design-learn/" link>vue3+ant-design-vue+tsx的后台管理网站</Href>,
					summary:<Fragment>
						跟随github项目实现，移除对covue和covue-lib的依赖。待补全
					</Fragment>
				},
				{
					title:<Href href="https://gitee.com/wy2010344/article" link>个人文章收集</Href>,
					summary:<Fragment>
						一些个人文章，不一定完成
					</Fragment>
				},
				{
					title:<Href href={rootRoute.href("sameRootTree",{})}>同级表格树</Href>,
					summary:<Fragment>
						使用Table来完成的树结构，数据结构是树，在DOM上是表格
					</Fragment>
				},
				{
					title:<Href href={rootRoute.href("todo",{})} >一个简单的todo</Href>,
					summary:<Fragment>
						配合文章的示例《<Href href="https://juejin.cn/post/7003976837860704287" link>mve：从一个简单的todo开始——使用vite</Href>》
					</Fragment>
				},
				{
					title:<Href href={rootRoute.href("simpleTodo",{})} >一个测试的todo</Href>,
					summary:<Fragment>
						以前写的一个todo，测试modelChildrenReverse和childrenReverse
					</Fragment>
				},
				{
					title:<Href href={rootRoute.href("todoMVC/all",{})} >todoMVC</Href>,
					summary:<Fragment>
						tastejs的todomvc。tastejs的todomvc是一个帮助你选择前端框架的方案示例<Dom type="br"/>
						<Href href="https://todomvc.com/" link>https://todomvc.com/</Href>
					</Fragment>,
					children:[
						{
							title:<Href href={rootRoute.href("ask/all",{})} >todoMVC</Href>,
							summary:<Fragment>
								其实跟上面一样，只是路由模块化，使在不同路由下
							</Fragment>
						}
					]
				},
				{
					title:<Href href={rootRoute.href("tic_tac_toe",{})} >井字棋tic-tac-toe</Href>,
					summary:<Fragment>
						react教程《<Href href="https://react.docschina.org/tutorial/tutorial.html" link>入门教程: 认识 React</Href>》在mve下的实现
					</Fragment>,
					children:[
						{
							title:<Href href={rootRoute.href("tic_tac_toe_simplify",{})}>简化思路</Href>
						},
						{
							title:<Href href={rootRoute.href("tic_tac_toe_my_style",{})}>undo-redo思路</Href>,
							summary:<Fragment>
								不是很赞成react每次全局副本，难道用户每次点击数据库就要全量备份一次？历史记录应该记录操作栈，进而可以undo-redo
							</Fragment>
						}
					]
				},
				{
					title:`mve-过滤排序解决方案`,
					children:[
						{
							title:<Href href={rootRoute.href("sortAndFilterFlexOrder",{})}>modelChildren+flex+order方案</Href>,
							summary:<Fragment>
								仍然用ArrayModel+modelChildren复用DOM元素，巧妙地使用flex的order来作排序
							</Fragment>
						},
						{
							title:<Href href={rootRoute.href("sortAndFilterMove",{})}>modelChildren+move方案</Href>,
							summary:<Fragment>
								使用ArrayModel+modelChildren复用DOM元素，但使用ArrayModel::move来调整顺序
							</Fragment>
						},
						{
							title:<Href href={rootRoute.href("sortAndFilterFilterChildren",{})}>filterChildren方案</Href>,
							summary:<Fragment>
								使用filterChildren观察生成的列表，每次重新生成，无法复用DOM元素
							</Fragment>
						},
						{
							title:<Href href={rootRoute.href("sortAndFilterFilterCacheChildren",{})}>filterCacheChildren方案</Href>,
							summary:<Fragment>
								使用filterCacheChildren观察生成列表，就地复用DOM元素
							</Fragment>
						}
					]
				},{
					
					title:<Href href={rootRoute.href("canvasReact",{})} >canvas做的GUI库</Href>,
					summary:<Fragment>
						深入canvas底层实现mvvm库
					</Fragment>
				}
			]),
			dom({type:"hr"}),
			//moveFilter(me),
			support(me)
		]
	})
})
