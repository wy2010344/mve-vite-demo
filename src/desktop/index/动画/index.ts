import { dragResizePanel } from "../../form";
import { selectAnimation } from "./selectAnimation";
import { viewAnimation } from "./viewAnimation";
import { mve } from 'mve-core/util'
import { drawAnimation } from "./drawAnimation";
import { dom } from "mve-dom";
import { Tween, DrawOfBezier3, drawOfBezier3, tweenAnimationOf } from '../../../animate'

//draw(fnName(v.tween, v.easy));

export const 动画展示=dragResizePanel(function(x){

	const dragAM=drawAnimation()
	return {
		title:"动画演示",
		children:[
			selectAnimation(x.panel.me,function(v){
				x.panel.add(动画面板)
				console.log(v)
				if(v){
					va.draw(v)
				}
			}),
			dom({
				type:"div",
				init:dragAM.init,
				children:[
					dragAM.elements,
					dom({
						type:"button",
						text:"绘制",
						event:{
							click(){
								va.draw(drawOfBezier3(dragAM.location()))
							}
						}
					})
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
		children:[
			va.canvas
		]
	}
})