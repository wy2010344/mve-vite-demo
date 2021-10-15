import { mve } from "mve-core/util"
import { dom } from "mve-dom/index"
import {modelChildren} from "mve-core/modelChildren"
import {fragment} from 'mve-core/childrenBuilder'


interface Todo{
  content:mve.Value<string>
  finish:mve.Value<boolean>
}

export function todo(me:mve.LifeModel){
  const todos=mve.ArrayModel.of<Todo>()
  let addInput:HTMLInputElement
	return fragment({
		children:[
			dom({
				type:"input",
				init(e){
					addInput=e
				}
			}),
			dom({
				type:"button",
				text:"添加",
				event:{
					click(){
						const v=addInput.value.trim()
						if(v){
							todos.unshift({
								content:mve.valueOf(v),
								finish:mve.valueOf(false)
							})
							addInput.value=""
						}else{
							alert("请输入内容")
						}
					}
				}
			}),
			dom({
				type:"table",
				childrenReverse:true,
				children:[
					modelChildren(todos,function(me,todo,i) {
						return dom({
							type:"tr",
							children:[
								dom({
									type:"td",
									children:[
										dom({
											type:"input",
											attr:{
												type:"checkbox"
											},
											prop:{
												checked:todo.finish
											},
											event:{
												change(e){
													const checkbox=e.target as HTMLInputElement
													todo.finish(checkbox.checked)
												}
											}
										})
									]
								}),
								dom({
									type:"td",
									children:[
										dom({
											type:"input",
											value:todo.content,
											event:{
												change(e){
													const input=e.target as HTMLInputElement
													const v=input.value.trim()
													if(v){
														todo.content(v)
													}else{
														input.value=todo.content()
													}
												}
											}
										})
									]
								}),
								dom({
									type:"td",
									children:[
										dom({
											type:"a",
											text:"删除",
											attr:{href:"javascript:void(0)"},
											event:{
												click(){
													todos.remove(i())
												}
											}
										})
									]
								})
							]
						})
					})
				]
			})
		]
	})
}