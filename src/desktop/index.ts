import {dom} from 'mve-dom/index'
import { desktopOf } from './form'
import { 首页 } from './index/首页'
import { mve } from 'mve-core/util'

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

export function 桌面(){
	const desktop=desktopOf({
		width,height
	})
	desktop.add(首页)
	
	return dom.root(function(me){
		return {
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
			children:desktop.render
		}
	})
}