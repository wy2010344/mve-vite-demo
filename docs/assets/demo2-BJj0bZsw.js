import{f as h}from"./chunk-LSEVNFON-G8OzWBoO.js";import{c as x,N as u,L as K,U as M,b as X,O as Y,M as c,n as w,h as C,P as I,Q as m,u as k,R,T as W}from"./index-B2-PbFlA.js";import{m as $,f as B,a as E,b as p,t as P,e as z,d as b,c as O}from"./forceLayout-B4nwBeeE.js";const S=800,D=800,q=.001;let H=0;function G(){const l=x(u),o=x(u),i=x(void 0);K(M(document,"keydown",t=>{if(t.key=="Enter"){const e=i.get();e&&(i.set(void 0),l.set(l.get().filter(s=>s.value!=e.value)),o.set(o.get().filter(s=>s.source!=e.value&&s.target!=e.value)),g())}}));const f=X(t=>$({nodes:(t==null?void 0:t.nodes)||u,links:(t==null?void 0:t.links)||u,fromLinks:o.get(),fromNodes:l.get(),createForceNode(e,s,r){return{index:s,x:b(e.x),y:b(e.y),z,value:e}},getNodeKey(e){return e.value},getSorceKey(e){return e.source},getTargetKey(e){return e.target},createFromKey(e){return{value:e,color:h.color.rgb(),x:0,y:0}}})),n=Y(O()),F=()=>n.alpha<q,L=B(),T=E(),_=p("x"),N=p("y");function g(){const t=f();P(n,t.nodes,e=>{L(t.links,n.nDim,e),T(t.nodes,n.nDim,e),_(t.nodes,e),N(t.nodes,e)})}const d=c.svg({width:S,height:D,viewBox:`${-800/2} ${-800/2} ${S} ${D}`,s_maxWidth:"100%",s_height:"auto",s_boxSizing:"content-box",s_border:"10px solid gray",s_userSelect:"none",onClick(t){const e={value:H++,color:h.color.rgb(),x:t.offsetX-d.clientWidth/2,y:t.offsetY-d.clientHeight/2};l.set([...l.get(),e]),i.set(e),g(),m()},children(){let t=C;w(F,e=>{if(e){t();return}t=I(()=>{g(),m()})}),k(()=>f().links,e=>c.g({stroke:"#999",strokeOpacity:.6,children(){c.line({x1:e.source.x.dSignal.get,y1:e.source.y.dSignal.get,x2:e.target.x.dSignal.get,y2:e.target.y.dSignal.get,strokeWidth:1})}})),k(()=>f().nodes,e=>c.g({stroke:"#fff",strokeWidth:1.5,onClick(s){s.stopPropagation();const r=i.get();if(s.shiftKey){if(r&&r!=e.value){if(o.get().findIndex(a=>a.source==r.value&&a.target==e.value.value)<0)o.set([...o.get(),{source:r.value,target:e.value.value}]);else{const a=o.get().slice();o.set(a)}g()}}else r==e.value?i.set(void 0):i.set(e.value)},...R(s=>{const r=d.getBoundingClientRect(),y=r.left+r.width/2,a=r.top+r.height/2;e.x.f=s.pageX-y,e.y.f=s.pageY-a,n.alphaTarget=.3,g();const A=W(v=>{v?(e.x.f=v.pageX-y,e.y.f=v.pageY-a):(e.x.f=void 0,e.y.f=void 0,n.alphaTarget=0,A())})}),children(){c.circle({r:5,cx:e.x.dSignal.get,cy:e.y.dSignal.get,s_outline(){return i.get()==e.value?"1px solid blue":""},s_borderRadius:"50%",fill:e.value.color}),c.text({x:e.x.dSignal.get,y:e.y.dSignal.get,stroke:e.value.color,childrenType:"text",children:e.value.value+""})}}))}})}export{G as default};
