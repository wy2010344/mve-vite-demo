
import { createRouter, QueryWrapper } from "mve-dom/router"
import "./base.css"
import "./index.less"
import { mve }from 'mve-core/util'
import { modelChildren} from 'mve-core/modelChildren'
import * as DOM from 'mve-dom/DOM'
import { createElement, Dom } from "mve-dom/tsxSupport"
import { fragment } from 'mve-core/childrenBuilder'



export type TodoRouter={
	all:QueryWrapper
	active:QueryWrapper<{b:"2"}>
	complete:QueryWrapper<{c:"3"}>
}

interface TodoItem{
	completed:mve.Value<boolean>
	title:mve.Value<string>
	show:mve.Value<boolean>
	state:mve.Value<"init"|"destroy">
}

const filterValue:{
	[key in keyof TodoRouter]:TodoRouter[key]['value']
}={
	all:null,
	active:{b:"2"},
	complete:{c:"3"}
}
export const todoMVC=createRouter<TodoRouter>(function(me,route){
	let addInput:HTMLInputElement

	const editTodo=mve.valueOf<TodoItem>(null)
	const todos=mve.arrayModelOf<TodoItem>([])

	function getFirstKey(){
		return (route.current() || "all")
	}
	me.WatchAfter(
		function(){
			const key=getFirstKey()
			return todos.filter(todo=>{
				if(key=='all'){
					return true
				}else
				if(key=='active'){
					return !todo.completed()
				}else
				if(key=='complete'){
					return todo.completed()
				}
			})
		},
		function(vs){
			todos.forEach(v=>v.show(false))
			for(const v of vs){
				v.show(true)
			}
		}
	)
	/**动画时长 */
	const animateS=0.5

	return (
		<Dom type="div" cls="todo-app-main">
			<Dom type="div" cls="todo-app-body">
				<Dom type="section" cls="todoapp">
					<Dom type="header" cls="header">
						<Dom type="h1" text="todos"/>
						<Dom type="input" cls="new-todo" attr={{ 
							autofocus:true, 	
							autocomplete:"off", 	
							placeholder:"What needs to be done?"}}
							init={e=>{addInput=e}}
							event={{
								keydown(e){
									if(DOM.keyCode.ENTER(e)){
										const v=addInput.value.trim()
										if(v){
											const todo:TodoItem={
												show:mve.valueOf(true),
												title:mve.valueOf(v),
												completed:mve.valueOf(false),
												state:mve.valueOf("init")
											}
											todos.push(todo)
											setTimeout(function(){
												todo.state(null)
											})
											addInput.value=''
										}
									}
								}
							}}	
						/>
					</Dom>
					<Dom type="section" cls="main">
							<Dom type="input" id="toggle-all" cls="toggle-all" attr={{type:"checkbox"}} event={{
								click(e){
									todos.forEach(v=>{
										v.completed(e.target.checked)
									})
								}
							}}/>
							<Dom type="label" attr={{for:"toggle-all"}} text="Mark all as complete"/>
							<Dom type="ul" cls="todo-list">
								{modelChildren(todos,function(me,todo,i){

									let checkbox:HTMLInputElement
									let editInput:HTMLInputElement
									function finishEdit(){
										todo.title(editInput.value.trim())
										editTodo(null)
									}

									return (
										<Dom type="li" 
											cls={()=>{
												const vs=['todo']
												if(todo.completed()){
													vs.push('completed')
												}
												if(todo==editTodo()){
													vs.push('editing')
												}
												return vs
											}}
											style={{
												display(){
													return todo.show()?'':'none'
												},
												left(){
													return todo.state()=='destroy'
													?'100%'
													:todo.state()=='init'
													? '-100%'
													:'0'
												},
												transition:`left ${animateS}s`
											}}
										>
											<Dom type="div" cls="view">
												<Dom type="input" cls="toggle" attr={{type:"checkbox"}} init={e=>{checkbox=e}} 
													prop={{checked:todo.completed}} 
													event={{change(){todo.completed(checkbox.checked)}}}
												/>
												<Dom type="label" text={todo.title} 
													event={{
														dblclick(){
															editTodo(todo)
															editInput.focus()
														}
													}}
												/>
												<Dom type="button" cls="destroy" 
													event={{
														click(){
															todo.state("destroy")
															setTimeout(function(){
																console.log('删除',i())
																todos.remove(i())
															},animateS*1000)
														}
													}}
												/>
											</Dom>

											<Dom type="input" cls="edit" init={e=>{editInput=e}}
												attr={{
													type:"text",
													"todo-focus"(){
														return todo==editTodo()
													}
												}}
												value={todo.title}
												event={{
													blur:finishEdit,
													keyup(e:KeyboardEvent){
														if(DOM.keyCode.ENTER(e)){
															finishEdit()
														}else
														if(e.key=='Escape'){
															editTodo(null)
															editInput.value=todo.title()
														}
														console.log(e)
													}
												}}
											/>
										</Dom>
									)
								})}
							</Dom>
					</Dom>
					<Dom type="footer" cls="footer">
						 <Dom type="span" cls="todo-count">
							 <Dom type="strong" text={()=>todos.filter(v=>!v.completed()).length}/> items left
						 </Dom>
						 <Dom type="ul" cls="filters">
								{fragment({
									children:Object.entries(filterValue).map(([k,v])=>(
										<Dom type="li">
											<Dom type="a" cls={()=>getFirstKey()==k?'selected':''} attr={{href:"javascript:void(0)"}} text={k}
												event={{
													click(){
														route.go(k as keyof TodoRouter,v)
													}
												}}
											/>
										</Dom>)
									)
								})}
						 </Dom>
						 <Dom type="button" cls="clear-completed" text="Clear completed" 
						 	style={{display(){
								 return todos.filter(v=>v.completed()).length>0?'':'none'
							}}}
							event={{click(){
								todos.removeWhere(v=>v.completed())
							}}}
						 />
					</Dom>
				</Dom>
				<Dom type="footer" cls="info">
					<Dom type="p" text="Double-click to edit a todo"/>
					<Dom type="p" text="written by wy2010344"/>
					<Dom type="p" text="Part of TodoMVC"/>
				</Dom>
			</Dom>
		</Dom>
	)
})