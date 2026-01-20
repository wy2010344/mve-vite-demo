import{c as g,f as t,ad as m,w as b,a8 as w,q as T,r as y,g as z,a9 as v,y as C,K as f,ae as F,F as S,aa as k,af as N,ac as D,ag as E,n as H}from"./index-Bn6QTqXa.js";import{b as M,c as P}from"./index-XVZQUbQ5.js";import"./canvasRender-DlxfwZGY.js";import"./_commonjsHelpers-CqkleIqs.js";S.get(.08);function A(){const s=g(1e3),c=g(0);function l(){return c.get()%2==0?"原生":"惯性"}const h=g(0);t.div({className:a.title,children(){b`iScroll`,t.button({childrenType:"text",onClick(){p.scrollTop=0,e.set(0),c.set(c.get()+1)},children(){return l()}}),M(T,s.get,o=>{o<0||s.set(Math.round(o))},t.span({contentEditable:P,className:"min-w-1"})),t.span({childrenType:"text",children:"--"}),t.span({childrenType:"text",children(){return h.get().toFixed(2)}})}});const e=w(0);let d;const p=t.div({className(){return C(a.container,l()=="原生"?f`overflow-auto`:f`touch-none overflow-hidden`)},onPointerDown(o){e.stop(),v(o,{onMove(n,Y){if(l()=="原生")return;function u(r){h.set(r),console.log("v1",r),E(e,{velocity:r,containerSize:p.clientHeight,contentSize:d.offsetHeight}).then(i=>{i&&e.changeTo(i.target,H({initialVelocity:i.velocity}))})}return k.from(n,{getPage:N,scrollDelta(r,i,x){D(e,r,p.clientHeight,d.offsetHeight),!x&&u(i)}})},onCancel(n){console.log("stop",n),e.stop()}})},children(){d=t.div({className:a.content,s_transform(){return`translateY(${-e.get()}px)`},children(){y(()=>z(s.get(),F),(o,n)=>{t.div({className:a.row,childrenType:"text",children(){return`${o}---${n()}`}})})}})}});t.div({className:a.footer})}const a=m({title:`
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
