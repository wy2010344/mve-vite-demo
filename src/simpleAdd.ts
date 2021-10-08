import { dom } from "mve-dom/index";
import {mve} from "mve-core/util"
export function add(me:mve.LifeModel){
	const count=mve.valueOf(0)
	return dom({
		type:"button",
		init(){
			console.log("初始化")
			return function(){
				console.log("销毁")
			}
		},
		text(){return count()+""},
		event:{
			click(){
				count(count()+1)
			}
		}
	})
}