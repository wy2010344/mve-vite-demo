import{P as s,a7 as l,bd as d,a3 as n,bh as c,aH as u,aO as g,a8 as f}from"./index-BrILyg7S.js";function v(){i()}function p(e,r){const t=s(!1);n.div({style:`
    margin-left:20px;
    `}).render(()=>{n.div().render(()=>{let a;c(t.get,()=>{a=n.input({}).render(),u(()=>{console.log("销毁...",e.text)}),g(()=>{a.value=e.text.get()},f)},()=>{n.span().renderTextContent(e.text.get)}),n.button({onClick(){if(t.get()){const o=a.value.trim();o?e.text.set(o):r()}t.set(!t.get())}}).renderTextContent(()=>t.get()?"确认":"编辑"),n.button({onClick:r}).renderText`删除`}),i()})}function i(){const e=s(l);d(e.get,(r,t)=>{p(r,()=>{const a=e.get().slice();a.splice(t(),1),e.set(a)})}),n.div({style:`
    margin-left:20px;
    `}).render(()=>{const r=n.input({placeholder:"..."}).render();n.button({onClick(){const t=r.value.trim();t&&(e.set(e.get().concat({id:Date.now(),text:s(t)})),r.value="")}}).renderText`增加`})}export{v as default};
