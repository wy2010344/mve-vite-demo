import { dom } from "mve-dom/index";
import {mve} from "mve-core/util"


export function simpleAdd(){
	return dom.root(function(me){
		const count=mve.valueOf(0)
		return {
			type:"button",
			text(){return count()+""},
			event:{
				click(){
					count(count()+1)
				}
			}
		}
	})
}