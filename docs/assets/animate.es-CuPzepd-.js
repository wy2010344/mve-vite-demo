function dt(t,e){t.indexOf(e)===-1&&t.push(e)}const et=(t,e,n)=>Math.min(Math.max(n,t),e),d={duration:.3,delay:0,endDelay:0,repeat:0,easing:"ease"},_=t=>typeof t=="number",D=t=>Array.isArray(t)&&!_(t[0]),pt=(t,e,n)=>{const i=e-t;return((n-t)%i+i)%i+t};function mt(t,e){return D(t)?t[pt(0,t.length,e)]:t}const nt=(t,e,n)=>-n*t+n*e+t,it=()=>{},v=t=>t,Z=(t,e,n)=>e-t===0?1:(n-t)/(e-t);function st(t,e){const n=t[t.length-1];for(let i=1;i<=e;i++){const s=Z(0,e,i);t.push(nt(n,1,s))}}function gt(t){const e=[0];return st(e,t-1),e}function yt(t,e=gt(t.length),n=v){const i=t.length,s=i-e.length;return s>0&&st(e,s),a=>{let o=0;for(;o<i-2&&!(a<e[o+1]);o++);let r=et(0,1,Z(e[o],e[o+1],a));return r=mt(n,o)(r),nt(t[o],t[o+1],r)}}const at=t=>Array.isArray(t)&&_(t[0]),K=t=>typeof t=="object"&&!!t.createAnimation,x=t=>typeof t=="function",vt=t=>typeof t=="string",F={ms:t=>t*1e3,s:t=>t/1e3},rt=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,Tt=1e-7,bt=12;function At(t,e,n,i,s){let a,o,r=0;do o=e+(n-e)/2,a=rt(o,i,s)-t,a>0?n=o:e=o;while(Math.abs(a)>Tt&&++r<bt);return o}function R(t,e,n,i){if(t===e&&n===i)return v;const s=a=>At(a,0,1,t,n);return a=>a===0||a===1?a:rt(s(a),e,i)}const St=(t,e="end")=>n=>{n=e==="end"?Math.min(n,.999):Math.max(n,.001);const i=n*t,s=e==="end"?Math.floor(i):Math.ceil(i);return et(0,1,s/t)},Et={ease:R(.25,.1,.25,1),"ease-in":R(.42,0,1,1),"ease-in-out":R(.42,0,.58,1),"ease-out":R(0,0,.58,1)},wt=/\((.*?)\)/;function J(t){if(x(t))return t;if(at(t))return R(...t);const e=Et[t];if(e)return e;if(t.startsWith("steps")){const n=wt.exec(t);if(n){const i=n[1].split(",");return St(parseFloat(i[0]),i[1].trim())}}return v}class ot{constructor(e,n=[0,1],{easing:i,duration:s=d.duration,delay:a=d.delay,endDelay:o=d.endDelay,repeat:r=d.repeat,offset:f,direction:m="normal",autoplay:T=!0}={}){if(this.startTime=null,this.rate=1,this.t=0,this.cancelTimestamp=null,this.easing=v,this.duration=0,this.totalDuration=0,this.repeat=0,this.playState="idle",this.finished=new Promise((c,b)=>{this.resolve=c,this.reject=b}),i=i||d.easing,K(i)){const c=i.createAnimation(n);i=c.easing,n=c.keyframes||n,s=c.duration||s}this.repeat=r,this.easing=D(i)?v:J(i),this.updateDuration(s);const S=yt(n,f,D(i)?i.map(J):v);this.tick=c=>{var b;a=a;let h=0;this.pauseTime!==void 0?h=this.pauseTime:h=(c-this.startTime)*this.rate,this.t=h,h/=1e3,h=Math.max(h-a,0),this.playState==="finished"&&this.pauseTime===void 0&&(h=this.totalDuration);const E=h/this.duration;let C=Math.floor(E),g=E%1;!g&&E>=1&&(g=1),g===1&&C--;const I=C%2;(m==="reverse"||m==="alternate"&&I||m==="alternate-reverse"&&!I)&&(g=1-g);const P=h>=this.totalDuration?1:Math.min(g,1),w=S(this.easing(P));e(w),this.pauseTime===void 0&&(this.playState==="finished"||h>=this.totalDuration+o)?(this.playState="finished",(b=this.resolve)===null||b===void 0||b.call(this,w)):this.playState!=="idle"&&(this.frameRequestId=requestAnimationFrame(this.tick))},T&&this.play()}play(){const e=performance.now();this.playState="running",this.pauseTime!==void 0?this.startTime=e-this.pauseTime:this.startTime||(this.startTime=e),this.cancelTimestamp=this.startTime,this.pauseTime=void 0,this.frameRequestId=requestAnimationFrame(this.tick)}pause(){this.playState="paused",this.pauseTime=this.t}finish(){this.playState="finished",this.tick(0)}stop(){var e;this.playState="idle",this.frameRequestId!==void 0&&cancelAnimationFrame(this.frameRequestId),(e=this.reject)===null||e===void 0||e.call(this,!1)}cancel(){this.stop(),this.tick(this.cancelTimestamp)}reverse(){this.rate*=-1}commitStyles(){}updateDuration(e){this.duration=e,this.totalDuration=e*(this.repeat+1)}get currentTime(){return this.t}set currentTime(e){this.pauseTime!==void 0||this.rate===0?this.pauseTime=e:this.startTime=performance.now()-e/this.rate}get playbackRate(){return this.rate}set playbackRate(e){this.rate=e}}class Ot{setAnimation(e){this.animation=e,e==null||e.finished.then(()=>this.clearAnimation()).catch(()=>{})}clearAnimation(){this.animation=this.generator=void 0}}const L=new WeakMap;function ct(t){return L.has(t)||L.set(t,{transforms:[],values:new Map}),L.get(t)}function Dt(t,e){return t.has(e)||t.set(e,new Ot),t.get(e)}const xt=["","X","Y","Z"],Pt=["translate","scale","rotate","skew"],z={x:"translateX",y:"translateY",z:"translateZ"},Q={syntax:"<angle>",initialValue:"0deg",toDefaultUnit:t=>t+"deg"},Mt={translate:{syntax:"<length-percentage>",initialValue:"0px",toDefaultUnit:t=>t+"px"},rotate:Q,scale:{syntax:"<number>",initialValue:1,toDefaultUnit:v},skew:Q},V=new Map,G=t=>`--motion-${t}`,q=["x","y","z"];Pt.forEach(t=>{xt.forEach(e=>{q.push(t+e),V.set(G(t+e),Mt[t])})});const Rt=(t,e)=>q.indexOf(t)-q.indexOf(e),Ft=new Set(q),lt=t=>Ft.has(t),Vt=(t,e)=>{z[e]&&(e=z[e]);const{transforms:n}=ct(t);dt(n,e),t.style.transform=Ct(n)},Ct=t=>t.sort(Rt).reduce(It,"").trim(),It=(t,e)=>`${t} ${e}(var(${G(e)}))`,W=t=>t.startsWith("--"),Y=new Set;function $t(t){if(!Y.has(t)){Y.add(t);try{const{syntax:e,initialValue:n}=V.has(t)?V.get(t):{};CSS.registerProperty({name:t,inherits:!1,syntax:e,initialValue:n})}catch{}}}const N=(t,e)=>document.createElement("div").animate(t,e),k={cssRegisterProperty:()=>typeof CSS<"u"&&Object.hasOwnProperty.call(CSS,"registerProperty"),waapi:()=>Object.hasOwnProperty.call(Element.prototype,"animate"),partialKeyframes:()=>{try{N({opacity:[1]})}catch{return!1}return!0},finished:()=>!!N({opacity:[0,1]},{duration:.001}).finished,linearEasing:()=>{try{N({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0}},B={},O={};for(const t in k)O[t]=()=>(B[t]===void 0&&(B[t]=k[t]()),B[t]);const jt=.015,Ut=(t,e)=>{let n="";const i=Math.round(e/jt);for(let s=0;s<i;s++)n+=t(Z(0,i-1,s))+", ";return n.substring(0,n.length-2)},tt=(t,e)=>x(t)?O.linearEasing()?`linear(${Ut(t,e)})`:d.easing:at(t)?_t(t):t,_t=([t,e,n,i])=>`cubic-bezier(${t}, ${e}, ${n}, ${i})`;function zt(t,e){for(let n=0;n<t.length;n++)t[n]===null&&(t[n]=n?t[n-1]:e());return t}const qt=t=>Array.isArray(t)?t:[t];function X(t){return z[t]&&(t=z[t]),lt(t)?G(t):t}const U={get:(t,e)=>{e=X(e);let n=W(e)?t.style.getPropertyValue(e):getComputedStyle(t)[e];if(!n&&n!==0){const i=V.get(e);i&&(n=i.initialValue)}return n},set:(t,e,n)=>{e=X(e),W(e)?t.style.setProperty(e,n):t.style[e]=n}};function ut(t,e=!0){if(!(!t||t.playState==="finished"))try{t.stop?t.stop():(e&&t.commitStyles(),t.cancel())}catch{}}function Lt(t,e){var n;let i=(e==null?void 0:e.toDefaultUnit)||v;const s=t[t.length-1];if(vt(s)){const a=((n=s.match(/(-?[\d.]+)([a-z%]*)/))===null||n===void 0?void 0:n[2])||"";a&&(i=o=>o+a)}return i}function Nt(){return window.__MOTION_DEV_TOOLS_RECORD}function Bt(t,e,n,i={},s){const a=Nt(),o=i.record!==!1&&a;let r,{duration:f=d.duration,delay:m=d.delay,endDelay:T=d.endDelay,repeat:S=d.repeat,easing:c=d.easing,persist:b=!1,direction:h,offset:E,allowWebkitAcceleration:C=!1,autoplay:g=!0}=i;const I=ct(t),P=lt(e);let w=O.waapi();P&&Vt(t,e);const p=X(e),$=Dt(I.values,p),y=V.get(p);return ut($.animation,!(K(c)&&$.generator)&&i.record!==!1),()=>{const j=()=>{var l,M;return(M=(l=U.get(t,p))!==null&&l!==void 0?l:y==null?void 0:y.initialValue)!==null&&M!==void 0?M:0};let u=zt(qt(n),j);const H=Lt(u,y);if(K(c)){const l=c.createAnimation(u,e!=="opacity",j,p,$);c=l.easing,u=l.keyframes||u,f=l.duration||f}if(W(p)&&(O.cssRegisterProperty()?$t(p):w=!1),P&&!O.linearEasing()&&(x(c)||D(c)&&c.some(x))&&(w=!1),w){y&&(u=u.map(A=>_(A)?y.toDefaultUnit(A):A)),u.length===1&&(!O.partialKeyframes()||o)&&u.unshift(j());const l={delay:F.ms(m),duration:F.ms(f),endDelay:F.ms(T),easing:D(c)?void 0:tt(c,f),direction:h,iterations:S+1,fill:"both"};r=t.animate({[p]:u,offset:E,easing:D(c)?c.map(A=>tt(A,f)):void 0},l),r.finished||(r.finished=new Promise((A,ht)=>{r.onfinish=A,r.oncancel=ht}));const M=u[u.length-1];r.finished.then(()=>{b||(U.set(t,p,M),r.cancel())}).catch(it),C||(r.playbackRate=1.000001)}else if(s&&P)u=u.map(l=>typeof l=="string"?parseFloat(l):l),u.length===1&&u.unshift(parseFloat(j())),r=new s(l=>{U.set(t,p,H?H(l):l)},u,Object.assign(Object.assign({},i),{duration:f,easing:c}));else{const l=u[u.length-1];U.set(t,p,y&&_(l)?y.toDefaultUnit(l):l)}return o&&a(t,e,u,{duration:f,delay:m,easing:c,repeat:S,offset:E},"motion-one"),$.setAnimation(r),r&&!g&&r.pause(),r}}const Kt=(t,e)=>t[e]?Object.assign(Object.assign({},t),t[e]):Object.assign({},t);function Wt(t,e){return typeof t=="string"?t=document.querySelectorAll(t):t instanceof Element&&(t=[t]),Array.from(t||[])}const Xt=t=>t(),ft=(t,e,n=d.duration)=>new Proxy({animations:t.map(Xt).filter(Boolean),duration:n,options:e},Gt),Zt=t=>t.animations[0],Gt={get:(t,e)=>{const n=Zt(t);switch(e){case"duration":return t.duration;case"currentTime":return F.s((n==null?void 0:n[e])||0);case"playbackRate":case"playState":return n==null?void 0:n[e];case"finished":return t.finished||(t.finished=Promise.all(t.animations.map(Ht)).catch(it)),t.finished;case"stop":return()=>{t.animations.forEach(i=>ut(i))};case"forEachNative":return i=>{t.animations.forEach(s=>i(s,t))};default:return typeof(n==null?void 0:n[e])>"u"?void 0:()=>t.animations.forEach(i=>i[e]())}},set:(t,e,n)=>{switch(e){case"currentTime":n=F.ms(n);case"playbackRate":for(let i=0;i<t.animations.length;i++)t.animations[i][e]=n;return!0}return!1}},Ht=t=>t.finished;function Jt(t,e,n){return x(t)?t(e,n):t}function Qt(t){return function(n,i,s={}){n=Wt(n);const a=n.length,o=[];for(let r=0;r<a;r++){const f=n[r];for(const m in i){const T=Kt(s,m);T.delay=Jt(T.delay,r,a);const S=Bt(f,m,i[m],T,t);o.push(S)}}return ft(o,s,s.duration)}}const Yt=Qt(ot);function kt(t,e={}){return ft([()=>{const n=new ot(t,[0,1],e);return n.finished.catch(()=>{}),n}],e,e.duration)}function te(t,e,n){return(x(t)?kt:Yt)(t,e,n)}export{te as a};
