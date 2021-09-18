
import { dom } from "mve-dom"
import { createRouter } from "../router"
import "./base.css"
import "./index.css"
import { mve }from 'mve-core/util'
import { modelChildren} from 'mve-core/modelChildren'
import * as DOM from 'mve-dom/DOM'

interface TodoItem{
	completed:mve.Value<boolean>
	title:mve.Value<string>
}
export const todoMVC=createRouter(function(me,route){
	let addInput:HTMLInputElement

	const editTodo=mve.valueOf<TodoItem>(null)
	const todos=mve.arrayModelOf<TodoItem>([])
	return [
		dom({
			type:"section",cls:"todoapp",
			children:[
				dom({
					type:"header",cls:"header",
					children:[
						dom({type:"h1",text:"todos"}),
						dom({
							type:"input",cls:"new-todo",attr:{
								autofocus:true,
								autocomplete:"off",
								placeholder:"What needs to be done?"
							},init(e){addInput=e},
							event:{
								keydown(){

								}
							}
						})
					]
				}),
				dom({
					type:"section",cls:"main",
					children:[
						dom({
							type:"input",id:"toggle-all",cls:"toggle-all",attr:{type:"checkbox"}
						}),
						dom({
							type:"label",attr:{for:"toggle-all"},text:"Mark all as complete"
						}),
						dom({
							type:"ul",cls:"todo-list",
							children:modelChildren(todos,function(me,todo,i){
								let checkbox:HTMLInputElement
								return dom({
									type:"li",cls(){
										const vs=['todo']
										if(todo.completed()){
											vs.push('complete')
										}
										if(todo==editTodo()){
											vs.push('editing')
										}
										return vs.join(' ')
									},
									children:[
										dom({type:"div",cls:"view",children:[
											dom({type:"input",cls:"toggle",attr:{type:"checkbox"},init(e){checkbox=e},
												prop:{
													checked:todo.completed
												},
												event:{
													change(){
														todo.completed(checkbox.checked)
													}
												}
											}),
											dom({type:"label",text:todo.title,event:{
												dbclick(){
													editTodo(todo)
												}
											}}),
											dom({type:"button",cls:"destroy",event:{
												click(){
													todos.remove(i())
												}
											}})
										]}),
										dom({type:"input",cls:"edit",
											attr:{
												type:"text",
												"todo-focus"(){
													return todo==editTodo()
												}
											},
											event:{
												blur(){
													todo.completed(true)
												},
												keydown(e){
													if(DOM.keyCode.ENTER(e)){

													}
													// if(DOM.keyCode.ESC(e)){

													// }
												}
											}
										})
									]
								})
							})
						})
					]
				}),
				dom({
					type:"footer",cls:"footer",
					children:[
						dom({
							type:"span",cls:"todo-count",
							children:[
								dom({
									type:"strong",
									text(){
										return ""
									}
								})
							]
						})
					]
				})
			]
		}),
		dom({type:"fotter",cls:"info",
			children:[
				dom({type:"p",text:"Double-click to edit a todo"}),
				dom({type:"p",text:"written by wy2010344"}),
				dom({type:"p",text:"Part of TodoMVC"}),
			]
		})
	]
})