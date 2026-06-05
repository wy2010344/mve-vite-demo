import{P as g,ah as t,bo as x,a$ as m,k as w,bd as T,m as y,b6 as z,y as v,bL as f,b8 as C,R as S,F as k,S as F,ab as N,by as D,bx as E,bB as P}from"./index-BrILyg7S.js";import{t as H,d as M}from"./index-rf6E0FyH.js";import"./canvasRender-Ds5PwtYp.js";import"./_commonjsHelpers-CqkleIqs.js";import"./layout-SKuJvode.js";k.get(.08);function B(){const s=g(1e3),l=g(0);function c(){return l.get()%2==0?"原生":"惯性"}const h=g(0);t.div({className:a.title,children(){x`iScroll`,t.button({childrenType:"text",onClick(){p.scrollTop=0,e.set(0),l.set(l.get()+1)},children(){return c()}}),H(m,s.get,o=>{o<0||s.set(Math.round(o))},t.span({contentEditable:M,className:"min-w-1"})),t.span({childrenType:"text",children:"--"}),t.span({childrenType:"text",children(){return h.get().toFixed(2)}})}});const e=w(0);let d;const p=t.div({className(){return v(a.container,c()=="原生"?f`overflow-auto`:f`touch-none overflow-hidden`)},onPointerDown(o){e.stop(),z(o,{onMove(n,$){if(c()=="原生")return;function b(r){h.set(r),console.log("v1",r),E(e,{velocity:r,containerSize:p.clientHeight,contentSize:d.offsetHeight}).then(i=>{i&&e.changeTo(i.target,P({initialVelocity:i.velocity}))})}return F.from(n,{getPage:N,scrollDelta(r,i,u){D(e,r,p.clientHeight,d.offsetHeight),!u&&b(i)}})},onCancel(n){console.log("stop",n),e.stop()}})},children(){d=t.div({className:a.content,s_transform(){return`translateY(${-e.get()}px)`},children(){T(()=>y(s.get(),C),(o,n)=>{t.div({className:a.row,childrenType:"text",children(){return`${o}---${n()}`}})})}})}});t.div({className:a.footer})}const a=S({title:`
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
    `});export{B as default};
