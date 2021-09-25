

import { Tween, DrawOfBezier3, drawOfBezier3, tweenAnimationOf } from '../../../animate'
import { mve } from 'mve-core/util'
import { dom, idOf } from 'mve-dom/index'
import { ifChildren } from 'mve-core/ifChildren'
import { filterChildren } from 'mve-core/filterChildren'

const allTweens=Object.keys(Tween)
const allEasys=["easeIn","easeOut","easeInOut"]

export function selectAnimation(me:mve.LifeModel,call:(v)=>void){

  const currentTween=mve.valueOf(allTweens[0])
  const currentEase=mve.valueOf(null);

	function selectV(v:string){
		currentTween(v)
		const pkg=Tween[v]
		const ease=typeof(pkg)=='function'?pkg:Object.values(pkg)[0]
		currentEase(ease)
		call(ease)
	}

	const idAnimation=idOf("select-animation")
	const idAnimationType=idOf("select-animation-type")

	const easyList=me.Cache(function(){
		const pkg=Tween[currentTween()]
		return typeof(pkg)=='function'?[]:Object.entries(pkg)
	})
	return dom({
		type:"div",
		init(){
			selectV(allTweens[0])
		},
		children:[
			dom({
				type:"div",
				children:[
					dom({
						type:"h3",
						text:"内置动画类型"
					}),
					allTweens.map(function(tween){
						return dom({
							type:"span",
							children:[
								dom({
									type:"input",
									attr:{
										type:"radio",
										name:idAnimation
									},
									prop:{
										checked(){
											return currentTween()==tween
										}
									},
									event:{
										click(){
											selectV(tween)
										}
									}
								}),
								dom({
									type:"label",
									text:tween
								}),
							]
						})
					}),
					dom({
						type:"h3",text:"细分类型",
						style:{
							display(){
								return easyList().length==0?'none':''
							}
						}
					}),
					filterChildren(easyList,function(me,kv){
						return dom({
							type:"span",
							children:[
								dom({
									type:"input",
									attr:{
										type:"radio",
										name:idAnimationType
									},
									prop:{
										checked(){
											return currentEase()==kv[1]
										}
									},
									event:{
										click(){
											const ease=kv[1]
											currentEase(ease)
											call(ease)
										}
									}
								}),
								dom({
									type:"label",
									text:kv[0]
								})
							]
						})
					})
				]
			})
		]
	})
}