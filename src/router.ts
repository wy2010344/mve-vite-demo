import {EOChildren} from 'mve-core/childrenBuilder'
import {modelChildren} from 'mve-core/modelChildren'
import {mve} from 'mve-core/util'
import { dom } from 'mve-dom'
export function routerView<T>(
	me:mve.LifeModel,router:Router<T>,createRoutes:{[key in keyof T]:CreateSubRouter<T[key]>}
){
	const routes:{[key:string]:Router<T>}={}
	Object.entries(createRoutes).forEach(function([k,v]){
		const fun=v as CreateSubRouter<any>
		routes[k]=fun(router.parentPath.concat(k))
	})
	const default404Router=default404FactoryRouter(router.parentPath.concat("404"))
	const currentRoute=mve.arrayModelOf<Router<T>>([])
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
						currentRoute.push(changeR as any)
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
export type CreateSubRouter<T>=(parentPath:string[])=>Router<T>
export class Router<T>{
	readonly param=mve.valueOf<RouterParam>({path:[],query:{}})
	constructor(
		public readonly parentPath:string[],
		private fun:(me:mve.LifeModel,router:Router<T>)=>EOChildren<Node>
	){}

	current():keyof T{
		return this.param().path[0] as keyof T
	}
	render(me:mve.LifeModel){
		return this.fun(me,this)
	}
	/**
	 * 中能在自己的下游路径漫游
	 * @param path 
	 * @param query 
	 */
	go<K extends keyof MCircle<T>>(path:K,query:(MCircle<T>[K] extends QueryWrapper? MCircle<T>[K]['value']:never)){
		location.hash=this.parentPath.concat(path as string).join('/')+queryToString(query as any)
	}
}

function queryToString(q?:QueryParam){
	if(q){
		const vs:string[]=[]
		Object.entries(q).forEach(function([k,v]){
			if(v instanceof Array){
				for(const i of v){
					vs.push(`${k}=${i}`)
				}
			}else{
				vs.push(`${k}=${v}`)
			}
		})
		if(vs.length>0){
			return '?'+vs.join('&')
		}
	}
	return ''
}

export function createRouter<T>(
	fun:(me:mve.LifeModel,router:Router<T>
)=>EOChildren<Node>):CreateSubRouter<T>{
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

export class QueryWrapper<T extends QueryParam={}>{
	constructor(public value:T){}
}
/**加前缀，变联合*/
type ToUnion<K extends string,V>=V extends {
	[key in infer KV]:any
} ? KV extends string ? {
	[key2 in `${K}/${KV}`]:V[KV]
} : never : never
/**加前缀 */
export type CombineRouter<K extends string,V>=UnionToIntersection<ToUnion<K,V>>
/**子级加前缀 */
export type CombineRouterSub<K extends (keyof V & string),V>=UnionToIntersection<ToUnion<K,V[K]>>
/**
 * 联合转交叉
 */
export type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
 * T里选择value的类型是F的key
 */
export type IncludeKey<T,F> = {
	[key in keyof T]:T[key] extends F ? key : never
}[keyof T]
/**
 * T里选择value的类型不是F的key
 */
export type ExcludeKey<T,F> = {
	[key in keyof T]:T[key] extends F ? never : key
}[keyof T]

/**
 * 打平
 */
export type MCircle<T>={
	[k1 in IncludeKey<T,QueryWrapper>]:T[k1]
} & CombineRouterSub<ExcludeKey<T,QueryWrapper> & string,T>