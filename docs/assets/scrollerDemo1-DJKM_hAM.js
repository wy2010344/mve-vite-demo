import{c as g,f as e,aJ as m,t as b,A as w,j as C,k as v,n as F,K as T,a as y,w as z,Z as h,F as S,Q as k,R as M,V as N,U as D,C as u,aK as E,aL as H,aM as P}from"./index-DzjyJcX9.js";S.get(.08);const V=u.get(),A=u.get(100);function $(){const i=g(1e3),a=g(0);function s(){return a.get()%2==0?"原生":"惯性"}const p=g(0);e.div({className:r.title,children(){b`iScroll`,e.button({childrenType:"text",onClick(){c.scrollTop=0,n.set(0),a.set(a.get()+1)},children(){return s()}}),C(F,i.get,t=>{t<0||i.set(Math.round(t))},e.span({contentEditable:v,className:"min-w-1"})),e.span({childrenType:"text",children:"--"}),e.span({childrenType:"text",children(){return p.get().toFixed(2)}})}});const n=w(0);let l;const c=e.div({className(){return z(r.container,s()=="原生"?h`overflow-auto`:h`touch-none overflow-hidden`)},onPointerDown:T(function(){return n.stop(),{onMove(t,f){if(s()=="原生")return;function x(o){return p.set(o),console.log("v1",o),D({scroll:n,frictional:V.getFromVelocity(o),containerSize:c.clientHeight,contentSize:l.offsetHeight,edgeConfig(d){return console.log("v",d),A.getFromVelocity(d).animationConfig()},edgeBackConfig:E})}return k.from(t,{getPage:M,scrollDelta(o,d){N(n,o,c.clientHeight,l.offsetHeight)},onFinish:x})},onCancel(t){console.log("stop",t),n.stop()}}}),children(){l=e.div({className:r.content,s_transform(){return`translateY(${-n.get()}px)`},children(){y(()=>H(i.get(),P),(t,f)=>{e.div({className:r.row,childrenType:"text",children(){return`${t}---${f()}`}})})}})}});e.div({className:r.footer})}const r=m({title:`
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
    `});export{$ as default};
