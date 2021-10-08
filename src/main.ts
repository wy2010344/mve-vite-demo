import { clsOf, dom } from "mve-dom/index"
import { orRun } from "mve-core/util"
import { rootRoute } from "./index"
import { initPrism } from "./prismHelper"
import {locationHashBind} from 'mve-dom/router'
const topAreaCls=clsOf("topArea")

const root=dom.root(function(me){
	return {
		type:"div",
		children:[
			initPrism(),
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

locationHashBind(rootRoute)

document.body.appendChild(root.element)

const destroy=orRun(root.init)
if(destroy){
	window.addEventListener("unload",destroy)
}