import{R as V,G as O,S as T,T as F,o as m,a as D,U as x,b as A,V as M,X as B,Z as p,c as _,d as b,_ as R,$ as P,A as E,B as g,a0 as k,I as N,m as W,a1 as z,a2 as H,a3 as L}from"./index-b8_4Fr9u.js";import"./canvasRender-DCW8xXwg.js";const U=function(){var t={type:"FF",version:0,documentMode:""};if(!globalThis.navigator)return t;var e=navigator.userAgent,n=e.indexOf("Opera")>-1,r=e.indexOf("compatible")>-1&&e.indexOf("MSIE")>-1&&!n,s=e.indexOf("Firefox")>-1,i=e.indexOf("Safari")>-1;if(r){var u=new RegExp("MSIE (\\d+\\.\\d+);");u.test(e),t.type="IE",t.version=parseFloat(RegExp.$1),t.documentMode=document.documentMode}return s&&(t.type="FF"),n&&(t.type="Opera"),i&&(t.type="Safari"),t}(),oe=U.type=="FF"?!0:"plaintext-only";var X=Object.defineProperty,$=(t,e,n)=>e in t?X(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,y=(t,e,n)=>$(t,typeof e!="symbol"?e+"":e,n);function Y(t,e){const n=document.createElement(t);return n.style.position="absolute",n.style.minWidth="0px",Q(n,e,!1)}M(B,t=>function(e){return Y(t,e)});function v(t){return function(e){return function(){const n=e();try{return n.getInfo(t)}catch{try{return n.parent.getChildInfo(t,n.index())}catch{return n.getInfo(t,!0)}}}}}const Z=v("x"),q=v("y"),J=v("width"),K=v("height");function Q(t,e,n){let r,s,i,u;function c(){return a}const h=p(e.x,c,Z),f=p(e.y,c,q);if(e.width=="auto"){const o=_(0);i=o.get,r=o.set}else i=p(e.width,c,J);if(e.height=="auto"){const o=_(0);u=o.get,s=o.set}else u=p(e.height,c,K);const l=O();(r||s)&&b(()=>{const o=()=>{r==null||r(t.clientWidth),s==null||s(t.clientHeight),m()};o();const d=new ResizeObserver(o);d.observe(t),l(()=>{d.disconnect()})},-2);const a=new ee(t,h,f,i,u,n,e);return R(a),!e.childrenType&&e.children?a.children=te(e.children,a.target,a):a.children=P(E),b(()=>{l(g(a.x,o=>a.target.style.left=o+"px")),l(g(a.y,o=>a.target.style.top=o+"px")),r||l(g(a.width,o=>a.target.style.width=o+"px")),s||l(g(a.height,o=>a.target.style.height=o+"px"))},-1),b(()=>{function o(d,I,S){const w=arguments[3];typeof I=="function"?l(g(()=>I(a),S,d,w)):S(I,d,w)}k(t,e,o,N,E)}),a}function j(t){return t.target}class ee{constructor(e,n,r,s,i,u,c){y(this,"display"),y(this,"children"),y(this,"parent"),y(this,"__index"),this.target=e,this.x=n,this.y=r,this.width=s,this.height=i,this.isSVG=u,this.configure=c;const h=x(c.m_display||ne);this.display=W(()=>z(this,h))}getExt(){return this.configure}index(){return this.parent.children(),this.__index}getChildInfo(e,n){return this.display().getChildInfo(e,n)}getInfo(e,n){return this.display().getInfo(e,n)}}function te(t,e,n){const r=H(t,n,s=>{s.forEach((i,u)=>{i.__index=u,i.parent&&i.parent!=n&&console.log("parent发生改变",i.parent,n),i.parent=n})});return A(r,L(e,j)),r}const ne={getChildInfo(t,e){throw""},getInfo(t,e){if(e)return 0;if(t=="x"||t=="y")throw"";return 0}};function C(t,e,n,r){const s=x(t);A(()=>{r();const i=s();i!=e[n]&&(e[n]=i)})}function G(t="onInput",e,n="",r,s,i){const[u,c]=T(),h=x(t),f=e.onInput;e.onInput=o=>{if(h()=="onInput"){const d=a[i]||"";c(),r(d),f==null||f(o),m()}else f==null||f(o)};const l=e.onBlur;e.onBlur=o=>{if(h()=="onBlur"){const d=a[i]||"";c(),r(d),m()}else l==null||l(o)};const a=s(e);return C(n,a,i,u),a}function se(t,{value:e,onValueChange:n,triggerTime:r,...s}){return G(r,s,e,n,i=>F(t,i),"value")}function ae(t,e){const{value:n,onValueChange:r,triggerTime:s,...i}=e;return G(s,i,n,r,u=>F(t,u),"textContent")}function ue({checked:t,onInput:e,...n}){const r=x(t),[s,i]=T(),u=F("input",{...n,onInput(c){i(),e==null||e(c),m()}});return C(r,u,"checked",s),u}function ce(t,e){const[n,r]=V(D,t,e);return O()(r),n}export{ae as a,ue as b,oe as c,ce as d,se as r};
