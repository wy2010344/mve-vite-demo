import { EOParseResult } from "mve-core/util"
import { dom } from "mve-dom/index"
import { acts, listActs } from "./index_singleRoute"
let cache:EOParseResult<Node>
function defaultAct(act:string){
	return dom.root(function(me){
		return {
			type:"div",
			children:[
				dom(`未找到路由定义:${act}`),
				dom("可用定义有"),
				listActs()
			]
		}
	})
}

function init(){
	const hash=location.hash
	//如果没有hash，默认指定为index
	const actPath=hash?hash.split("?")[0].slice(1):"index"
	const act=acts[actPath]
	if(cache && cache.destroy){
		cache.destroy()
		document.body.removeChild(cache.element)
	}
	if(act){
		cache=act.render()
	}else{
		cache=defaultAct(actPath)
	}
	document.body.appendChild(cache.element)
	if(cache.init){
		cache.init()
	}
}
window.addEventListener("hashchange",init)
init()
window.addEventListener("close",function(){
  if(cache && cache.destroy){
    cache.destroy()
  }
})