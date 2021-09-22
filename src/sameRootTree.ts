

import { mve } from 'mve-core/util'
import { dom } from 'mve-dom'

/**
 * 其它难度问题
 * 平级树，如基于Table的树结构。模型是树状的，渲染出来是平级的表格
 * 
 */
export function sameRootTree(me:mve.LifeModel){

	return dom({
		type:"div",
		children:[
			dom({
				type:"table"
			})
		]
	})
}