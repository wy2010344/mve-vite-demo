import{c as g,g as e,aR as m,y as b,H as C,p as w,q as T,t as v,aG as y,a as F,b as S,B as z,$ as h,aS as k,F as M,ak as N,am as D,aM as H,aj as E,C as u,aT as P}from"./index-DSI5ljsY.js";M.get(.08);const $=u.get(),V=u.get(100);function j(){const i=g(1e3),a=g(0);function s(){return a.get()%2==0?"原生":"惯性"}const p=g(0);e.div({className:r.title,children(){b`iScroll`,e.button({childrenType:"text",onClick(){c.scrollTop=0,o.set(0),a.set(a.get()+1)},children(){return s()}}),w(v,i.get,t=>{t<0||i.set(Math.round(t))},e.span({contentEditable:T,className:"min-w-1"})),e.span({childrenType:"text",children:"--"}),e.span({childrenType:"text",children(){return p.get().toFixed(2)}})}});const o=C(0);let l;const c=e.div({className(){return z(r.container,s()=="原生"?h`overflow-auto`:h`touch-none overflow-hidden`)},onPointerDown:y(function(){return o.stop(),{onMove(t,f){if(s()=="原生")return;function x(n){return p.set(n),console.log("v1",n),E({scroll:o,frictional:$.getFromVelocity(n),containerSize:c.clientHeight,contentSize:l.offsetHeight,edgeConfig(d){return console.log("v",d),V.getFromVelocity(d).animationConfig()},edgeBackConfig:P})}return N.from(t,{getPage:D,scrollDelta(n,d){H(o,n,c.clientHeight,l.offsetHeight)},onFinish:x})},onCancel(t){console.log("stop",t),o.stop()}}}),children(){l=e.div({className:r.content,s_transform(){return`translateY(${-o.get()}px)`},children(){F(()=>S(i.get(),k),(t,f)=>{e.div({className:r.row,childrenType:"text",children(){return`${t}---${f()}`}})})}})}});e.div({className:r.footer})}const r=m({title:`
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
