import"./transform-uVWauMWc.js";import{P as I,aV as U,a7 as R,bI as B,aO as O,aj as g,bd as F,a4 as Y,bF as H,bD as W}from"./index-BrILyg7S.js";import{h as X,a as D,b as Z,d as G,g as P,t as Q,i as V,e as _,c as q}from"./forceLayout-BCD8KVRK.js";import{o as z}from"./colors-CeGfSlBI.js";import{c as J}from"./category10-e3y2zw8r.js";import"./init-Gi6I4Gst.js";var $={},b={},L=34,j=10,E=13;function x(n){return new Function("d","return {"+n.map(function(i,o){return JSON.stringify(i)+": d["+o+'] || ""'}).join(",")+"}")}function rr(n,i){var o=x(n);return function(u,f){return i(o(u),f,n)}}function K(n){var i=Object.create(null),o=[];return n.forEach(function(u){for(var f in u)f in i||o.push(i[f]=f)}),o}function d(n,i){var o=n+"",u=o.length;return u<i?new Array(i-u+1).join(0)+o:o}function er(n){return n<0?"-"+d(-n,6):n>9999?"+"+d(n,6):d(n,4)}function nr(n){var i=n.getUTCHours(),o=n.getUTCMinutes(),u=n.getUTCSeconds(),f=n.getUTCMilliseconds();return isNaN(n)?"Invalid Date":er(n.getUTCFullYear())+"-"+d(n.getUTCMonth()+1,2)+"-"+d(n.getUTCDate(),2)+(f?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"."+d(f,3)+"Z":u?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"Z":o||i?"T"+d(i,2)+":"+d(o,2)+"Z":"")}function tr(n){var i=new RegExp('["'+n+`
\r]`),o=n.charCodeAt(0);function u(e,s){var p,c,a=f(e,function(h,t){if(p)return p(h,t-1);c=h,p=s?rr(h,s):x(h)});return a.columns=c||[],a}function f(e,s){var p=[],c=e.length,a=0,h=0,t,r=c<=0,l=!1;e.charCodeAt(c-1)===j&&--c,e.charCodeAt(c-1)===E&&--c;function k(){if(r)return b;if(l)return l=!1,$;var A,T=a,m;if(e.charCodeAt(T)===L){for(;a++<c&&e.charCodeAt(a)!==L||e.charCodeAt(++a)===L;);return(A=a)>=c?r=!0:(m=e.charCodeAt(a++))===j?l=!0:m===E&&(l=!0,e.charCodeAt(a)===j&&++a),e.slice(T+1,A-1).replace(/""/g,'"')}for(;a<c;){if((m=e.charCodeAt(A=a++))===j)l=!0;else if(m===E)l=!0,e.charCodeAt(a)===j&&++a;else if(m!==o)continue;return e.slice(T,A)}return r=!0,e.slice(T,c)}for(;(t=k())!==b;){for(var y=[];t!==$&&t!==b;)y.push(t),t=k();s&&(y=s(y,h++))==null||p.push(y)}return p}function w(e,s){return e.map(function(p){return s.map(function(c){return M(p[c])}).join(n)})}function C(e,s){return s==null&&(s=K(e)),[s.map(M).join(n)].concat(w(e,s)).join(`
`)}function N(e,s){return s==null&&(s=K(e)),w(e,s).join(`
`)}function S(e){return e.map(v).join(`
`)}function v(e){return e.map(M).join(n)}function M(e){return e==null?"":e instanceof Date?nr(e):i.test(e+="")?'"'+e.replace(/"/g,'""')+'"':e}return{parse:u,parseRows:f,format:C,formatBody:N,formatRows:S,formatRow:v,formatValue:M}}var or=tr(","),ir=or.parse;const sr=`source,target,type\r
Microsoft,Amazon,licensing\r
Microsoft,HTC,licensing\r
Samsung,Apple,suit\r
Motorola,Apple,suit\r
Nokia,Apple,resolved\r
HTC,Apple,suit\r
Kodak,Apple,suit\r
Microsoft,Barnes & Noble,suit\r
Microsoft,Foxconn,suit\r
Oracle,Google,suit\r
Apple,HTC,suit\r
Microsoft,Inventec,suit\r
Samsung,Kodak,resolved\r
LG,Kodak,resolved\r
RIM,Kodak,suit\r
Sony,LG,suit\r
Kodak,LG,resolved\r
Apple,Nokia,resolved\r
Qualcomm,Nokia,resolved\r
Apple,Motorola,suit\r
Microsoft,Motorola,suit\r
Motorola,Microsoft,suit\r
Huawei,ZTE,suit\r
Ericsson,ZTE,suit\r
Kodak,Samsung,resolved\r
Apple,Samsung,suit\r
Kodak,RIM,suit\r
Nokia,Qualcomm,suit`;function gr(){const n=ir(sr);console.log("data",n);const i=928,o=600,u=Array.from(new Set(n.map(t=>t.type))),f=z(u,J),w=I({nodes:Array.from(new Set(n.flatMap(t=>[t.source,t.target])),t=>({id:t})),links:n.map(t=>Object.create(t))}),C=2,N=U(t=>X({nodes:t?.nodes||R,links:t?.links||R,fromLinks:w.get().links,fromNodes:w.get().nodes,createForceNode(r,l,k){return P(r,C,l,q,_)},getNodeKey(r){return r.id},getSorceKey(r){return r.source},getTargetKey(r){return r.target},createFromKey(r){return{id:r}}})),S=.001,v=B(V()),M=()=>v.alpha<S,e=D("x"),s=D("y"),p=G({getStrenth(t){return-400}}),c=Z();function a(){const t=N();Q(C,v,t.nodes,r=>{c(t.links,C,r),p(t.nodes,C,r),e(t.nodes,r),s(t.nodes,r)})}O(M,function(t){if(!t)return H(()=>{a()})});const h=g.svg({width:i,height:o,viewBox:[-i/2,-o/2,i,o].join(" "),s_maxWidth:"100%",s_height:"auto",s_font:"12px sans-serif",children(){g.defs({children(){u.forEach(r=>{g.marker({id:`arrow-${r}`,viewBox:[0,-5,10,10].join(" "),refX:15,refY:-.5,markerWidth:6,markerHeight:6,orient:"auto",children(){g.path({fill:f(r),d:"M0,-5L10,0L0,5"})}})})}}),g.g({fill:"none",strokeWidth:1.5,children(){F(()=>N().links,function(r){g.path({markerEnd:`url(${new URL(`#arrow-${r.value.type}`,location.href)})`,stroke:f(r.value.type),d(){return t(r)}})})}}),g.g({fill:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",children(){F(()=>N().nodes,function(r){g.g({...Y(l=>{const k=h.getBoundingClientRect(),y=k.left+k.width/2,A=k.top+k.height/2;r.x.f=l.pageX-y,r.y.f=l.pageY-A,v.alphaTarget=.3,a();const T=W(m=>{m?(r.x.f=m.pageX-y,r.y.f=m.pageY-A):(r.x.f=void 0,r.y.f=void 0,v.alphaTarget=0,T())})}),transform(){return`translate(${r.x.d},${r.y.d})`},children(){g.circle({stroke:"white",strokeWidth:1.5,r:4}),g.text({x:8,y:"0.31em",children:r.value.id,fill:"none",stroke:"white",strokeWidth:3}),g.text({x:8,y:"0.31em",children:r.value.id})}})})}});function t(r){const l=Math.hypot(r.target.x.d-r.source.x.d,r.target.y.d-r.source.y.d);return`
    M${r.source.x.d},${r.source.y.d}
    A${l},${l} 0 0,1 ${r.target.x.d},${r.target.y.d}
  `}}})}export{gr as default};
