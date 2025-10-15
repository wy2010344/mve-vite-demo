import{o as U}from"./transform-a71IrbW-.js";import{c as I,z as B,e as b,ar as O,d as Y,j as g,b as F,aq as H,g as W,as as X}from"./index-BNMIKCZr.js";import{m as Z,b as D,f as G,a as Q,c as _,t as q,i as z,e as P,d as V}from"./forceLayout-f7xtq5qb.js";import{c as J}from"./category10-W348WWuH.js";var $={},L={},E=34,j=10,R=13;function x(n){return new Function("d","return {"+n.map(function(i,o){return JSON.stringify(i)+": d["+o+'] || ""'}).join(",")+"}")}function rr(n,i){var o=x(n);return function(u,f){return i(o(u),f,n)}}function K(n){var i=Object.create(null),o=[];return n.forEach(function(u){for(var f in u)f in i||o.push(i[f]=f)}),o}function d(n,i){var o=n+"",u=o.length;return u<i?new Array(i-u+1).join(0)+o:o}function er(n){return n<0?"-"+d(-n,6):n>9999?"+"+d(n,6):d(n,4)}function nr(n){var i=n.getUTCHours(),o=n.getUTCMinutes(),u=n.getUTCSeconds(),f=n.getUTCMilliseconds();return isNaN(n)?"Invalid Date":er(n.getUTCFullYear())+"-"+d(n.getUTCMonth()+1,2)+"-"+d(n.getUTCDate(),2)+(f?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"."+d(f,3)+"Z":u?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"Z":o||i?"T"+d(i,2)+":"+d(o,2)+"Z":"")}function tr(n){var i=new RegExp('["'+n+`
\r]`),o=n.charCodeAt(0);function u(e,s){var p,c,a=f(e,function(h,t){if(p)return p(h,t-1);c=h,p=s?rr(h,s):x(h)});return a.columns=c||[],a}function f(e,s){var p=[],c=e.length,a=0,h=0,t,r=c<=0,l=!1;e.charCodeAt(c-1)===j&&--c,e.charCodeAt(c-1)===R&&--c;function k(){if(r)return L;if(l)return l=!1,$;var A,T=a,m;if(e.charCodeAt(T)===E){for(;a++<c&&e.charCodeAt(a)!==E||e.charCodeAt(++a)===E;);return(A=a)>=c?r=!0:(m=e.charCodeAt(a++))===j?l=!0:m===R&&(l=!0,e.charCodeAt(a)===j&&++a),e.slice(T+1,A-1).replace(/""/g,'"')}for(;a<c;){if((m=e.charCodeAt(A=a++))===j)l=!0;else if(m===R)l=!0,e.charCodeAt(a)===j&&++a;else if(m!==o)continue;return e.slice(T,A)}return r=!0,e.slice(T,c)}for(;(t=k())!==L;){for(var y=[];t!==$&&t!==L;)y.push(t),t=k();s&&(y=s(y,h++))==null||p.push(y)}return p}function w(e,s){return e.map(function(p){return s.map(function(c){return M(p[c])}).join(n)})}function C(e,s){return s==null&&(s=K(e)),[s.map(M).join(n)].concat(w(e,s)).join(`
`)}function N(e,s){return s==null&&(s=K(e)),w(e,s).join(`
`)}function S(e){return e.map(v).join(`
`)}function v(e){return e.map(M).join(n)}function M(e){return e==null?"":e instanceof Date?nr(e):i.test(e+="")?'"'+e.replace(/"/g,'""')+'"':e}return{parse:u,parseRows:f,format:C,formatBody:N,formatRows:S,formatRow:v,formatValue:M}}var or=tr(","),ir=or.parse;const sr=`source,target,type
Microsoft,Amazon,licensing
Microsoft,HTC,licensing
Samsung,Apple,suit
Motorola,Apple,suit
Nokia,Apple,resolved
HTC,Apple,suit
Kodak,Apple,suit
Microsoft,Barnes & Noble,suit
Microsoft,Foxconn,suit
Oracle,Google,suit
Apple,HTC,suit
Microsoft,Inventec,suit
Samsung,Kodak,resolved
LG,Kodak,resolved
RIM,Kodak,suit
Sony,LG,suit
Kodak,LG,resolved
Apple,Nokia,resolved
Qualcomm,Nokia,resolved
Apple,Motorola,suit
Microsoft,Motorola,suit
Motorola,Microsoft,suit
Huawei,ZTE,suit
Ericsson,ZTE,suit
Kodak,Samsung,resolved
Apple,Samsung,suit
Kodak,RIM,suit
Nokia,Qualcomm,suit`;function lr(){const n=ir(sr);console.log("data",n);const i=928,o=600,u=Array.from(new Set(n.map(t=>t.type))),f=U(u,J),w=I({nodes:Array.from(new Set(n.flatMap(t=>[t.source,t.target])),t=>({id:t})),links:n.map(t=>Object.create(t))}),C=2,N=B(t=>Z({nodes:t?.nodes||b,links:t?.links||b,fromLinks:w.get().links,fromNodes:w.get().nodes,createForceNode(r,l,k){return _(r,C,l,V,P)},getNodeKey(r){return r.id},getSorceKey(r){return r.source},getTargetKey(r){return r.target},createFromKey(r){return{id:r}}})),S=.001,v=O(z()),M=()=>v.alpha<S,e=D("x"),s=D("y"),p=Q({getStrenth(t){return-400}}),c=G();function a(){const t=N();q(C,v,t.nodes,r=>{c(t.links,C,r),p(t.nodes,C,r),e(t.nodes,r),s(t.nodes,r)})}Y(M,function(t){if(!t)return W(()=>{a()})});const h=g.svg({width:i,height:o,viewBox:[-i/2,-o/2,i,o].join(" "),s_maxWidth:"100%",s_height:"auto",s_font:"12px sans-serif",children(){g.defs({children(){u.forEach(r=>{g.marker({id:`arrow-${r}`,viewBox:[0,-5,10,10].join(" "),refX:15,refY:-.5,markerWidth:6,markerHeight:6,orient:"auto",children(){g.path({fill:f(r),d:"M0,-5L10,0L0,5"})}})})}}),g.g({fill:"none",strokeWidth:1.5,children(){F(()=>N().links,function(r){g.path({markerEnd:`url(${new URL(`#arrow-${r.value.type}`,location.href)})`,stroke:f(r.value.type),d(){return t(r)}})})}}),g.g({fill:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",children(){F(()=>N().nodes,function(r){g.g({...H(l=>{const k=h.getBoundingClientRect(),y=k.left+k.width/2,A=k.top+k.height/2;r.x.f=l.pageX-y,r.y.f=l.pageY-A,v.alphaTarget=.3,a();const T=X(m=>{m?(r.x.f=m.pageX-y,r.y.f=m.pageY-A):(r.x.f=void 0,r.y.f=void 0,v.alphaTarget=0,T())})}),transform(){return`translate(${r.x.d},${r.y.d})`},children(){g.circle({stroke:"white",strokeWidth:1.5,r:4}),g.text({x:8,y:"0.31em",children:r.value.id,fill:"none",stroke:"white",strokeWidth:3}),g.text({x:8,y:"0.31em",children:r.value.id})}})})}});function t(r){const l=Math.hypot(r.target.x.d-r.source.x.d,r.target.y.d-r.source.y.d);return`
    M${r.source.x.d},${r.source.y.d}
    A${l},${l} 0 0,1 ${r.target.x.d},${r.target.y.d}
  `}}})}export{lr as default};
