import{c as g,f as e,aH as b,K as m,R as w,C as T,D as z,E as C,b as v,k as y,aD as k,N as D,a7 as f,aI as E,F,aE as N,aJ as S,aG as H,aK as M,z as P}from"./index-CnmbM-dR.js";F.get(.08);function G(){const s=g(1e3),l=g(0);function c(){return l.get()%2==0?"原生":"惯性"}const h=g(0);e.div({className:a.title,children(){m`iScroll`,e.button({childrenType:"text",onClick(){p.scrollTop=0,t.set(0),l.set(l.get()+1)},children(){return c()}}),T(C,s.get,o=>{o<0||s.set(Math.round(o))},e.span({contentEditable:z,className:"min-w-1"})),e.span({childrenType:"text",children:"--"}),e.span({childrenType:"text",children(){return h.get().toFixed(2)}})}});const t=w(0);let d;const p=e.div({className(){return D(a.container,c()=="原生"?f`overflow-auto`:f`touch-none overflow-hidden`)},onPointerDown(o){t.stop(),k(o,{onMove(n,Y){if(c()=="原生")return;function u(r){h.set(r),console.log("v1",r),M(t,{velocity:r,containerSize:p.clientHeight,contentSize:d.offsetHeight}).then(i=>{i&&t.changeTo(i.target,P({initialVelocity:i.velocity}))})}return N.from(n,{getPage:S,scrollDelta(r,i,x){H(t,r,p.clientHeight,d.offsetHeight),!x&&u(i)}})},onCancel(n){console.log("stop",n),t.stop()}})},children(){d=e.div({className:a.content,s_transform(){return`translateY(${-t.get()}px)`},children(){v(()=>y(s.get(),E),(o,n)=>{e.div({className:a.row,childrenType:"text",children(){return`${o}---${n()}`}})})}})}});e.div({className:a.footer})}const a=b({title:`
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
    `});export{G as default};
