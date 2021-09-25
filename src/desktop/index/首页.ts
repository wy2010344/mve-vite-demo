import { dom } from "mve-dom"
import { moveFilter } from "../../sortAndFilter/move"
import { ticTacToeUndoRedo } from "../../tic-tac-toe/undoRedo"
import { dragResizePanel } from "../form"
import { 关于我 } from "./关于我"
import { mve } from 'mve-core/util'
import { 动画展示 } from "./动画"


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
					click(e:MouseEvent){
						x.panel.add(dragResizePanel(function(x){
							return {
								title:"tictactoe",
								left:mve.valueOf(e.clientX),
								top:mve.valueOf(e.clientY),
								children:ticTacToeUndoRedo(x.panel.me)
							}
						}))
					}
				}
			}),
			dom({
				type:"button",
				text:"动画效果",
				event:{
					click(e:MouseEvent){
						x.panel.add(动画展示)
					}
				}
			})
		]
	}
})