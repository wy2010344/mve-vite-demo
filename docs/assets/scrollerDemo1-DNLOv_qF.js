import{c as g,f as e,ae as m,r as b,o as w,n as v,u as y,v as T,af as C,a as S,B as u,F as x,ag as z,I as k,J as N,L as F,M as D,N as M}from"./index-DnGCQBT-.js";import{a as H,c as I}from"./index-BCG9UYdO.js";import"./canvasRender-CceJW0CL.js";const P=x.get(.004);x.get(.08);function A(){const a=g(1e3),s=g(0);function l(){return s.get()%2==0?"原生":"惯性"}const f=g(0);e.div({className:r.title,children(){b`iScroll`,e.button({childrenType:"text",onClick(){d.scrollTop=0,n.set(0),s.set(s.get()+1)},children(){return l()}}),H(v,a.get,t=>{t<0||a.set(Math.round(t))},e.span({contentEditable:I,className:"min-w-1"})),e.span({childrenType:"text",children:"--"}),e.span({childrenType:"text",children(){return f.get().toFixed(2)}})}});const n=w(0);let c;const d=e.div({className(){return S(r.container,l()=="原生"?u`overflow-auto`:u`touch-none overflow-hidden`)},onPointerDown:y(function(t,p){if(l()!="原生")return k.from(t,{getPage:N,scrollDelta(i,h){const o=n.getTarget();console.log("v",o,n.get()),n.set(o+M(o,i,d.clientHeight,c.offsetHeight))},onFinish(i){return f.set(i),P.destinationWithMarginIscroll({scroll:n,velocity:i,containerSize:d.clientHeight,contentSize:c.offsetHeight,edgeConfig(h){return D(h,{nextVelocity(o){return o*.93}})},edgeBackConfig:F})}})}),children(){c=e.div({className:r.content,s_transform(){return`translateY(${-n.get()}px)`},children(){T(()=>C(a.get(),z),(t,p)=>{e.div({className:r.row,childrenType:"text",children(){return`${t}---${p()}`}})})}})}});e.div({className:r.footer})}const r=m({title:`
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
    `});export{A as default};
