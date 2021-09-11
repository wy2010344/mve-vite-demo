import { dom } from "mve-dom";
import { dragResizePanel } from "../form";




export const 关于我=dragResizePanel(function(x){

	return {
		children:[
			dom({
				type:"div",
				style:{
					overflow:"auto",
					width(){
						return x.contentWidth()+'px'
					},
					height(){
						return x.contentHeight()+'px'
					}
				},
				children:[
					dom({
						type:"div",
						text:"中在",
						style:{
							width:"800px",
							height:"900px"
						}
					})
				]
			})
		]
	}
})