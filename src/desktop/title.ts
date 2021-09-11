import { dom, ItemValue } from "mve-dom";
import {mve} from 'mve-core/util'

export function buildTitle(p:{
	height:number,
  move(e:Event):void,
  hideClose:mve.TValue<boolean>,
  closeClick?(e:Event):void;
  max:mve.Value<Boolean>;
  hideMax:mve.TValue<boolean>;
  title?:ItemValue;
}){
	const hideClose=mve.valueOrCall(p.hideClose)
	const hideMax=mve.valueOrCall(p.hideMax)
  return dom({
    type:"div",
    style:{
      "background-image":"linear-gradient(180deg, #e6e6e6, #bab9ba)",
      cursor:"move",
			"border-radius":"5px 5px 0 0",
			"white-space":"nowrap",
			height:p.height-1+"px",
			"line-height":p.height-1+"px",
			"border-bottom":"1px solid #696969",
			display:"flex",
			"align-items":"center"
    },
    event:{
      mousedown(e){
        p.move(e||window.event);
      }
    },
    children:[
      /*按钮部分*/                              
      dom({
        type:"div",
        style:{
          width:"20px",
          height:"20px",
          cursor:"pointer",
          backgroundColor:"#1600ff",
					"border-radius":"5px",
					"margin-left":"5px",
					"text-align":"center",
					"line-height":"20px",
					color:"#e4e0df",
          display(){
            return hideClose()?"none":"inline-block";
          }
        },
				text:"X",
        event:{
          mousedown(e:MouseEvent){
						e.stopPropagation()
          },
          click:p.closeClick
        }
      }),
      dom({
        type:"div",
        style:{
          width:"20px",
          height:"20px",
          cursor:"pointer",
          backgroundColor:"green",
					"border-radius":"5px",
					"margin-left":"5px",
					"text-align":"center",
					"line-height":"20px",
					color:"#f2ff2f",
          display(){
						return hideMax()?"none":"inline-block";
          }
        },
				text(){
					return p.max()?"o":"O"
				},
        event:{
          mousedown(e){
            e.stopPropagation(e)
          },
          click(){
            p.max(!p.max());
          }
        }
      }),
      /*标题部分*/
      dom({
        type:"div",
        style:{
					"font-weight":"bold",
					"text-indent"(){
						let i=0
						if(hideClose()){
							i-=20
						}
						if(hideMax()){
							i-=20
						}
						return i+"px"
					},
					"font-size":"15px",
					"text-align":"center",
          display:"inline",
          "margin":"0 5px",
          color:"#645d61",
					flex:1,
					overflow:"hidden",
					"text-overflow":"ellipsis",
        },
        text:p.title
      })
    ]
  })
}