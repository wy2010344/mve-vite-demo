import {EOChildren} from 'mve-core/childrenBuilder'
import {modelChildren} from 'mve-core/modelChildren'
import {mve} from 'mve-core/util'
import { dom } from 'mve-dom'
export function routerView(me:mve.LifeModel,router:Router,createRoutes:{[key:string]:CreateSubRouter}){
	const routes:{[key:string]:Router}={}
	Object.entries(createRoutes).forEach(function([k,v]){
		routes[k]=v(router.parentPath.concat(k))
	})
	const default404Router=default404FactoryRouter(router.parentPath.concat("404"))

	const currentRoute=mve.arrayModelOf<Router>([])
	function clear(){
		if(currentRoute.size()>0){
			currentRoute.remove(0)
		}
	}
	me.WatchAfter(
		function(){
			return router.param()
		},
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
						currentR.param({
							path:rest,query
						})
					}else{
						//发生了改变，替换当前route
						currentRoute.remove(0)
						currentRoute.push(changeR)
						changeR.param({
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

export interface QueryParam{
	[key:string]:string|string[]
}
export interface RouterParam{
	path:string[]
	query:QueryParam
}
export type CreateSubRouter=(parentPath:string[])=>Router
export class Router{
	readonly param=mve.valueOf<RouterParam>({path:[],query:{}})
	constructor(
		public readonly parentPath:string[],
		private fun:(me:mve.LifeModel,router:Router)=>EOChildren<Node>
	){}
	render(me:mve.LifeModel){
		return this.fun(me,this)
	}
	go(path:string,query?:QueryParam){
		if(path.startsWith('.')){
			//相对路径
			const vs=path.split('/')
			for(const v of vs){
				if(v && v!='.'){
					if(v=='..'){

					}else{

					}
				}
			}
		}else{

		}
	}
}

export function createRouter(fun:(me:mve.LifeModel,router:Router)=>EOChildren<Node>):CreateSubRouter{
	return function(parentPath){
		return new Router(parentPath,fun)
	}
}
const default404FactoryRouter=createRouter(function(me,router){
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
					return router.param().path.join('/')
				}
			}),
			dom({
				type:"div",
				text(){
					return JSON.stringify(router.param().query)
				}
			})
		]
	})
})