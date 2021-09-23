import {mve} from 'mve-core/util'
import {EOChildren} from 'mve-core/childrenBuilder'
import { dom } from 'mve-dom'
import { resizeZoom } from './resize'
import { dragMoveHelper, dragResizeHelper } from './drag'
import { buildTitle } from './title'
import { modelChildren} from 'mve-core/modelChildren'
import { targetAnimationOf, Tween, tweenAnimationOf } from '../animate'


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
/**
 * 用三组size的含义
 * 最大化时的size是桌面的size，只受桌面影响
 * 自己的常用size，外部可操纵
 * 动画期间的size
 * 如果只用一个size，被外部程序操纵，就会混乱
 * @param render 
 * @returns 
 */
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
		/**当前尺寸位置 */
		const sizeLocationCurrent={
			width(){
				if(sizeLocationAnimate.on()){
					return sizeLocationAnimate.width()
				}else{
					if(max()){
						return x.desktop.width()
					}else{
						return width()
					}
				}
			},
			height(){
				if(sizeLocationAnimate.on()){
					return sizeLocationAnimate.height()
				}else{
					if(max()){
						return x.desktop.height()
					}else{
						return height()
					}
				}
			},
			top(){
				if(sizeLocationAnimate.on()){
					return sizeLocationAnimate.top()
				}else{
					if(max()){
						return 0
					}else{
						return top()
					}
				}
			},
			left(){
				if(sizeLocationAnimate.on()){
					return sizeLocationAnimate.left()
				}else{
					if(max()){
						return 0
					}else{
						return left()
					}
				}
			}
		}
		const p=render({
			panel:x,
			contentHeight(){
				return sizeLocationCurrent.height()-titleHeight
			},
			contentWidth:sizeLocationCurrent.width
		})
		const max=p.max||mve.valueOf(false)
		const top=p.top||mve.valueOf(0)
		const left=p.left||mve.valueOf(0)
		const width=p.width||mve.valueOf(400)
		const height=p.height||mve.valueOf(600)
		//是否在max动画期间
		const sizeLocationAnimate={
			on:mve.valueOf(false),
			left:mve.valueOf(0),
			top:mve.valueOf(0),
			width:mve.valueOf(0),
			height:mve.valueOf(0)
		}
		return dom({
			type:"div",
			init(){
				//初始化
				targetAnimationOf({
					data:[
						{
							from:0,
							to:width(),
							value:sizeLocationAnimate.width
						},
						{
							from:0,
							to:height(),
							value:sizeLocationAnimate.height
						},
						{
							from:width()/2,
							to:left(),
							value:sizeLocationAnimate.left
						},
						{
							from:height()/2,
							to:top(),
							value:sizeLocationAnimate.top
						}
					],
					begin(){
						sizeLocationAnimate.on(true)
					},
					change:Tween.Cubic.easeIn,
					duration:300,
					end(){
						sizeLocationAnimate.on(false)
					}
				})
			},
			event:{
				mousedown:{
					capture:true,
					handler:x.bringToFront
				}
			},
			style:{
				overflow:"hidden",
				background:"white",
				"border-radius":"5px",
				position:"absolute",
				"z-index"(){
					return x.index()+""
				},
				"box-shadow":"rgb(102, 102, 102) 0px 0px 20px 5px",
				top(){
					return sizeLocationCurrent.top()+'px'
				},
				left(){
					return sizeLocationCurrent.left()+'px'
				},
				width(){
					return sizeLocationCurrent.width()+'px'
				},
				height(){
					return sizeLocationCurrent.height()+'px'
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
					maxClick(){
						if(max()){
							//缩小
							targetAnimationOf({
								data:[
									{
										from:sizeLocationCurrent.width(),
										to:width(),
										value:sizeLocationAnimate.width
									},
									{
										from:sizeLocationCurrent.height(),
										to:height(),
										value:sizeLocationAnimate.height
									},
									{
										from:sizeLocationCurrent.left(),
										to:left(),
										value:sizeLocationAnimate.left
									},
									{
										from:sizeLocationCurrent.top(),
										to:top(),
										value:sizeLocationAnimate.top
									}
								],
								begin(){
									sizeLocationAnimate.on(true)
								},
								change:Tween.Cubic.easeIn,
								duration:300,
								end(){
									sizeLocationAnimate.on(false)
									max(false)
								}
							})
						}else{
							//放大
							targetAnimationOf({
								data:[
									{
										from:sizeLocationCurrent.width(),
										to:x.desktop.width(),
										value:sizeLocationAnimate.width
									},
									{
										from:sizeLocationCurrent.height(),
										to:x.desktop.height(),
										value:sizeLocationAnimate.height
									},
									{
										from:sizeLocationCurrent.left(),
										to:0,
										value:sizeLocationAnimate.left
									},
									{
										from:sizeLocationCurrent.top(),
										to:0,
										value:sizeLocationAnimate.top
									}
								],
								begin(){
									sizeLocationAnimate.on(true)
								},
								change:Tween.Cubic.easeIn,
								duration:300,
								end(){
									sizeLocationAnimate.on(false)
									max(true)		
								}
							})
						}
					},
					hideMax: p.hideMax,
					closeClick(){
						targetAnimationOf({
							data:[
								{
									from:sizeLocationCurrent.width(),
									to:0,
									value:sizeLocationAnimate.width
								},
								{
									from:sizeLocationCurrent.height(),
									to:0,
									value:sizeLocationAnimate.height
								},
								{
									from:sizeLocationCurrent.left(),
									//to:0,
									to:sizeLocationCurrent.left() + (sizeLocationCurrent.width()/2),
									value:sizeLocationAnimate.left
								},
								{
									from:sizeLocationCurrent.top(),
									//to:0,
									to:sizeLocationCurrent.top() + (sizeLocationCurrent.height()/2),
									value:sizeLocationAnimate.top
								}
							],
							change:Tween.Cubic.easeOut,
							begin(){
								sizeLocationAnimate.on(true)
							},
							duration:300,
							end(){
								sizeLocationAnimate.on(false)
								x.remove()
							}
						})
					}
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