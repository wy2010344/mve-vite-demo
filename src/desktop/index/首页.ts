import { dom } from "mve-dom"
import { ticTacToeUndoRedo } from "../../tic-tac-toe/undoRedo"
import { dragResizePanel } from "../form"
import { 关于我 } from "./关于我"



export const 首页=dragResizePanel(function(x){
	return {
		hideClose:true,
		title:"首页",
		children:[
			dom({
				type:"button",
				text:"首页",
				event:{
					click(){
						x.panel.add(关于我)
					}
				}
			}),
			dom({
				type:"button",
				text:"tictactoe",
				event:{
					click(){
						x.panel.add(dragResizePanel(function(x){
							return {
								title:"tictactoe",
								children:ticTacToeUndoRedo(x.panel.me)
							}
						}))
					}
				}
			})
		]
	}
})