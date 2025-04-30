import{c as a,e as l,a as c,d as n,b as d,ah as u,H as g,x as f}from"./index-DzjyJcX9.js";function v(){i()}function p(e,r){const t=a(!1);n.div({style:`
    margin-left:20px;
    `}).render(()=>{n.div().render(()=>{let s;d(t.get,()=>{s=n.input({}).render(),u(()=>{console.log("销毁...",e.text)}),g(()=>{s.value=e.text.get()},f)},()=>{n.span().renderTextContent(e.text.get)}),n.button({onClick(){if(t.get()){const o=s.value.trim();o?e.text.set(o):r()}t.set(!t.get())}}).renderTextContent(()=>t.get()?"确认":"编辑"),n.button({onClick:r}).renderText`删除`}),i()})}function i(){const e=a(l);c(e.get,(r,t)=>{p(r,()=>{const s=e.get().slice();s.splice(t(),1),e.set(s)})}),n.div({style:`
    margin-left:20px;
    `}).render(()=>{const r=n.input({placeholder:"..."}).render();n.button({onClick(){const t=r.value.trim();t&&(e.set(e.get().concat({id:Date.now(),text:a(t)})),r.value="")}}).renderText`增加`})}export{v as default};
