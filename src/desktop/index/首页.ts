import { dom } from "mve-dom"
import { ticTacToeUndoRedo } from "../../tic-tac-toe/undoRedo"
import { dragResizePanel } from "../form"
import { mve } from 'mve-core/util'
import { 动画展示 } from "./动画"
import { 初始绑定scrollTop或scrollLeft } from "./初始绑定scrollTop或scrollLeft"
import { marked示例 } from "./marked示例"
import { 测试tsx } from "./测试tsx"


export const 首页=dragResizePanel(function(x){
	return {
		hideClose:true,
		title:"首页",
		children:[
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
			}),
			dom({
				type:"button",
				text:"初始绑定scrollTop或scrollLeft",
				event:{
					click(e:MouseEvent){
						x.panel.add(dragResizePanel(function(x){
							return {
								title:"tictactoe",
								noResize:true,
								hideMax:true,
								left:mve.valueOf(e.clientX),
								top:mve.valueOf(e.clientY),
								children:初始绑定scrollTop或scrollLeft(x)
							}
						}))
					}
				}
			}),
			dom({
				type:"button",
				text:"marked示例",
				event:{
					click(e:MouseEvent){
						x.panel.add(dragResizePanel(function(x){
							return {
								title:"marked示例",
								width:mve.valueOf(800),
								height:mve.valueOf(600),
								left:mve.valueOf(e.clientX),
								top:mve.valueOf(e.clientY),
								children:marked示例(x)
							}
						}))
					}
				}
			}),
			dom({
				type:"button",
				text:"测试tsx",
				event:{
					click(e:MouseEvent){
						x.panel.add(dragResizePanel(function(x){
							return {
								title:"测试tsx",
								width:mve.valueOf(800),
								height:mve.valueOf(600),
								left:mve.valueOf(e.clientX),
								top:mve.valueOf(e.clientY),
								children:测试tsx(x)
							}
						}))
					}
				}
			})
		]
	}
})