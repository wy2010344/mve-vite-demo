

import { mve } from 'mve-core/util'
import { dom } from 'mve-dom'
import { modelChildren } from 'mve-core/modelChildren'



interface TreeRow{

}

function treeBranch(
	me:mve.LifeModel,
	row:TreeRow,
	i:mve.GValue<number>,
	indent:number,
	display:()=>boolean
){
  const expand=mve.valueOf(false)
  const children=mve.arrayModelOf<TreeRow>([])

	function childrenDisplay(){
		return display() && expand()
	}
	return [
		dom({
			type:"tr",
			style:{
				display(){
					return display()?"":"none"
				}
			},
			children:[
				dom({
					type:"td",
					children:[
						dom({
							type:"button",
							style:{
								width:"25px",
								"margin-left":20 * indent + "px",
								visibility(){
									return children.size()==0?"hidden":''
								}
							},
							text(){
								return expand()?"-":"+"
							},
							event:{
								click(){
									expand(!expand())
								}
							}
						}),
						dom({
							type:"span",
							text(){
								return "第"+(indent+1)+"层"+(i()+1)+"元素"
							}
						})
					]
				}),
				dom({
					type:"td",
					text:"第二列"
				}),
				dom({
					type:"td",
					children:[
						dom({
							type:"button",
							text:"追加1",
							event:{
								click(){
									expand(true)
									children.push({})
								}
							}
						})
					]
				}),
				dom({
					type:"td",
					children:[
						dom({
							type:"button",
							text:"前加1",
							event:{
								click(){
									expand(true)
									children.unshift({})
								}
							}
						})
					]
				})
			]
		}),
		modelChildren(children,function(me,row,i){
			return treeBranch(me,row,i,indent+1,childrenDisplay)
		})
	]
}

/**
 * 其它难度问题
 * 平级树，如基于Table的树结构。模型是树状的，渲染出来是平级的表格
 * 
 */
export function sameRootTree(me:mve.LifeModel){

	const root=mve.arrayModelOf<TreeRow>([
		{},
		{},
		{}
	])
	return dom({
		type:"div",
		children:[
			dom({
				type:"table",
				attr:{
					border:1
				},
				children:modelChildren(root,function(me,row,i){
					return treeBranch(me,row,i,0,()=>true)
				})
			})
		]
	})
}