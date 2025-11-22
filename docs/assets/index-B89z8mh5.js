import{f as h}from"./chunk-KZPPZA2C-rvBpA5M9.js";import{f as t,aL as y,c as m,b as g,w as b,P as k,d as v,aM as w}from"./index-BeB-7kZt.js";import{e as N}from"./explain-BylXfKAA.js";import{m as p}from"./markdown-DBoJB8Az.js";import{a as d}from"./index-BxY9dVzG.js";import"./iconBase-loNxg2Lh.js";import"./index-C9T9Onks.js";function $(){const u=[{id:Date.now(),time:Date.now()}],n=m(u);N(function(){p`
# 数据驱动的退出动画

- mode
  - pop: 退出元素在最后
  - shift: 退出元素在最前
- wait
  - normal: 同时进出
  - in-out: 选进后出
  - out-in: 先出后进

其它:
可以控制忽略动画,比如初始化页面不动画
    `});function f(s,l){return t.li({className:"daisy-list-row",children(){t.span({className:"text-4xl font-thin opacity-30 tabular-nums",childrenType:"text",children:l}),t.span({className:"list-col-grow",childrenType:"text",children(){return`${s.value().time}`}}),t.button({childrenType:"text",children:"x",className:"daisy-btn",onClick(){n.set(n.get().filter(i=>i.id!=s.key))}}),t.button({childrenType:"text",children:"替换",className:"daisy-btn daisy-btn-accent",onClick(){n.set(n.get().map(i=>i.id==s.key?{...i,id:Date.now(),time:Date.now()}:i))}})}})}t.div({s_overflowY:"auto",s_overflowX:"hidden",s_display:"flex",s_flexDirection:"column",s_alignItems:"center",s_gap:"10px",children(){const s=m(0),l=m(0);function c(){const e=s.get()%2;if(e==0)return"pop";if(e==1)return"shift"}function i(){const e=l.get()%3;if(e==1)return"in-out";if(e==2)return"out-in"}const x=y(n.get,{getKey(e){return e.id},mode:c,wait:i,enterIgnore(){return u==n.get()}});t.div({s_display:"flex",s_gap:"10px",children(){t.button({className:"daisy-btn",childrenType:"text",onClick(){s.set(s.get()+1)},children(){return`mode: ${c()||"normal"}`}}),t.button({className:"daisy-btn",childrenType:"text",onClick(){l.set(l.get()+1)},children(){return`wait: ${i()||"normal"}`}})}}),t.ul({className:"daisy-list rounded-box shadow-md",children(){p`
退出元素使用的数据,是最后状态的数据
          `,g(x,(e,r)=>{const a=f(e,r);b(e.step,o=>{k(o)}),v(e.step,function(o){e.promise()&&(o=="enter"?d(a,{x:["100%",0]}).then(e.resolve):o=="exiting"&&d(a,{x:[0,"100%"]}).then(e.resolve))})}),p`
退出时,采用对旧元素clone的方式,使元素内的数据保持不变
          `,w(x,(e,r)=>{const a=f(e,r);return e.promise()&&d(a,{x:["100%",0]}).then(e.resolve),{node:a,applyAnimate(o){e.promise()&&d(o,{x:[0,"100%"]}).then(e.resolve)}}})}}),t.button({onClick(){const e={id:Date.now(),time:Date.now()},r=n.get().slice(),a=h.number.int({min:0,max:r.length});r.splice(a,0,e),n.set(r)},className:"daisy-btn daisy-btn-primary",childrenType:"text",children:"随机增加"})}})}export{$ as default};
