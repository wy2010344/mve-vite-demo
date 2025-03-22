import{c as s,O as l,u as c,d as n,j as d,M as u,o as g,h as f}from"./index-DLvyNe9j.js";function v(){i()}function p(e,r){const t=s(!1);n.div({style:`
    margin-left:20px;
    `}).render(()=>{n.div().render(()=>{let o;d(t.get,()=>{o=n.input({}).render(),u(()=>{console.log("销毁...",e.text)}),g(()=>{o.value=e.text.get()},f)},()=>{n.span().renderTextContent(e.text.get)}),n.button({onClick(){if(t.get()){const a=o.value.trim();a?e.text.set(a):r()}t.set(!t.get())}}).renderTextContent(()=>t.get()?"确认":"编辑"),n.button({onClick:r}).renderText`删除`}),i()})}function i(){const e=s(l);c(e.get,(r,t)=>{p(r,()=>{const o=e.get().slice();o.splice(t(),1),e.set(o)})}),n.div({style:`
    margin-left:20px;
    `}).render(()=>{const r=n.input({placeholder:"..."}).render();n.button({onClick(){const t=r.value.trim();t&&(e.set(e.get().concat({id:Date.now(),text:s(t)})),r.value="")}}).renderText`增加`})}export{v as default};
