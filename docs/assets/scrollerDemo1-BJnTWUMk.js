import{c as g,g as t,as as m,m as b,B as w,j as C,k as S,n as T,H as v,b as y,at as z,l as F,O as u,au as k,F as N,V as D,X as H,_ as M,C as x,$ as P,a0 as V}from"./index-C09L67qZ.js";N.get(.08);const $=x.get(),E=x.get(100);function j(){const i=g(1e3),a=g(0);function s(){return a.get()%2==0?"原生":"惯性"}const f=g(0);t.div({className:r.title,children(){b`iScroll`,t.button({childrenType:"text",onClick(){c.scrollTop=0,n.set(0),a.set(a.get()+1)},children(){return s()}}),C(T,i.get,e=>{e<0||i.set(Math.round(e))},t.span({contentEditable:S,className:"min-w-1"})),t.span({childrenType:"text",children:"--"}),t.span({childrenType:"text",children(){return f.get().toFixed(2)}})}});const n=w(0);let l;const c=t.div({className(){return F(r.container,s()=="原生"?u`overflow-auto`:u`touch-none overflow-hidden`)},onPointerDown:v(function(e,p){if(s()!="原生")return D.from(e,{getPage:H,scrollDelta(o,d){const h=n.getTarget();n.set(h+V(h,o,c.clientHeight,l.offsetHeight))},onFinish(o){return f.set(o),console.log("v1",o),M({scroll:n,frictional:$.getFromVelocity(o),containerSize:c.clientHeight,contentSize:l.offsetHeight,edgeConfig(d){return console.log("v",d),E.getFromVelocity(d).animationConfig()},edgeBackConfig:P})}})}),children(){l=t.div({className:r.content,s_transform(){return`translateY(${-n.get()}px)`},children(){y(()=>z(i.get(),k),(e,p)=>{t.div({className:r.row,childrenType:"text",children(){return`${e}---${p()}`}})})}})}});t.div({className:r.footer})}const r=m({title:`
	position: absolute;
	z-index: 2;
	top: 0;
	left: 0;
	width: 100%;
	height: 45px;
	line-height: 45px;
	background: #CD235C;
	padding: 0;
	color: #eee;
	font-size: 20px;
	text-align: center;
	font-weight: bold;
  `,container:`
    position: absolute;
		z-index: 1;
		top: 45px;
		bottom: 48px;
		left: 0;
		width: 100%;
		background: #ccc;
    `,content:`
      	position: absolute;
				z-index: 1;
				-webkit-tap-highlight-color: rgba(0,0,0,0);
				width: 100%;
				transform: translateZ(0);
				user-select: none;
				text-size-adjust: none;`,row:`       	
  padding: 0 10px;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #ccc;
	border-top: 1px solid #fff;
	background-color: #fafafa;
	font-size: 14px;
  `,footer:`
    position: absolute;
		z-index: 2;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 48px;
		background: #444;
		padding: 0;
		border-top: 1px solid #444;
    `});export{j as default};
