import{f as x}from"./chunk-LSEVNFON-G8OzWBoO.js";import{c as m,f as t,a2 as y,u as g,o as b}from"./index-DLvyNe9j.js";import{d as v}from"./index-BF6iHQpp.js";import{e as N}from"./explain-BBjj5_w_.js";import{m as f}from"./markdown-B4rbJ3EA.js";import{a as c}from"./animate.es-CuPzepd-.js";import"./canvasRender-DvO4PmED.js";import"./iconBase-pomhGcbn.js";function E(){const p=[{time:Date.now()}],i=m(p);N(function(){f`
# 数据驱动的退出动画
* mode
    * pop: 退出元素在最后
    * shift: 退出元素在最前
* wait 
    * normal: 同时进出
    * in-out: 选进后出
    * out-in: 先出后进
    
其它:
  可以控制忽略动画,比如初始化页面不动画    
    `});function u(s,a){return t.li({className:"daisy-list-row",children(){t.span({className:"text-4xl font-thin opacity-30 tabular-nums",childrenType:"text",children:a}),t.span({className:"list-col-grow",childrenType:"text",children:s.value.time+""}),t.button({childrenType:"text",children:"x",className:"daisy-btn",onClick(){i.set(i.get().filter(n=>n!=s.value))}}),t.button({childrenType:"text",children:"替换",className:"daisy-btn daisy-btn-accent",onClick(){i.set(i.get().map(n=>n==s.value?{...n,time:Date.now()}:n))}})}})}t.div({s_overflowY:"auto",s_overflowX:"hidden",s_display:"flex",s_flexDirection:"column",s_alignItems:"center",s_gap:"10px",children(){const s=m(0),a=m(0);function d(){const e=s.get()%2;if(e==0)return"pop";if(e==1)return"shift"}function n(){const e=a.get()%3;if(e==1)return"in-out";if(e==2)return"out-in"}const h=y(i.get,{mode:d,wait:n,enterIgnore(){return p==i.get()}});t.div({s_display:"flex",s_gap:"10px",children(){t.button({className:"daisy-btn",childrenType:"text",onClick(){s.set(s.get()+1)},children(){return`mode: ${d()||"normal"}`}}),t.button({className:"daisy-btn",childrenType:"text",onClick(){a.set(a.get()+1)},children(){return`wait: ${n()||"normal"}`}})}}),t.ul({className:"daisy-list rounded-box shadow-md",children(){f`
退出元素使用的数据,是最后状态的数据
          `,g(h,(e,r)=>{const o=u(e,r);b(e.step,function(l){e.promise()&&(l=="enter"?c(o,{x:["100%",0]}).finished.then(e.resolve):l=="exiting"&&c(o,{x:[0,"100%"]}).finished.then(e.resolve))})}),f`
退出时,采用对旧元素clone的方式,使元素内的数据保持不变
          `,v(h,(e,r)=>{const o=u(e,r);return e.promise()&&c(o,{x:["100%",0]}).finished.then(e.resolve),{node:o,applyAnimate(l){e.promise()&&c(l,{x:[0,"100%"]}).finished.then(e.resolve)}}})}}),t.button({onClick(){const e={time:Date.now()},r=i.get().slice(),o=x.number.int({min:0,max:r.length});r.splice(o,0,e),i.set(r)},className:"daisy-btn daisy-btn-primary",childrenType:"text",children:"随机增加"})}})}export{E as default};
