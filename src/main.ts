import { dom } from 'mve-dom'
import './style.css'
import { todoView } from './todo'

const app = document.querySelector<HTMLDivElement>('#app')!

// app.innerHTML = `
//   <h1>Hello Vite with mve!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

const root=dom.root(function(me) {
  return {
    type:"div",
    children:[
      todoView
    ]
  }
})
app.append(root.element)
if(root.init){
  root.init()
}
if(root.destroy){
  window.addEventListener("close",root.destroy)
}
