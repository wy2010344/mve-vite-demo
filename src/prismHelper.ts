import { dom } from "mve-dom/index"
import { mve,run } from 'mve-core/util'
import {fragment } from 'mve-core/childrenBuilder'

const prismPrefix='https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/'


declare const Prism:typeof import("prismjs")


export function highlightElement(el:Element){
	Prism.highlightElement(el)
}
export const prismStyle=[
	'',"coy","dark","funky","okaidia","solarizedlight","tomorrow","twilight",
	//"a11y-dark","atom-dark","base16-ateliersulphurpool.light","cb","darcula","dracula","duotone-dark","duotone-earth","duotone-forest","duotone-light","duotone-sea","duotone-space","ghcolors","hopscotch","material-dark","material-light","material-oceanic","pojoaque","shades-of-purple","synthwave84","vs","xonokai"
] as const


export const currentPrismStyle=run(function(){
	const SAVELOCALEKEY='prismjs-theme'
	const style=mve.valueOf(localStorage.getItem(SAVELOCALEKEY)||'')
	return function(){
		if(arguments.length==0){
			return style()
		}else{
			const v=arguments[0]
			if(v!=style()){
				style(v)
				localStorage.setItem(SAVELOCALEKEY,v)
			}
		}
	} as mve.Value<typeof prismStyle[number]>
})

export function initPrism(){
	return fragment({
		children:[
			dom({
				type:"link",
				attr:{
					href(){
						const v=currentPrismStyle()
						const pv=v==''?'':`-${v}`
						return `${prismPrefix}themes/prism${pv}.css`
					},
					rel:"stylesheet"
				}
			}),
			dom({
				type:"script",
				attr:{
					src:`${prismPrefix}components/prism-core.min.js`
				}
			}),
			dom({
				type:"script",
				attr:{
					src:`${prismPrefix}plugins/autoloader/prism-autoloader.min.js`
				}
			})
		]
	})
}