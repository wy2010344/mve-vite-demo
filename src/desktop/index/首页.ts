import { dom } from "mve-dom"
import { ticTacToeUndoRedo } from "../../tic-tac-toe/undoRedo"
import { dragResizePanel, DragResizePanelParam } from "../form"
import { mve } from 'mve-core/util'
import { 动画展示 } from "./动画"
import { 初始绑定scrollTop或scrollLeft } from "./初始绑定scrollTop或scrollLeft"
import { marked示例 } from "./marked示例"
import { 测试tsx } from "./测试tsx"
import { fragment, EOChild } from "mve-core/childrenBuilder"
import { mdx示例 } from "./mdx示例"
import { 测试动态筛选 } from "./测试动态筛选"


export const 首页 = dragResizePanel(function (x) {
	return {
		hideClose: true,
		title: "首页",
		content: fragment({
			children: [
				dom({
					type: "button",
					text: "tictactoe",
					event: {
						click(e: MouseEvent) {
							x.panel.add(dragResizePanel(function (x) {
								return {
									title: "tictactoe",
									left: mve.valueOf(e.clientX),
									top: mve.valueOf(e.clientY),
									content: ticTacToeUndoRedo(x.panel.me)
								}
							}))
						}
					}
				}),
				dom({
					type: "button",
					text: "动画效果",
					event: {
						click(e: MouseEvent) {
							x.panel.add(动画展示)
						}
					}
				}),
				dom({
					type: "button",
					text: "测试动态筛选",
					event: {
						click(e: MouseEvent) {
							x.panel.add(测试动态筛选)
						}
					}
				}),
				dom({
					type: "button",
					text: "初始绑定scrollTop或scrollLeft",
					event: {
						click(e: MouseEvent) {
							x.panel.add(dragResizePanel(function (x) {
								return {
									title: "tictactoe",
									noResize: true,
									hideMax: true,
									left: mve.valueOf(e.clientX),
									top: mve.valueOf(e.clientY),
									content: 初始绑定scrollTop或scrollLeft(x)
								}
							}))
						}
					}
				}),
				dom({
					type: "button",
					text: "marked示例",
					event: {
						click(e: MouseEvent) {
							x.panel.add(panelOf("marked示例", e, marked示例))
						}
					}
				}),
				dom({
					type: "button",
					text: "mdx示例",
					event: {
						click(e: MouseEvent) {
							x.panel.add(panelOf("mdx示例", e, mdx示例))
						}
					}
				}),
				// dom({
				// 	type:"button",
				// 	text:"测试tsx",
				// 	event:{
				// 		click(e:MouseEvent){
				// 			x.panel.add(panelOf("测试tsx",e,测试tsx))
				// 		}
				// 	}
				// })

			]
		})
	}
})

function panelOf(title: string, e: MouseEvent, getContent: (x: DragResizePanelParam) => EOChild<Node>) {
	return dragResizePanel(function (x) {
		return {
			title,
			width: mve.valueOf(800),
			height: mve.valueOf(600),
			left: mve.valueOf(e.clientX),
			top: mve.valueOf(e.clientY),
			content: getContent(x)
		}
	})
}