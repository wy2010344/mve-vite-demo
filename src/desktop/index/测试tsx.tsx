

import { createElement,Dom,Fragment,JSX, Svg, SvgFragment } from 'mve-dom/tsxSupport'
import { DragResizePanelParam } from '../form'
import { modelChildren } from 'mve-core/modelChildren'
import { mve } from 'mve-core/util'

export function 测试tsx(x:DragResizePanelParam){
	const todos=mve.arrayModelOf(["a","b"])
	return (<Fragment>
		我在在工
		<Dom type="div">
			我是第一行文字
		</Dom>
		<Dom type="div">
			我是第二行文字{}
		</Dom>
		<Svg type="svg">
			<Svg type="rect" attr={{width:20,height:30}} style={{fill:"green"}}/>
		</Svg>
		<Dom type="div">
			继续写文字 {9}
			<Dom type="button" event={{click(){todos.push(Date.now()+"")}}}>增加</Dom>
			{
				modelChildren(todos,function(me,row,i){
					return (
						<Dom type="div">
							<Dom type="span">{row} -- {i()}</Dom>
							<Dom type="button" event={{click(){todos.remove(i())}}}>删除</Dom>
							<Dom type="span" text={i}/>
						</Dom>
					)
				})
			}
		</Dom>
	</Fragment>)
}