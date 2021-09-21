import {mve} from 'mve-core/util'
import {EOChildren} from 'mve-core/childrenBuilder'
import { dom } from 'mve-dom'
import { resizeZoom } from './resize'
import { dragMoveHelper, dragResizeHelper } from './drag'
import { buildTitle } from './title'
import { modelChildren} from 'mve-core/modelChildren'


export interface FormPanelParam{
	me:mve.LifeModel
	desktop:DeskTopParam,
	add(v:FormPanel):void
	/**删除 */
	remove():void
	/**z-index */
	index():number
	/**带到最前来 */
	bringToFront():void
}
export interface FormPanel{
	(p:FormPanelParam):EOChildren<Node>
}


interface PanelWithIndex{
	panel:FormPanel
	index:mve.Value<number>
}
export interface DeskTopParam{
	width:mve.GValue<number>
	height:mve.GValue<number>
}
export function desktopOf(k:DeskTopParam){
	const panels=mve.arrayModelOf<PanelWithIndex>([])
	const vs:PanelWithIndex[]=[]


	function bringToFront(row:PanelWithIndex){
		const idx=vs.indexOf(row)
		if(idx<vs.length-1){
			vs.push(row)
			vs.splice(idx,1)
			for(let i=idx;i<vs.length;i++){
				vs[i].index(i)
			}
		}
	}

	function add(v:FormPanel){
		const old=panels.findRow(x=>x.panel==v)
		if(old){
			//已经存在，放到最后
			bringToFront(old)
		}else{
			//不存在
			const index=mve.valueOf(vs.length)
			const pw={
				panel:v,
				index
			}
			panels.push(pw)
			vs.push(pw)
		}
	}
	return {
		add,	
		render:modelChildren(panels,function(me,row,i){
			return row.panel({
				me,
				remove(){
					panels.remove(i())
				},
				add,
				desktop:k,
				index:row.index,
				bringToFront(){
					bringToFront(row)
				}
			})
		})
	}
}


export interface DragResizePanelParam{
	contentWidth():number
	contentHeight():number
	panel:FormPanelParam
}
export function dragResizePanel(render:(x:DragResizePanelParam)=>{
	width?:mve.Value<number>
	height?:mve.Value<number>
	top?:mve.Value<number>
	left?:mve.Value<number>
	max?:mve.Value<boolean>
	hideClose?:mve.TValue<boolean>
	hideMax?:mve.TValue<boolean>
	title?:mve.TValue<string>,
	children:EOChildren<Node>
}):FormPanel{
	return function(x){
		const titleHeight=30
		function renderWidth(){
			if(max()){
				return x.desktop.width()
			}else{
				return width()
			}
		}
		function renderHeight(){
			if(max()){
				return x.desktop.height()
			}else{
				return height()
			}
		}
		const p=render({
			panel:x,
			contentHeight(){
				return renderHeight()-titleHeight
			},
			contentWidth:renderWidth
		})
		const max=p.max||mve.valueOf(false)
		const top=p.top||mve.valueOf(0)
		const left=p.left||mve.valueOf(0)
		const width=p.width||mve.valueOf(400)
		const height=p.height||mve.valueOf(600)
		return dom({
			type:"div",
			event:{
				mousedown:{
					capture:true,
					handler:x.bringToFront
				}
			},
			style:{
				background:"white",
				"border-radius":"5px",
				position:"absolute",
				"z-index"(){
					return x.index()+""
				},
				"box-shadow":"rgb(102, 102, 102) 0px 0px 20px 5px",
				top(){
					if(max()){
						return "0px"
					}else{
						return top()+'px'
					}
				},
				left(){
					if(max()){
						return "0px"
					}else{
						return left()+"px"
					}
				},
				width(){
					return renderWidth()+'px'
				},
				height(){
					return renderHeight()+'px'
				}
			},
			children:[
				buildTitle({
					title:p.title,
					height:30,
					move:dragMoveHelper({
						diffX(x){
							left(left()+x)
						},
						diffY(y){
							top(top()+y)
						}
					}),
					hideClose:p.hideClose,
					max,
					hideMax: p.hideMax,
					closeClick:x.remove,
				}),
				p.children,
				resizeZoom({
					resize:dragResizeHelper({
						addHeight(x){
							height(height()+x)
						},
						addLeft(x){
							left(left()+x)
						},
						addTop(x){
							top(top()+x)
						},
						addWidth(x){
							width(width()+x)
						}
					})
				})
			]
		})
	}
}