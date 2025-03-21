import{f as n,ac as f,l as x,F as c,q as u,u as b,ad as m,a4 as v,S as w,H as y,ae as z,K as k,s as S}from"./index-B2-PbFlA.js";c.get();c.get(.08);function F(){n.div({className:i.title,childrenType:"text",children:"iScroll"});const e=x(0);let r;c.get();const d=n.div({className:i.container,onTouchMove(t){t.preventDefault()},onPointerDown:u(function(t,g){return w.from(t,{getPage:y,scrollDelta(l,s){const o=e.get();e.set(o+k(o,l,d.clientHeight,r.offsetHeight))},onFinish(l){let s=0,o=0,h=!1;e.change(z({velocity:l,containerSize:d.clientHeight,contentSize:r.offsetHeight,onBack(a,p){h=!0,s=a,o=p}})).then(a=>{console.log("🆚",a),a&&h&&e.changeTo(s,S({initialVelocity:o}))})}})}),children(){r=n.div({className:i.content,s_transform(){return`translateY(${-e.get()}px)`},children(){b(()=>m(100,v),(t,g)=>{n.div({className:i.row,childrenType:"text",children(){return`${t}---${g()}`}})})}})}});n.div({className:i.footer})}const i=f({title:`
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
		overflow: hidden;
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
    `});export{F as default};
