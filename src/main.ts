import { clsOf, dom } from "mve-dom/index"
import { routerView, RouterParam } from "./router"
import {mve} from 'mve-core/util'
import { rootRouter } from "."
const topAreaCls=clsOf("topArea")
const routerParam=mve.valueOf<RouterParam>({path:[],query:{}})
const root=dom.root(function(me){
	const map={}
	Object.entries(rootRouter).map(([key,v])=>{
		map[key]=v.route 
	})
	return {
		type:"div",
		children:[
			dom({
				type:"style",
				text:`
				.${topAreaCls}{
					position:fixed;
					top:0;
					left:0;
					width:100%;
					height:100%
				}
				`
			}),
			routerView(me,routerParam,map)
		]
	}
})

function hashChange(){
	const hash=location.hash
	const query={}
	const path=[]
	if(hash){
		const [pathStr,queryStr]=hash.split("?")
		pathStr.slice(1).split("/").forEach(v=>{
			if(v){
				path.push(v)
			}
		})
		if(queryStr){
			queryStr.split("&").forEach(kv=>{
				const [k,v]=kv.split("=")
				const oldV=query[k]
				if(oldV){
					oldV.push(v)
				}else{
					query[k]=v
				}
			})
		}
	}
	if(path.length==0){
		path.push("index")
	}
	routerParam({path,query})
}
window.addEventListener("hashchange",hashChange)
hashChange()
document.body.appendChild(root.element)
if(root.init){
	root.init()
}
if(root.destroy){
	window.addEventListener("unload",root.destroy)
}