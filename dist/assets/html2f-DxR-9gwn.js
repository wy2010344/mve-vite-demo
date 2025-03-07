import{H as f,I as rt,c as ot,f as x,J as _,K as st}from"./index-Dt03grnW.js";var ct=Object.defineProperty,it=(e,t,n)=>t in e?ct(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,ut=(e,t,n)=>(it(e,t+"",n),n);class at{constructor(t){ut(this,"allowLog"),this.i=t}step1(t){if(this.notEnd()&&t(this.current()))return this.copyTo(this.i+1)}}class L extends at{constructor(t,n=0){super(n),this.content=t}current(){const t=this.content.charAt(this.i);if(t.length)return t}notEnd(){return this.content.length>this.i}currentCode(){return this.content.charCodeAt(this.i)}copyTo(t){return new L(this.content,t)}matchToEnd(t){if(this.notEnd()){for(const n of t)if(this.content.startsWith(n,this.i))return}return this}step1Code(t){return this.step1(n=>t(n.charCodeAt(0)))}}function d(...e){if(e.length==0)throw new Error("没有任何参数");for(let t=0;t<e.length;t++){const n=e[t];for(let r=0;r<t;r++){const o=e[r];n.startsWith(o)&&console.warn("后文包含前文,绝不会被匹配到",n,o)}}return function(t){for(const n of e)if(t.content.indexOf(n,t.i)==t.i)return t.copyTo(t.i+n.length)}}function lt(e){const t=[];for(let n=0;n<e.length;n++)t.push(e.charCodeAt(n));return t}function G(...e){const t=new Set(e);if(t.size==0)throw new Error("没有任何参数");t.size!=e.length&&console.warn("参数中有重复",e);function n(r){return t.has(r)}return r=>r.step1Code(n)}function R(...e){const t=new Set(e);t.size!=e.length&&console.warn("参数中有重复",e);function n(r){return!t.has(r)}return r=>r.step1Code(n)}function H(...e){return function(t){return t.matchToEnd(e)}}function ht(e){return e.notEnd()?void 0:e}function E(...e){return function(t){for(const n of e){const r=n(t);if(r)return r}}}function ft(...e){return E(...e,f)}class y{constructor(t,n){if(this.a=t,this.b=n,t>=n)throw new Error(`结束${n}应该比开始${t}大`)}static of(t,n){return new y(t,n)}matchCharBetween(...t){const n=this.a,r=this.b,o=new Set(t);return o.size!=t.length&&console.warn("不包含里有重复项"),o.forEach(s=>{if(s<n||s>r)throw new Error(`排除项中${s}不在${n}与${r}之间`)}),s=>s.step1Code(c=>!(c<n||c>r||o.has(c)))}matchCharNotBetween(...t){const n=this.a,r=this.b,o=new Set(t);return o.size!=t.length&&console.warn("不包含里有重复项"),o.forEach(s=>{if(s>=n&&s<=r)throw new Error(`包含项中${s}不在${n}与${r}之间`)}),s=>s.step1Code(c=>(c<n||c>r)&&!o.has(c))}}function S(...e){return function(t){let n=t;for(const r of e){const o=r(n);if(o)n=o;else return}return n}}function T(e,t=0,n=f,r=f){function o(s,c){if(!(s<t))return c}return function(s){let c=s,i=0;for(;;){if(i){const h=n(c);if(h)c=h;else return o(i,c)}else{const h=r(c);if(h)c=h;else return o(i,c)}const u=e(c);if(u)i++,c=u;else return o(i,c)}}}class dt extends Error{constructor(t){super(t),this.message=t}}function $(e){return new dt(e)}const k=function(e,t){return e.content.slice(e.i,t.i)},J=lt(` \r
	`),pt=G(...J),b=T(pt);class Q{constructor(t,n){this.value=t,this.end=n}}function g(e,t){return new Q(e,t)}function w(e){return e instanceof Q}function a(e,t,n=""){return function(r){const o=e(r);if(o)try{return g(t(r,o),o)}catch(s){return $(s)}return r.allowLog&&console.log("ruleGet失败",n),$(n)}}function z(e,t=""){return a(e,rt,t)}function m(e,t,n){return function(r){const o=[];for(const s of e){const c=s(r);if(w(c))r=c.end,o.push(c.value);else return r.allowLog&&console.log("解析失败",n),c}try{const s=t.apply(null,o);return g(s,r)}catch(s){return $(s)}}}function N(e,t){return function(n){let r=null;for(const o of e){const s=o(n);if(w(s))return s;r=s}return n.allowLog&&console.log("orRuleGet失败",t),r}}function wt(){const e=arguments[0];return a(f,function(t){return e==null?void 0:e(t)})}function I(e,t=0,n=f,r=f){function o(s,c){return s.length<t?$(`need at min ${t} but get ${s.length}`):g(s,c)}return function(s){const c=[];let i=s,u=0;for(;;){if(u){const l=n(i);if(l)i=l;else return o(c,i)}else{const l=r(i);if(l)i=l;else return o(c,i)}const h=e(i);if(w(h))u++,i=h.end,c.push(h.value);else return o(c,i)}}}function mt(e,t,n){return function(r){let o=r;const s=e(o);if(w(s)){o=s.end;let c=s.value;for(;;){const i=t(o);if(w(i)){const u=n(c,i.value);if(u)o=i.end,c=u;else return g(c,o)}else return g(c,o)}}return s}}function Y(e,t){return function(n){const r=e(n);if(w(r))try{const o=t(r.value);return g(o,r.end)}catch(o){return $(o)}return r}}const gt=R();function P(e,t=e){const n=String.fromCharCode(t),r=H(n);return m([a(G(e),f),I(N([a(d("\\\\"),function(o){return"\\"}),a(d(`\\${n}`),function(o){return n}),a(gt,function(o){return o.content[o.i]})]),0,r,r),a(E(ht,G(t)),f)],function(o,s,c){return s.join("")})}function p(e){return e.charCodeAt(0)}const F=y.of(p("a"),p("z")),M=y.of(p("A"),p("Z"));y.of(p("一"),p("龥"));const C=y.of(p("0"),p("9")),yt=E(S(C.matchCharBetween(p("0")),T(C.matchCharBetween())),C.matchCharBetween());S(yt,ft(S(d("."),T(C.matchCharBetween(),1))));const Ct=S(E(M.matchCharBetween(),F.matchCharBetween()),T(E(M.matchCharBetween(),F.matchCharBetween(),C.matchCharBetween())));class W{constructor(t,n,r){this.key=t,this.map=n,this.close=r}}class j{constructor(t){this.key=t}}const K=H("<"),O=Y(I(N([a(d("\\\\"),e=>"\\"),a(d("\\<"),e=>"<"),a(R(),e=>e.current())]),0,K,K),function(e){return e.join("")});function q(e,t,n){const r=m([t,N([m([a(d("="),f),n],function(i,u){return u}),wt(()=>!0)])],function(i,u){return{key:i,value:u}}),o=m([a(d("<"),f),e,a(b,f),I(r,0,b),a(b,f),a(d(">","/>"),k)],function(i,u,h,l,A,nt){const v={};for(let B of l){if(B.key in v)throw`duplicate key ${B.key}`;v[B.key]=B.value}return new W(u,v,nt=="/>")}),s=m([z(d("</")),e,z(d(">"))],function(i,u,h){return new j(u)});return mt(Y(O,i=>{const u=new X("",{},[]);return i&&u.children.push(i),[u]}),m([N([o,s]),O],function(i,u){return{brack:i,content:u}}),function(i,{brack:u,content:h}){let l=i.at(-1);if(l){if(u instanceof W)if(u.close)l.children.push(new X(u.key,u.map,[]));else{const A=new X(u.key,u.map,[]);l.children.push(A),i.push(A),l=A}else if(u instanceof j){if(l.type!=u.key)throw"not match the before quote";i.pop(),l=i.at(-1)}else throw"unknown node"+u;if(!l)throw"unexpected end!";return h&&l.children.push(h),i}})}class X{constructor(t,n,r){this.type=t,this.attrs=n,this.children=r}}const U=a(Ct,k),Et=q(U,U,P(34));function $t(e,t=Et){const n=t(new L(e));if(w(n))if(n.end.i==n.end.content.length){const r=n.value;if(r.length==1)return r[0].children;throw new Error("not completely closed")}else throw new Error("Unable to fully parse");throw new Error(n.message)}const Nt=J.concat("=/>".split("").map(e=>e.charCodeAt(0))),V=a(T(R(...Nt),1),k),Tt=N([P(34),P(123,125)]),At=q(V,V,Tt);function vt(){const e=ot("");x.button({className:"daisy-btn daisy-btn-primary",childrenType:"text",children:"读取剪切版",async onClick(){const t=await navigator.clipboard.readText();if(!t){_("没读取到文字");return}try{let n=$t(t,At);n=tt(n),console.log("node",n);const r=et(n);console.log("nodes",r),e.set(r),navigator.clipboard.writeText(r)}catch(n){_(`解析xml失败:${n}`)}}}),x.div({className:"daisy-mockup-code w-full",children(){x.pre({children(){x.code({childrenType:"text",children:e.get})}})}})}function Bt(e){return typeof e=="string"?e:{...e,children:tt(e.children)}}function tt(e){return e.filter(t=>typeof t=="string"?t.trim():!0).map(Bt)}function et(e){return e.map(xt).join(`
`)}const Z="aria-",D="data-";function xt(e){if(typeof e=="string")return`renderText\`${e.trim()}\``;{const t=[];for(const n in e.attrs){const r=e.attrs[n];let o=n;if(n.startsWith(Z)&&(o=`aria_${n.slice(Z.length)}`),n.startsWith(D)&&(o=`data_${n.slice(D.length)}`),n=="class"&&(o="className"),typeof r=="string"){let s="'";r.includes("'")&&(s="`"),isNaN(Number(r))||(s=""),t.push(`${o}:${s}${r}${s},`)}else t.push(`${o}:${r},`)}if(e.children.length){let n=!0;if(e.children.length==1){const r=e.children[0];typeof r=="string"&&(t.push("childrenType:'text',",`children:\`${r}\`,`),n=!1)}n&&t.push(`children(){
           ${et(e.children)}
        }`)}return`${st(e.type)?"fsvg":"fdom"}.${e.type}({
      ${t.join(`
`)}
    })`}}export{vt as default};
