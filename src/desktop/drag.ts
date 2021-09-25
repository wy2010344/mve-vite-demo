
function stopSelect(){
  document.body.style.webkitUserSelect = 'none';
  document.body.style["msUserSelect"] = 'none';
  document.body.style["mozUserSelect"] = 'none';
  document.body.style["user-select"]="none";
}
function canSelect(){
  document.body.style.webkitUserSelect = '';
  document.body.style["msUserSelect"]  = '';
  document.body.style["mozUserSelect"] = '';
  document.body.style["user-select"]="";
}
function diff(isX:boolean,e:MouseEvent,old_e:MouseEvent){
  if(isX){
    return e.clientX-old_e.clientX;
  }else{
    return e.clientY-old_e.clientY;
  }
}

export function dragMoveUtil(p:{
	border?:Node
	down?(e:MouseEvent):void
	move(e:MouseEvent):void
	up?(e:MouseEvent):void
	leave?(e:MouseEvent):void
}){
	let isMove=false
	function move(e:MouseEvent){
		if(isMove){
			p.move(e)
		}
	}
	function up(e:MouseEvent){
		canSelect()
		if(p.up){
			e=(e||window.event) as MouseEvent
			p.up(e)
		}
		destroy()
	}
	function leave(e:MouseEvent){
		canSelect()
		if(p.leave){
			e=(e||window.event) as MouseEvent
			p.leave(e)
		}
		destroy()
	}
	let div=p.border
	function init(){
		isMove=true
		addEvent(div,"mousemove",move);
		addEvent(div,"mouseup",up);
		addEvent(div,"mouseleave",leave);
	}
	function destroy(){
		isMove=false
		removeEvent(div,"mousemove",move);
		removeEvent(div,"mouseup",up);
		removeEvent(div,"mouseleave",leave);
	}
	return function(e:MouseEvent){
		stopSelect()
		e=(e||window.event) as MouseEvent
		if(!div){
			div=e.target as Node
		}
		if(p.down){
			p.down(e)
		}
		init()
	}
}
export interface DragMoveHelperParam{
  border?:Node
	init?(e:MouseEvent):void
  allow?():boolean
	diff?(v:{x:number,y:number,e:MouseEvent}):void
	diffX?(x:number):void
	diffY?(y:number):void
  cancel?(e:MouseEvent):void
}
/**
 * 只移动
 * @param p 
 */
export function dragMoveHelper(p:DragMoveHelperParam){
  let laste;
	const allow=p.allow||function(){return true};
	const diffPool:((x:number,y:number,e:MouseEvent)=>void)[]=[]
	if(p.diff){
		diffPool.push(function(x,y,e){
			p.diff({x,y,e})
		})
	}
	if(p.diffX){
		diffPool.push(function(x,y){
			if(x!=0){
				p.diffX(x)
			}
		})
	}
	if(p.diffY){
		diffPool.push(function(x,y){
			if(y!=0){
				p.diffY(y)
			}
		})
	}
	function cancel(e:MouseEvent){
		e=(e||window.event) as MouseEvent
		if(p.cancel){
			p.cancel(e)
		}
		preventDefault(e)
		stopPropagation(e)
	}
	return dragMoveUtil({
		border:p.border||document,
		down(e){
			e=(e||window.event) as MouseEvent
			laste=e
			if(p.init){
				p.init(e)
			}
			preventDefault(e)
			stopPropagation(e)
		},
		move(e){
			if(allow()){
				e=(e||window.event) as MouseEvent
				const x=e.clientX-laste.clientX
				const y=e.clientY-laste.clientY
				for(let diff of diffPool){
					diff(x,y,e)
				}
				laste=e
				preventDefault(e)
				stopPropagation(e)
			}
		},
		up:cancel,
		leave:cancel
	})
}


export interface Direction{
  l?:boolean,
  r?:boolean,
  t?:boolean,
  b?:boolean
}
type TEvent={
  event:MouseEvent,
  dir:Direction
}
import { mve } from 'mve-core/util'
/**
 * 主要是拖拽放大。拖动只是辅助。如果只有拖动，不如另写
 * @param p 
 */
export function dragResizeHelper(p:{
  border?:Node;
  forbidden?:mve.TValue<boolean>;
  addLeft(x:number):void
  addTop(x:number):void,
  addWidth(x:number):void,
  addHeight(x:number):void
}){
  let event:TEvent=null
	const forbidden=mve.valueOrCall(p.forbidden)
  const m={
    cancel(e){
      event=null;
			canSelect();
			destroy()
    },
    move(e){
      if(!forbidden()){
				const old_e=event.event as MouseEvent;
				e=e||window.event;
				event.event=e;
				const x=diff(true,e,old_e);
				const y=diff(false,e,old_e);
				if(x!=0){
					if(event.dir.l){
						p.addLeft(x)
						p.addWidth(-x)
					}
					if(event.dir.r){
						p.addWidth(x)
					}
				}
				if(y!=0){
					if (event.dir.t){
						p.addTop(y)
						p.addHeight(-y)
					}
					if(event.dir.b){
						p.addHeight(y)
					}
				}
      }
    }
  };
  //最大边界，一般是document
	const border=p.border||document;
	
	function init(){
		addEvent(border,"mousemove",m.move);
		addEvent(border,"mouseup",m.cancel);
		addEvent(border,"mouseleave",m.cancel);
	}
	function destroy(){
		removeEvent(border,"mousemove",m.move);
		removeEvent(border,"mouseup",m.cancel);
		removeEvent(border,"mouseleave",m.cancel);
	}
	return function(e:MouseEvent,dir:Direction){
		stopSelect();
		event={
			event:e,
			dir:dir
		}
		init()
	}
}

function addEvent(v:Node,name:string,fun:(e:any)=>void){
	v.addEventListener(name,fun)
}
function removeEvent(v:Node,name:string,fun:(e:any)=>void){
	v.removeEventListener(name,fun)
}
function preventDefault(e:Event){
	e.preventDefault()
}

function stopPropagation(e:Event){
	e.stopPropagation()
}