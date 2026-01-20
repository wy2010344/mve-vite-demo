import"./transform-DXPH_Bvq.js";import{c as U,o as I,e as F,$ as B,h as O,d as g,r as $,a0 as Y,a as H,a2 as W}from"./index-Bn6QTqXa.js";import{m as X,b,f as Z,a as G,d as Q,t as _,i as P,e as V,c as q}from"./forceLayout-D3y4hokx.js";import{o as z}from"./colors-CeGfSlBI.js";import{c as J}from"./category10-e3y2zw8r.js";import"./init-Gi6I4Gst.js";var D={},L={},E=34,S=10,R=13;function x(n){return new Function("d","return {"+n.map(function(i,t){return JSON.stringify(i)+": d["+t+'] || ""'}).join(",")+"}")}function rr(n,i){var t=x(n);return function(u,f){return i(t(u),f,n)}}function K(n){var i=Object.create(null),t=[];return n.forEach(function(u){for(var f in u)f in i||t.push(i[f]=f)}),t}function d(n,i){var t=n+"",u=t.length;return u<i?new Array(i-u+1).join(0)+t:t}function er(n){return n<0?"-"+d(-n,6):n>9999?"+"+d(n,6):d(n,4)}function nr(n){var i=n.getUTCHours(),t=n.getUTCMinutes(),u=n.getUTCSeconds(),f=n.getUTCMilliseconds();return isNaN(n)?"Invalid Date":er(n.getUTCFullYear())+"-"+d(n.getUTCMonth()+1,2)+"-"+d(n.getUTCDate(),2)+(f?"T"+d(i,2)+":"+d(t,2)+":"+d(u,2)+"."+d(f,3)+"Z":u?"T"+d(i,2)+":"+d(t,2)+":"+d(u,2)+"Z":t||i?"T"+d(i,2)+":"+d(t,2)+"Z":"")}function or(n){var i=new RegExp('["'+n+`
\r]`),t=n.charCodeAt(0);function u(e,s){var p,c,a=f(e,function(h,o){if(p)return p(h,o-1);c=h,p=s?rr(h,s):x(h)});return a.columns=c||[],a}function f(e,s){var p=[],c=e.length,a=0,h=0,o,r=c<=0,l=!1;e.charCodeAt(c-1)===S&&--c,e.charCodeAt(c-1)===R&&--c;function k(){if(r)return L;if(l)return l=!1,D;var A,T=a,m;if(e.charCodeAt(T)===E){for(;a++<c&&e.charCodeAt(a)!==E||e.charCodeAt(++a)===E;);return(A=a)>=c?r=!0:(m=e.charCodeAt(a++))===S?l=!0:m===R&&(l=!0,e.charCodeAt(a)===S&&++a),e.slice(T+1,A-1).replace(/""/g,'"')}for(;a<c;){if((m=e.charCodeAt(A=a++))===S)l=!0;else if(m===R)l=!0,e.charCodeAt(a)===S&&++a;else if(m!==t)continue;return e.slice(T,A)}return r=!0,e.slice(T,c)}for(;(o=k())!==L;){for(var y=[];o!==D&&o!==L;)y.push(o),o=k();s&&(y=s(y,h++))==null||p.push(y)}return p}function w(e,s){return e.map(function(p){return s.map(function(c){return M(p[c])}).join(n)})}function C(e,s){return s==null&&(s=K(e)),[s.map(M).join(n)].concat(w(e,s)).join(`
`)}function N(e,s){return s==null&&(s=K(e)),w(e,s).join(`
`)}function j(e){return e.map(v).join(`
`)}function v(e){return e.map(M).join(n)}function M(e){return e==null?"":e instanceof Date?nr(e):i.test(e+="")?'"'+e.replace(/"/g,'""')+'"':e}return{parse:u,parseRows:f,format:C,formatBody:N,formatRows:j,formatRow:v,formatValue:M}}var tr=or(","),ir=tr.parse;const sr=`source,target,type\r
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
Nokia,Qualcomm,suit`;function gr(){const n=ir(sr);console.log("data",n);const i=928,t=600,u=Array.from(new Set(n.map(o=>o.type))),f=z(u,J),w=U({nodes:Array.from(new Set(n.flatMap(o=>[o.source,o.target])),o=>({id:o})),links:n.map(o=>Object.create(o))}),C=2,N=I(o=>X({nodes:o?.nodes||F,links:o?.links||F,fromLinks:w.get().links,fromNodes:w.get().nodes,createForceNode(r,l,k){return Q(r,C,l,q,V)},getNodeKey(r){return r.id},getSorceKey(r){return r.source},getTargetKey(r){return r.target},createFromKey(r){return{id:r}}})),j=.001,v=B(P()),M=()=>v.alpha<j,e=b("x"),s=b("y"),p=G({getStrenth(o){return-400}}),c=Z();function a(){const o=N();_(C,v,o.nodes,r=>{c(o.links,C,r),p(o.nodes,C,r),e(o.nodes,r),s(o.nodes,r)})}O(M,function(o){if(!o)return H(()=>{a()})});const h=g.svg({width:i,height:t,viewBox:[-i/2,-t/2,i,t].join(" "),s_maxWidth:"100%",s_height:"auto",s_font:"12px sans-serif",children(){g.defs({children(){u.forEach(r=>{g.marker({id:`arrow-${r}`,viewBox:[0,-5,10,10].join(" "),refX:15,refY:-.5,markerWidth:6,markerHeight:6,orient:"auto",children(){g.path({fill:f(r),d:"M0,-5L10,0L0,5"})}})})}}),g.g({fill:"none",strokeWidth:1.5,children(){$(()=>N().links,function(r){g.path({markerEnd:`url(${new URL(`#arrow-${r.value.type}`,location.href)})`,stroke:f(r.value.type),d(){return o(r)}})})}}),g.g({fill:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",children(){$(()=>N().nodes,function(r){g.g({...Y(l=>{const k=h.getBoundingClientRect(),y=k.left+k.width/2,A=k.top+k.height/2;r.x.f=l.pageX-y,r.y.f=l.pageY-A,v.alphaTarget=.3,a();const T=W(m=>{m?(r.x.f=m.pageX-y,r.y.f=m.pageY-A):(r.x.f=void 0,r.y.f=void 0,v.alphaTarget=0,T())})}),transform(){return`translate(${r.x.d},${r.y.d})`},children(){g.circle({stroke:"white",strokeWidth:1.5,r:4}),g.text({x:8,y:"0.31em",children:r.value.id,fill:"none",stroke:"white",strokeWidth:3}),g.text({x:8,y:"0.31em",children:r.value.id})}})})}});function o(r){const l=Math.hypot(r.target.x.d-r.source.x.d,r.target.y.d-r.source.y.d);return`
    M${r.source.x.d},${r.source.y.d}
    A${l},${l} 0 0,1 ${r.target.x.d},${r.target.y.d}
  `}}})}export{gr as default};
