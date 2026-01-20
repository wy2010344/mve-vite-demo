import{c as o,e as l,r as c,m as n,j as d,k as u,h as g,z as f}from"./index-Dxu4lnfn.js";function v(){i()}function p(e,r){const t=o(!1);n.div({style:`
    margin-left:20px;
    `}).render(()=>{n.div().render(()=>{let s;d(t.get,()=>{s=n.input({}).render(),u(()=>{console.log("销毁...",e.text)}),g(()=>{s.value=e.text.get()},f)},()=>{n.span().renderTextContent(e.text.get)}),n.button({onClick(){if(t.get()){const a=s.value.trim();a?e.text.set(a):r()}t.set(!t.get())}}).renderTextContent(()=>t.get()?"确认":"编辑"),n.button({onClick:r}).renderText`删除`}),i()})}function i(){const e=o(l);c(e.get,(r,t)=>{p(r,()=>{const s=e.get().slice();s.splice(t(),1),e.set(s)})}),n.div({style:`
    margin-left:20px;
    `}).render(()=>{const r=n.input({placeholder:"..."}).render();n.button({onClick(){const t=r.value.trim();t&&(e.set(e.get().concat({id:Date.now(),text:o(t)})),r.value="")}}).renderText`增加`})}export{v as default};
