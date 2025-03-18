import{f as o,ag as h,i as g,F as p,p as f,o as x,ah as u,a6 as b,S as m,C as v,G as w,H as z}from"./index-BS7P0FCu.js";function S(){o.div({className:n.title,childrenType:"text",children:"iScroll"});const t=g(0);let i;const d=p.get(),r=o.div({className:n.container,onTouchMove(e){e.preventDefault()},onPointerDown:f(function(e,s){return m.from(e,{getPage:v,scrollDelta(a,c){const l=t.get();t.changeTo(l+z(l,a,r.clientHeight,i.offsetHeight))},onFinish(a){const c=d.destinationWithMarginIscroll({velocity:a,current:t.get(),containerSize:r.clientHeight,contentSize:i.offsetHeight});w(c,t)}})}),children(){i=o.div({className:n.content,s_transform(){return`translateY(${-t.get()}px)`},children(){x(()=>u(100,b),(e,s)=>{o.div({className:n.row,childrenType:"text",children(){return`${e}---${s()}`}})})}})}});o.div({className:n.footer})}const n=h({title:`
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
    `});export{S as default};
