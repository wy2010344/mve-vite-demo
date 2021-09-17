import {EOChildren} from 'mve-core/childrenBuilder'
import {modelChildren} from 'mve-core/modelChildren'
import {mve} from 'mve-core/util'
import { dom } from 'mve-dom'
export interface RouterParam{
	path:string[]
	query:{[key:string]:string|string[]}
}
export interface Router{
	route:mve.Value<RouterParam>
	render(me:mve.LifeModel):EOChildren<Node>;
}
export function routerView(me:mve.LifeModel,param:mve.Value<RouterParam>,routes:{[key:string]:Router}){
	const currentRoute=mve.arrayModelOf<Router>([])
	function clear(){
		if(currentRoute.size()>0){
			currentRoute.remove(0)
		}
	}
	me.WatchAfter(
		param,
		function(p){
			if(p){
				const {path:[first,...rest],query}=p
				const currentR=currentRoute.get(0)
				if(first){
					//有路径
					const changeR=routes[first] || default404Router
					//并且能找到路由
					if(currentR==changeR){
						//并未发生改变
						currentR.route({
							path:rest,query
						})
					}else{
						//发生了改变，替换当前route
						currentRoute.remove(0)
						currentRoute.push(changeR)
						changeR.route({
							path:rest,query
						})
					}
				}else{
					clear()
				}
			}else{
				clear()
			}
		}
	)
	return modelChildren(currentRoute,function(me,row,i){ 
		return row.render(me) 
	})
}
export function router(fun:(me:mve.LifeModel,route:mve.Value<RouterParam>)=>EOChildren<Node>):Router{
	const route=mve.valueOf<RouterParam>({path:[],query:{}})
	return {
		route,
		render(me){
			return fun(me,route)
		}
	}
}
const default404Router=router(function(me,route){
	return dom({
		type:"div",
		style:{
			display:"flex",'flex-direction':"column",'align-items':'center','justify-content':'center'
		},
		children:[
			dom({
				type:"div",
				text:"404"
			}),
			dom({
				type:"div",
				text(){
					const v=route()
					return v.path.join("")
				}
			}),
			dom({
				type:"div",
				text(){
					const v=route()
					return JSON.stringify(v.query)
				}
			})
		]
	})
})