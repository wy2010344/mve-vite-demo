import{c as p,g as e,aQ as x,y as b,H as m,p as w,q as T,t as y,aM as v,a as z,b as C,B as S,a4 as f,aR as F,F as N,aN as k,aS as D,aP as E,aT as H,l as M}from"./index-8-4crGqb.js";N.get(.08);function Y(){const a=p(1e3),s=p(0);function l(){return s.get()%2==0?"原生":"惯性"}const g=p(0);e.div({className:r.title,children(){b`iScroll`,e.button({childrenType:"text",onClick(){d.scrollTop=0,o.set(0),s.set(s.get()+1)},children(){return l()}}),w(y,a.get,t=>{t<0||a.set(Math.round(t))},e.span({contentEditable:T,className:"min-w-1"})),e.span({childrenType:"text",children:"--"}),e.span({childrenType:"text",children(){return g.get().toFixed(2)}})}});const o=m(0);let c;const d=e.div({className(){return S(r.container,l()=="原生"?f`overflow-auto`:f`touch-none overflow-hidden`)},onPointerDown:v(function(){return o.stop(),{onMove(t,h){if(l()=="原生")return;function u(n){g.set(n),console.log("v1",n),H(o,{velocity:n,containerSize:d.clientHeight,contentSize:c.offsetHeight}).then(i=>{i&&o.changeTo(i.target,M({initialVelocity:i.velocity}))})}return k.from(t,{getPage:D,scrollDelta(n,i){E(o,n,d.clientHeight,c.offsetHeight)},onFinish:u})},onCancel(t){console.log("stop",t),o.stop()}}}),children(){c=e.div({className:r.content,s_transform(){return`translateY(${-o.get()}px)`},children(){z(()=>C(a.get(),F),(t,h)=>{e.div({className:r.row,childrenType:"text",children(){return`${t}---${h()}`}})})}})}});e.div({className:r.footer})}const r=x({title:`
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
    `});export{Y as default};
