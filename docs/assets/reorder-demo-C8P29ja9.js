import{f as _}from"./chunk-LSEVNFON-G8OzWBoO.js";import{c as x,f as s,ah as A,a as S,ai as D,aj as k,s as T,u as p,$ as E,ak as F,al as I,am as P,an as y}from"./index-BnPd4ZD8.js";const C=Array(30).fill(1).map((n,t)=>({index:t,name:_.person.fullName(),avatar:_.image.avatar()})),Y=E(600,y.out(y.circ));function j(){const n=x(C),t=x(void 0);s.div({s_overflow:"hidden",s_height:"100vh",onTouchMove(i){i.preventDefault()},children(){const i=s.div({s_width:"300px",s_height:"100%",s_overflow:"auto",s_marginInline:"auto",s_position:"relative",s_userSelect(){return t.get()?"none":"auto"},children(){const f=A(n.get,(o,r)=>{const d=Math.floor(Math.random()*100+50),e=S(0),c=10,g=s.div({s_display:"flex",s_alignItems:"center",s_marginTop(){return r()?c+"px":"0px"},s_border:"1px solid black",s_background:"#ffff003d",s_position:"relative",s_height:d+"px",s_zIndex(){return t.get()==o?"1":"0"},s_transform(){return`translateY(${e.get()}px)`},onPointerDown(l){if(t.get())return;const h=D(i,"y",a=>(e.changeTo(e.get()+a),!0));t.set(o);let u=l.pageY;const m=k(l.pageY,{container:i,config:{padding:10,config:!0}}),M=T(document,"pointermove",a=>{m.changePoint(a.pageY),e.changeTo(e.get()+a.pageY-u),u=a.pageY;const v=f();L(n,e,g,r(),v,c),p()}),w=T(document,"pointerup",a=>{M(),w(),h(),m.destroy(),e.changeTo(0,Y,{onFinish(v){t.set(void 0)}}),p()});p()},children(){s.img({src:o.avatar,s_width:"50px",s_height:"50px"}),s.span({childrenType:"text",children:o.name}),s.hr({s_flex:1})}});return{div:g,transY:e,getIndex:r}})}})}})}function b(n){return n.div.offsetHeight}function L(n,t,i,f,o,r=0){const d=F(o,f,b,t.get(),r);if(d){const[e,c]=d,g=I(e,c,o,b,r,(l,h)=>{l.transY.changeTo(0,Y,{from:h})});n.set(P(n.get(),e,c)),t.slientDiff(g)}}export{C as dataList,j as default};
