import { dom, domText } from "mve-dom";
import { dragResizePanel, DragResizePanelParam } from "../form";
import { mve } from 'mve-core/util'
import { fragment,EOChild } from "mve-core/childrenBuilder"




export function 初始绑定scrollTop或scrollLeft(x:DragResizePanelParam){
	const scrollTop=mve.atomValueOf(100)
	const scrollLeft=mve.atomValueOf(200)
	return fragment({
		children:[
			dom({
				type:"button",
				text:"向上滚动10px",
				event:{
					click(){
						scrollTop(scrollTop()+10)
					}
				}
			}),
			dom({
				type:"span",
				text(){
					return "scrollTop"+scrollTop()
				}
			}),
			dom({
				type:"button",
				text:"向左滚动10px",
				event:{
					click(){
						scrollLeft(scrollLeft()+10)
					}
				}
			}),
			dom({
				type:"span",
				text(){
					return "scrollLeft"+scrollLeft()
				}
			}),
			dom({
				type:"div",
				init(e){
					console.log(e.scrollTop,e.scrollLeft)
				},
				style:{
					overflow:"auto",
					width(){
						return 400+'px'
					},
					height(){
						return 500+'px'
					}
				},
				prop:{
					scrollLeft,
					scrollTop(){return scrollTop()}
				},
				children:[
					dom({
						type:"div",
						style:{
							width:"1000px",
							height:"900px"
						},
						children:[
							domText({
								text:`演示初始化绑定scrollTop和scrollLeft。父容器需要固定。`
							}),
							dom({
								type:"a",
								attr:{
									href:"https://gitee.com/wy2010344/mve-vite-demo/blob/master/src/desktop/index/初始绑定scrollTop或scrollLeft.ts"
								},
								text:"源码地址"
							})
						]
					})
				]
			})
		]
	})
}