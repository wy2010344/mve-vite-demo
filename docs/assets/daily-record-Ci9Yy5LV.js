import{u as J,f as o,j as k,y as ae,t as D,v as P,w as oe,m as v,r as ie,a as j,Y as b,B as $,a2 as ce,F as C,g as le,h as fe,p as S,i as T,k as w,o as E,q as Q,z as Z,a3 as de,I as he,e as me,a4 as N,x as q,S as I,C as L,l as ee,G as ue,H as ge,D as O,c as W,n as V,a5 as ye,a6 as xe,U as A,a7 as z,a8 as pe,a9 as be,b as R,M as ve}from"./index-BS7P0FCu.js";import{W as Ne,a as F,S as De,h as we,m as te,b as Te,d as Me,r as Se,f as Ce,g as Y}from"./demoList-DLw2V6jR.js";import{f as Ye,a as ke}from"./themeDropdown-DrEnW2NR.js";import{G as Pe}from"./iconBase-DTyvG6of.js";import{a as X}from"./animate.es-CuPzepd-.js";import{f as Fe}from"./chunk-LSEVNFON-G8OzWBoO.js";const ne="select-cell";function _e(n,m,d,g,i){function s(){return i()/7}function c(){const l=g.get(),t=n;return l.year==t.year&&l.month==t.month}J.div({attrs(l){const t=m();t==1||(l.s_position="absolute",l.s_inset=0,l.s_transform=`translateX(${(t-1)*100}%)`)},children(){o.div({className:"flex bg-base-100 z-10 relative",children(){for(let e=0;e<7;e++)o.div({className:"flex-1 aspect-square flex items-center justify-center text-base-content",childrenType:"text",children(){return Ne[n.weekDay(e)]}})}});const l=k(()=>{const e=s(),a=e*5,r=ae(D(g.get()),F.get())-1;return P({0:0,[a]:e*r},$)}),t=k(()=>{const e=s()*5;return P({0:s()*5,[e]:s()},$)});o.div({className:"overflow-hidden bg-base-200 relative",s_height(){const e=d.get();return t(e)+"px"},children(){o.div({s_height(){return s()*6+"px"},s_transform(){const e=Math.max(d.get(),0);return`translateY(${-l(e)}px)`},children(){for(let e=0;e<6;e++)o.div({className:"flex items-center justify-center relative",children(){for(let a=0;a<7;a++){const r=n.fullDayOf(a,e);let h=n;r.type=="last"?h=n.lastMonth():r.type=="next"&&(h=n.nextMonth()),a==0&&o.div({className:"absolute left-0 text-label-small",childrenType:"text",children(){return oe(D({year:h.year,month:h.month,day:r.day}),F.get())}});const y=De.fromYmd(h.year,h.month,r.day).getLunarDay(),f=v(()=>r.type=="this"&&c()&&g.get().day==r.day);o.div({className(){return j(`flex-1 aspect-square cursor-pointer
                        flex flex-col items-center justify-center gap-1 `,r.type!="this"&&"opacity-30")},onClick(){g.set(b.from(h.year,h.month,r.day))},children(){o.div({className:"flex items-center justify-center relative aspect-square p-1",children(){ie(f,()=>{o.div({id:ne,className(){return j("absolute inset-0 ring-1 rounded-full ring-accent")}})}),o.span({className:"relative text-base-content/80  text-label-large",childrenType:"text",children:r.day})}}),o.div({className:"text-label-small  text-base-content/60",childrenType:"text",children:y.getName()})}})}}})}})}})}})}const _=ce(void 0);function je(n,m){return Pe({attr:{viewBox:"0 0 512 512"},child:[{tag:"path",attr:{fill:"none",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"32",d:"m112 160-64 64 64 64"},child:[]},{tag:"path",attr:{fill:"none",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"32",d:"M64 224h294c58.76 0 106 49.33 106 108v20"},child:[]}]},n,m)}const $e=C.get();function Ee(n,m){const{calendarScrollY:d,calendarClose:g,showCalendar:i,calendarScroll:s,calendarFinish:c,today:l}=_.consume();we(n.get,ne);const t=v(a=>{const r=n.get();return new le(r.year,r.month,F.get())}),e=v(()=>{const a=n.get();return fe.from(a.year,a.month,a.day,F.get())});o.div({className:"relative",onPointerDown:S(function(a,r){if(r=="y")return I.from(a,{getPage:L,scrollDelta(h,u){s(h,u)},onFinish(h){c(h)}})}),children(){const a=T(0);w(v(y=>{const f=t();if(y&&i()){const x=Math.sign(f.toNumber()-y.toNumber());x&&r.changePage(x)}return f})),w(v(y=>{const f=e();if(y&&!i()){const x=Math.sign(f.cells[0].toNumber()-y.cells[0].toNumber());x&&r.changePage(x)}return f}));const r=te(a,h);function h(){return u.clientWidth}const u=o.div({className:"overflow-hidden  bg-base-300 touch-none",onPointerDown:S(function(y,f){if(f=="x")return r.pointerDown(y,$e,x=>{if(i()){const p=x<0?t().lastMonth():t().nextMonth();n.get().day>p.days?n.set(b.from(p.year,p.month,p.days)):n.set(b.from(p.year,p.month,n.get().day))}else{const p=D(n.get());p.setTime(p.getTime()+x*Te),x&&n.set(b.fromDate(p))}})}),children(){o.div({className:"relative",s_transform(){return`translateX(${-a.get()}px)`},children(){E(Q(()=>{const y=t();return[y.lastMonth(),y,y.nextMonth()]},Z),function(y,f){_e(y,f,d,n,m)})}})}});o.div({className:"w-full h-11 flex justify-between items-center [padding-inline:18px] bg-base-100 z-10",children(){o.div({className:"flex items-center gap-1",children(){const y=de(()=>{const f=l().toNumber(),x=n.get().toNumber();return f!=x?[1]:he});E(y,function(f){const x=o.button({className:"daisy-btn daisy-btn-xs daisy-btn-circle",onClick(){n.set(l())},children(){je()}});w((p=me)=>{const M=f.step(),se=l().toNumber(),re=n.get().toNumber(),H=Math.sign(re-se);return M==p.step&&H==p.dir?p:{step:M,dir:H}},function({step:p,dir:M}){p=="enter"?X(x,{rotateY:M>0?[90,0]:[90,180]}).finished.then(f.resolve):p=="exiting"&&X(x,{rotateY:M>0?[0,90]:[180,90]}).finished.then(f.resolve)})}),o.h1({className(){const f=l(),x=n.get();return j("text-2xl text-base-content font-bold",f.equals(x)?"text-2xl":f.year==x.year?"text-xl":"text-lg",d.getAnimateConfig()?q`cursor-not-allowed`:q`cursor-pointer`)},childrenType:"text",children(){const f=n.get();return l().year!=f.year?`${f.year}-${N(f.month,2)}-${N(f.day,2)}`:`${N(f.month,2)}-${N(f.day,2)}`},onClick(){d.getAnimateConfig()||(i()?g():d.animateTo(0))}})}}),o.div({className:"text-base-content",children(){o.span({className:"mr-[0.125em] text-2xl",childrenType:"text",children:"¥"}),o.span({className:"text-2xl",childrenType:"text",children:"23"}),o.sup({className:"opacity-50 text-[0.75em] -top-[0.75em]",childrenType:"text",children:".00"})}})}})}})}const B=-50,Oe=C.get();function We(n,m){const{showCalendar:d,calendarFinish:g,calendarScroll:i}=_.consume(),s=T(0);w(m,function(t){!t&&n()!=1&&ee(()=>{s.changeTo(0)})});let c;const l=J.div({attrs(t){const e=n();t.className="absolute inset-0 select-none bg-base-100 overflow-hidden",e!=1&&(t.s_position="absolute",t.s_inset=0,t.s_transform=`translateX(${(e-1)*100}%)`)},onTouchMove(t){t.preventDefault()},onPointerDown:S(function(t,e){if(e=="y")return I.from(t,{getPage:L,scrollDelta(a,r){if(d())i(a,r);else{const h=s.get();s.changeTo(h+ge(h,a,l.clientHeight,c.offsetHeight))}},onFinish(a){if(d())g(a);else{s.get()<=B&&console.log("新建");const r=Oe.destinationWithMarginIscroll({velocity:a,current:s.get(),containerSize:l.clientHeight,contentSize:c.offsetHeight});ue(r,s)}}})}),children(){const t=k(()=>P({0:0,[B]:G.length-1},$));o.div({childrenType:"text",className:"absolute w-full flex justify-center",s_transform(){return`translateY(calc(${-s.get()}px - 100%))`},children(){const e=Math.round(t(s.get()));return G[e]}}),c=o.div({s_transform(){return`translateY(${-s.get()}px)`},className:"flex flex-col",s_minHeight:"100%",children(){Me(Fe.number.int({min:1,max:18}))}})}})}const G=["新...","新增...","新增一...","新增一条...","新增一条记...","新增一条记录"],Ae=C.get();function Ie(n){function m(){return i.clientWidth}const d=T(0),g=te(d,m);w(v(s=>{const c=n.get();if(s){const l=D(s).valueOf(),e=D(c).valueOf()-l;let a=0;e>=O?a=1:e<=-864e5&&(a=-1),a&&g.changePage(a)}return c}));const i=o.div({className:"flex-1 overflow-hidden",onPointerDown:S(function(s,c){if(c=="x")return g.pointerDown(s,Ae,l=>{const t=D(n.get());t.setTime(t.getTime()+l*O),l&&n.set(b.fromDate(t))})}),children(){o.div({className:"h-full",s_transform(){return`translateX(${-d.get()}px)`},children(){E(Q(()=>{const s=n.get();return[s.beforeDay(),s,s.nextDay()]},Z),function(s,c){We(c,()=>d.getAnimateConfig())})}})}})}const Le=C.get(.007);function K({height:n,cellHeight:m,renderCell:d,value:g,realTimeValue:i=W(g.get()),format:s=xe}){const c=T(0);function l(e){i.set(s(i.get()+e))}function t(){const e=Math.floor(c.get()/m);e&&(c.slientDiff(-e*m),l(e),A())}return w(g.get,function(e){const a=e-i.get();a&&ee(()=>{const r=a*m;c.changeTo(r,V(),{onProcess:t,onFinish:t})})}),{onPointerDown:S(function(e,a){if(a=="y")return I.from(e,{getPage:L,scrollDelta(r,h){c.changeDiff(r),t()},onFinish(r){const u=Le.getFromVelocity(r).distance+c.get();l(Math.round(u/m));const y=Math.round(u/m)*m;c.changeTo(y,V(),{onProcess:t,onFinish(){t(),g.set(i.get())}})}})}),children(){o.div({s_transform(){return`translateY(${-c.get()}px)`},children(){console.log("dd",n()),ye(function(e){const a=i.get(),r=Math.ceil(n()/m),h=Math.floor(r/2);for(let u=a-h;u<=a+h;u++)e(u,d)})}})}}}function He(n){const{yearMonthScrollY:m,scrollYearMonthOpenHeight:d}=_.consume(),g=k(()=>P({0:d(),[d()]:0},function(i,s,c,l){return s?pe(i,c,l,be):l[1]}));o.div({s_height(){return g(m.get())+"px"},children(){o.div({s_height(){return d()+"px"},s_transform(){return`translateY(${-m.get()}px)`},className:"relative w-full",children(){o.div({className:"absolute inset-0 flex items-stretch justify-center",children(){o.div({className:"flex-1 relative flex flex-col justify-center overflow-hidden",...K({height:d,cellHeight:44,value:{get(){return n.get().year},set(i){const s=n.get();if(s.year!=i){const c=Math.min(z(i,s.month),s.day);n.set(b.from(i,s.month,c))}}},renderCell(i){o.div({className:"h-11 text-center flex items-center justify-center",childrenType:"text",children:N(i,2)})}})}),o.div({className:"flex-1 relative flex flex-col justify-center overflow-hidden",...K({height:d,cellHeight:44,value:{get(){return n.get().month},set(i){const s=n.get();if(i!=s.month){const c=Math.min(z(s.year,i),s.day);n.set(b.from(s.year,i,c))}}},format(i){return i=i-1,i=i%12,(i+12)%12+1},renderCell(i){o.div({className:"h-11 text-center flex items-center justify-center",childrenType:"text",children:N(i,2)})}})})}}),o.div({className:"absolute inset-0 flex flex-col items-stretch justify-center pointer-events-none ",children(){o.div({className:"flex-1 bg-linear-to-b from-base-100 to-100% to-base-100/90"}),o.div({className:"h-11 flex flex-col justify-center"}),o.div({className:"flex-1 bg-linear-to-t from-base-100 to-100% to-base-100/90"})}})}})}})}const U=C.get();function qe(){Se(function(n,m){m&&Ye(function(){Ce(),ke()});const d=b.fromDate(new Date),g=W(d,R),i=setInterval(()=>{g.set(b.fromDate(new Date))},O/2);ve(()=>{clearInterval(i)});const s=W(d,R);function c(){return 5*n()/7}function l(){return 44*3}const t=T(c()),e=T(l());function a(){return e.get()!=l()}_.provide({yearMonthScrollY:e,scrollYearMonthOpenHeight:l,calendarScrollY:t,calendarOpenHeight:c,today:g.get,showCalendar(){return t.get()!=c()},async calendarClose(){a()&&e.animateTo(l()),t.animateTo(c())},calendarScroll(r,h){if(a()){const u=e.get()+r;u>=l()?(e.changeTo(l()),A()):u<=0?e.changeTo(e.get()+r/3):e.changeTo(u)}else{const u=t.get()+r;u>=c()?(t.changeTo(c()),A()):u<=0?(t.changeTo(0),e.changeDiff(u)):t.changeTo(u)}},calendarFinish(r){a()?U.getFromVelocity(r).distance+e.get()>l()/2?e.changeTo(l(),Y(r)):e.changeTo(0,Y(r)):U.getFromDistance(r).distance+t.get()>c()/2?t.changeTo(c(),Y(r)):t.changeTo(0,Y(r))}}),o.div({className:"absolute inset-0 flex flex-col select-none touch-none",children(){He(s),Ee(s,n),Ie(s)}})})}function Ke(){qe()}export{Ke as default};
