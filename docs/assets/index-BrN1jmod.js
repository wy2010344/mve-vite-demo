import{f as h}from"./chunk-KZPPZA2C-rvBpA5M9.js";import{P as m,ah as t,aq as y,bd as g,bi as b,bp as k,aO as v}from"./index-BrILyg7S.js";import{u as N}from"./index-rf6E0FyH.js";import{e as T}from"./explain--7eZY2Yb.js";import{m as p}from"./markdown-DnKMN8o4.js";import{a as d}from"./index-FekbOvEq.js";import"./canvasRender-Ds5PwtYp.js";import"./_commonjsHelpers-CqkleIqs.js";import"./layout-SKuJvode.js";import"./iconBase-BdFefF8g.js";import"./index-ClpkAJMp.js";import"./marked.esm-BaswSlok.js";function K(){const u=[{id:Date.now(),time:Date.now()}],n=m(u);T(function(){p`
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
    `});function f(r,l){return t.li({className:"daisy-list-row",children(){t.span({className:"text-4xl font-thin opacity-30 tabular-nums",childrenType:"text",children:l}),t.span({className:"list-col-grow",childrenType:"text",children(){return`${r.value().time}`}}),t.button({childrenType:"text",children:"x",className:"daisy-btn",onClick(){n.set(n.get().filter(i=>i.id!=r.key))}}),t.button({childrenType:"text",children:"替换",className:"daisy-btn daisy-btn-accent",onClick(){n.set(n.get().map(i=>i.id==r.key?{...i,id:Date.now(),time:Date.now()}:i))}})}})}t.div({s_overflowY:"auto",s_overflowX:"hidden",s_display:"flex",s_flexDirection:"column",s_alignItems:"center",s_gap:"10px",children(){const r=m(0),l=m(0);function c(){const e=r.get()%2;if(e==0)return"pop";if(e==1)return"shift"}function i(){const e=l.get()%3;if(e==1)return"in-out";if(e==2)return"out-in"}const x=y(n.get,{getKey(e){return e.id},mode:c,wait:i,enterIgnore(){return u==n.get()}});t.div({s_display:"flex",s_gap:"10px",children(){t.button({className:"daisy-btn",childrenType:"text",onClick(){r.set(r.get()+1)},children(){return`mode: ${c()||"normal"}`}}),t.button({className:"daisy-btn",childrenType:"text",onClick(){l.set(l.get()+1)},children(){return`wait: ${i()||"normal"}`}})}}),t.ul({className:"daisy-list rounded-box shadow-md",children(){p`
退出元素使用的数据,是最后状态的数据
          `,g(x,(e,s)=>{const o=f(e,s);b(e.step,a=>{k(a)}),v(e.step,function(a){e.promise()&&(a=="enter"?d(o,{x:["100%",0]}).then(e.resolve):a=="exiting"&&d(o,{x:[0,"100%"]}).then(e.resolve))})}),p`
退出时,采用对旧元素clone的方式,使元素内的数据保持不变
          `,N(x,(e,s)=>{const o=f(e,s);return e.promise()&&d(o,{x:["100%",0]}).then(e.resolve),{node:o,applyAnimate(a){e.promise()&&d(a,{x:[0,"100%"]}).then(e.resolve)}}})}}),t.button({onClick(){const e={id:Date.now(),time:Date.now()},s=n.get().slice(),o=h.number.int({min:0,max:s.length});s.splice(o,0,e),n.set(s)},className:"daisy-btn daisy-btn-primary",childrenType:"text",children:"随机增加"})}})}export{K as default};
