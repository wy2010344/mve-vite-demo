import {dom} from 'mve-dom/index'
import { desktopOf } from './form'
import { 首页 } from './index/首页'
import { mve } from 'mve-core/util'
import { createRouter } from 'mve-dom/router'

const width=mve.valueOf(0)
const height=mve.valueOf(0)
function resize(){
	if(window.innerWidth!=width()){
		width(window.innerWidth)
	}
	if(window.innerHeight!=height()){
		height(window.innerHeight)
	}
}
window.addEventListener("resize",resize)
resize()

export const 桌面=createRouter(function(me,route){
	const desktop=desktopOf({
		width,height
	})
	desktop.add(首页)
	return dom({
		type:"div",
		init(){
		},
		style:{
			width:"100%",
			height:"100%",
			position:"fixed",
			top:"0",
			left:"0"
		},
		children:[
			desktop.render
		]
	})
})