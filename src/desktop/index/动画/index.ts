import { dragResizePanel } from "../../form";
import { selectAnimation } from "./selectAnimation";
import { viewAnimation } from "./viewAnimation";
import { mve } from 'mve-core/util'
import { drawAnimation } from "./drawAnimation";
import { dom } from "mve-dom";

//draw(fnName(v.tween, v.easy));

export const 动画展示=dragResizePanel(function(x){
	
	function draw(v){
		if(v){
			x.panel.add(动画面板)
			va.draw(v)
		}
	}
	return {
		title:"动画演示",
		children:[
			dom({
				type:"div",
				style:{
					width(){
						return x.contentWidth()+"px"
					},
					height(){
						return x.contentHeight()+'px'
					},
					overflow:"auto"
				},
				children:[
					selectAnimation(x.panel.me,draw),
					drawAnimation(draw)
				]
			})
		]
	}
})
const va=viewAnimation()
export const 动画面板=dragResizePanel(function(x){
	return {
		title:"动画面板",
		width:mve.valueOf(600),
		height:mve.valueOf(450),
		noResize:true,
		hideMax:true,
		children:[
			va.canvas
		]
	}
})