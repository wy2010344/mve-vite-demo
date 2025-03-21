import{f as x}from"./chunk-LSEVNFON-G8OzWBoO.js";import{c as m,f as t,a1 as y,u as g,n as b}from"./index-B2-PbFlA.js";import{d as v}from"./index-DcpmnZq_.js";import{e as N}from"./explain-ZWGYTnbs.js";import{m as p}from"./markdown-CssJlx0L.js";import{a as c}from"./animate.es-CuPzepd-.js";import"./canvasRender-CItRrCUu.js";import"./iconBase-DadiGZ5T.js";function E(){const f=[{time:Date.now()}],n=m(f);N(function(){p`
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
    `});function u(s,o){return t.li({className:"daisy-list-row",children(){t.span({className:"text-4xl font-thin opacity-30 tabular-nums",childrenType:"text",children:o}),t.span({className:"list-col-grow",childrenType:"text",children:s.value.time+""}),t.button({childrenType:"text",children:"x",className:"daisy-btn",onClick(){n.set(n.get().filter(i=>i!=s.value))}}),t.button({childrenType:"text",children:"替换",className:"daisy-btn daisy-btn-accent",onClick(){n.set(n.get().map(i=>i==s.value?{...i,time:Date.now()}:i))}})}})}t.div({s_display:"flex",s_flexDirection:"column",s_alignItems:"center",s_gap:"10px",children(){const s=m(0),o=m(0);function d(){const e=s.get()%2;if(e==0)return"pop";if(e==1)return"shift"}function i(){const e=o.get()%3;if(e==1)return"in-out";if(e==2)return"out-in"}const h=y(n.get,{mode:d,wait:i,enterIgnore(){return f==n.get()}});t.div({s_display:"flex",s_gap:"10px",children(){t.button({className:"daisy-btn",childrenType:"text",onClick(){s.set(s.get()+1)},children(){return`mode: ${d()||"normal"}`}}),t.button({className:"daisy-btn",childrenType:"text",onClick(){o.set(o.get()+1)},children(){return`wait: ${i()||"normal"}`}})}}),t.ul({className:"daisy-list rounded-box shadow-md",children(){p`
退出元素使用的数据,是最后状态的数据
          `,g(h,(e,r)=>{const a=u(e,r);b(e.step,function(l){e.promise()&&(l=="enter"?c(a,{x:["100%",0]}).finished.then(e.resolve):l=="exiting"&&c(a,{x:[0,"100%"]}).finished.then(e.resolve))})}),p`
退出时,采用对旧元素clone的方式,使元素内的数据保持不变
          `,v(h,(e,r)=>{const a=u(e,r);return e.promise()&&c(a,{x:["100%",0]}).finished.then(e.resolve),{node:a,applyAnimate(l){e.promise()&&c(l,{x:[0,"100%"]}).finished.then(e.resolve)}}})}}),t.button({onClick(){const e={time:Date.now()},r=n.get().slice(),a=x.number.int({min:0,max:r.length});r.splice(a,0,e),n.set(r)},className:"daisy-btn daisy-btn-primary",childrenType:"text",children:"随机增加"})}})}export{E as default};
