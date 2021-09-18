import { clsOf, dom } from "mve-dom/index"
import { routerView, createRouter } from "./router"
const topAreaCls=clsOf("topArea")
const rootRoute=createRouter(function(me,route){
	return routerView(me,route,{
		index:createRouter(function(me,route){
			return dom({
				type:"div",
				cls:topAreaCls,
				style:{
					background:"green",
				},
				children:[
					dom({
						type:"button",
						text:"去user",
						event:{
							click(){
								location.hash="user/a"
							}
						}
					})
				]
			})
		}),
		user:createRouter(function(me,route){
			return dom({
				type:"div",
				cls:topAreaCls,
				style:{
					background:"blue"
				},
				children:[
					dom({
						type:"input",
						attr:{
							placeHolder:"测试路由缓存"
						}
					}),
					routerView(me,route,{
						a:createRouter(function(me,route){
							return dom({
								type:"div",
								children:[
									dom({
										type:"button",
										text:"去user-b",
										event:{
											click(){
												location.hash="user/b"
											}
										}
									})
								]
							})
						}),
						b:createRouter(function(me,route){
							return dom({
								type:"div",
								children:[
									dom({
										type:"button",
										text:"去不存在的页",
										event:{
											click(){
												location.hash="user/c"
											}
										}
									})
								]
							})
						}),
					})
				]
			})
		})
	})
})([])
const root=dom.root(function(me){
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
			rootRoute.render(me)
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
	rootRoute.param({path,query})
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