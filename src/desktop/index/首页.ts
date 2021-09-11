import { dom } from "mve-dom"
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
			})
		]
	}
})