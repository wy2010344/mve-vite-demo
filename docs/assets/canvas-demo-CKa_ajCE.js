import{c as r,a1 as s,t as d,a2 as w,a3 as h}from"./index-C09L67qZ.js";function g(){const e=r(window.innerWidth),t=r(window.innerHeight);function i(){e.set(window.innerWidth),t.set(window.innerHeight)}window.addEventListener("resize",i),s(()=>{window.removeEventListener("resize",i)}),d({className:"touch-none",width:e.get,height:t.get},()=>{w({width:e.get,height:t.get,layout(){return h({direction:"x",directionFix:"center",alignFix:!0})},draw(o,n,a){return a.rect(0,0,n.width(),n.height()),{operates:[{type:"fill",style:"gray"}]}},children(){}})},{beforeDraw(o){}})}export{g as default};
