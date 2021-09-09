import { dom } from "mve-dom";



export function propagation() {
  return dom.root(function(me){
    return {
      type:"div",
      event:{
        click:[
          function() {
            console.log("点击a")
          },
          {
            capture:true,
            handler(e) {
              console.log("点击a-c")
            }
          }
        ]
      },
      children:[
        dom({
          type:"div",
          style:{
            position:"relative"
          },
          event:{
            click:[
              function() {
                console.log("点击b")
              },
              {
                capture:true,
                handler() {
                  console.log("点击b-c")
                }
              }
            ]
          },
          children:[
            dom({
              type:"div",
              text:"点击事件",
              style:{
                position:"absolute"
              },
              event:{
                click:[
                  function(e) {
                    console.log("点击c")
                  },
                  {
                    capture:true,
                    handler() {
                      console.log("点击c-c")
                    }
                  }
                ]
              }
            }),
            dom({
              type:"div",
              text:"点击事件2",
              style:{
                position:"absolute"
              },
              event:{
                click:[
                  function(e) {
                    e.stopPropagation()
                    console.log("点击d")
                  },
                  {
                    capture:true,
                    handler() {
                      console.log("点击d-c")
                    }
                  }
                ]
              }
            })
          ]
        })
      ]
    }
  })
}