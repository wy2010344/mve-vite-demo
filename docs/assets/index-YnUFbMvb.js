import"./transform-uVWauMWc.js";import{Q as U,aQ as I,a9 as R,bE as B,aK as O,ak as g,b9 as F,bz as Y,a6 as H,bx as W}from"./index-BCxd8sac.js";import{h as Q,a as D,b as X,d as Z,t as G,g as _,i as z,e as P,c as V}from"./forceLayout-CYqp-cPZ.js";import{o as q}from"./colors-CeGfSlBI.js";import{c as J}from"./category10-e3y2zw8r.js";import"./init-Gi6I4Gst.js";var K={},j={},E=34,S=10,L=13;function x(n){return new Function("d","return {"+n.map(function(i,o){return JSON.stringify(i)+": d["+o+'] || ""'}).join(",")+"}")}function rr(n,i){var o=x(n);return function(u,f){return i(o(u),f,n)}}function $(n){var i=Object.create(null),o=[];return n.forEach(function(u){for(var f in u)f in i||o.push(i[f]=f)}),o}function d(n,i){var o=n+"",u=o.length;return u<i?new Array(i-u+1).join(0)+o:o}function er(n){return n<0?"-"+d(-n,6):n>9999?"+"+d(n,6):d(n,4)}function nr(n){var i=n.getUTCHours(),o=n.getUTCMinutes(),u=n.getUTCSeconds(),f=n.getUTCMilliseconds();return isNaN(n)?"Invalid Date":er(n.getUTCFullYear())+"-"+d(n.getUTCMonth()+1,2)+"-"+d(n.getUTCDate(),2)+(f?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"."+d(f,3)+"Z":u?"T"+d(i,2)+":"+d(o,2)+":"+d(u,2)+"Z":o||i?"T"+d(i,2)+":"+d(o,2)+"Z":"")}function tr(n){var i=new RegExp('["'+n+`
\r]`),o=n.charCodeAt(0);function u(e,s){var p,c,a=f(e,function(h,t){if(p)return p(h,t-1);c=h,p=s?rr(h,s):x(h)});return a.columns=c||[],a}function f(e,s){var p=[],c=e.length,a=0,h=0,t,r=c<=0,l=!1;e.charCodeAt(c-1)===S&&--c,e.charCodeAt(c-1)===L&&--c;function k(){if(r)return j;if(l)return l=!1,K;var A,T=a,m;if(e.charCodeAt(T)===E){for(;a++<c&&e.charCodeAt(a)!==E||e.charCodeAt(++a)===E;);return(A=a)>=c?r=!0:(m=e.charCodeAt(a++))===S?l=!0:m===L&&(l=!0,e.charCodeAt(a)===S&&++a),e.slice(T+1,A-1).replace(/""/g,'"')}for(;a<c;){if((m=e.charCodeAt(A=a++))===S)l=!0;else if(m===L)l=!0,e.charCodeAt(a)===S&&++a;else if(m!==o)continue;return e.slice(T,A)}return r=!0,e.slice(T,c)}for(;(t=k())!==j;){for(var y=[];t!==K&&t!==j;)y.push(t),t=k();s&&(y=s(y,h++))==null||p.push(y)}return p}function w(e,s){return e.map(function(p){return s.map(function(c){return M(p[c])}).join(n)})}function C(e,s){return s==null&&(s=$(e)),[s.map(M).join(n)].concat(w(e,s)).join(`
`)}function N(e,s){return s==null&&(s=$(e)),w(e,s).join(`
`)}function b(e){return e.map(v).join(`
`)}function v(e){return e.map(M).join(n)}function M(e){return e==null?"":e instanceof Date?nr(e):i.test(e+="")?'"'+e.replace(/"/g,'""')+'"':e}return{parse:u,parseRows:f,format:C,formatBody:N,formatRows:b,formatRow:v,formatValue:M}}var or=tr(","),ir=or.parse;const sr=`source,target,type\r
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
Nokia,Qualcomm,suit`;function gr(){const n=ir(sr);console.log("data",n);const i=928,o=600,u=Array.from(new Set(n.map(t=>t.type))),f=q(u,J),w=U({nodes:Array.from(new Set(n.flatMap(t=>[t.source,t.target])),t=>({id:t})),links:n.map(t=>Object.create(t))}),C=2,N=I(t=>Q({nodes:t?.nodes||R,links:t?.links||R,fromLinks:w.get().links,fromNodes:w.get().nodes,createForceNode(r,l,k){return _(r,C,l,V,P)},getNodeKey(r){return r.id},getSorceKey(r){return r.source},getTargetKey(r){return r.target},createFromKey(r){return{id:r}}})),b=.001,v=B(z()),M=()=>v.alpha<b,e=D("x"),s=D("y"),p=Z({getStrenth(t){return-400}}),c=X();function a(){const t=N();G(C,v,t.nodes,r=>{c(t.links,C,r),p(t.nodes,C,r),e(t.nodes,r),s(t.nodes,r)})}O(M,function(t){if(!t)return Y(()=>{a()})});const h=g.svg({width:i,height:o,viewBox:[-i/2,-o/2,i,o].join(" "),s_maxWidth:"100%",s_height:"auto",s_font:"12px sans-serif",children(){g.defs({children(){u.forEach(r=>{g.marker({id:`arrow-${r}`,viewBox:[0,-5,10,10].join(" "),refX:15,refY:-.5,markerWidth:6,markerHeight:6,orient:"auto",children(){g.path({fill:f(r),d:"M0,-5L10,0L0,5"})}})})}}),g.g({fill:"none",strokeWidth:1.5,children(){F(()=>N().links,function(r){g.path({markerEnd:`url(${new URL(`#arrow-${r.value.type}`,location.href)})`,stroke:f(r.value.type),d(){return t(r)}})})}}),g.g({fill:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",children(){F(()=>N().nodes,function(r){g.g({...H(l=>{const k=h.getBoundingClientRect(),y=k.left+k.width/2,A=k.top+k.height/2;r.x.f=l.pageX-y,r.y.f=l.pageY-A,v.alphaTarget=.3,a();const T=W(m=>{m?(r.x.f=m.pageX-y,r.y.f=m.pageY-A):(r.x.f=void 0,r.y.f=void 0,v.alphaTarget=0,T())})}),transform(){return`translate(${r.x.d},${r.y.d})`},children(){g.circle({stroke:"white",strokeWidth:1.5,r:4}),g.text({x:8,y:"0.31em",children:r.value.id,fill:"none",stroke:"white",strokeWidth:3}),g.text({x:8,y:"0.31em",children:r.value.id})}})})}});function t(r){const l=Math.hypot(r.target.x.d-r.source.x.d,r.target.y.d-r.source.y.d);return`
    M${r.source.x.d},${r.source.y.d}
    A${l},${l} 0 0,1 ${r.target.x.d},${r.target.y.d}
  `}}})}export{gr as default};
