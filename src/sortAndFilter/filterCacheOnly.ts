



import {mve} from 'mve-core/util'
import { dom } from 'mve-dom'
import { filterSortArea, SORTTYPE, totalData } from './base'
import { filterCacheChildren } from 'mve-core/filterCacheChildren'
interface Row{
	index:number
	value:number
}

export function filterCacheOnly(me:mve.LifeModel){
	const list=mve.valueOf<Row[]>(totalData.map((v,i)=>{
		return {
			index:i,
			value:v
		}
	}))

	const filterSort=mve.valueOf<{
		filter:string
		sort:SORTTYPE
	}>({
		filter:'',
		sort:'none'
	})
	
	return dom({
		type:"div",
		children:[
			filterSortArea(function(filter,sort){
				filterSort({
					filter,sort
				})
			}),
			dom({
				type:"div",
				children:filterCacheChildren(
					function(){
						const x=filterSort()
						const vs=list().filter(v=>(v.value+"").startsWith(x.filter))
						if(x.sort=='none'){
							return vs
						}else
						if(x.sort=='asc'){
							return vs.sort(function(a,b){
								return a.value - b.value
							})
						}else
						if(x.sort=='desc'){
							return vs.sort(function(a,b){
								return b.value - a.value
							})
						}
					},
					function(me,row,i){
						return dom({
							type:"div",
              style:{
                display:"flex",
                "justify-content":"space-around"
              },
							children:[
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text:i
                }),
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text:"随机数据"
                }),
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text(){
										return row().value
									}
                })
							]
						})
					}
				)
			})
		]
	})
}