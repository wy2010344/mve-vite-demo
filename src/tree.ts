import { dom } from "mve-dom";
import { mve } from 'mve-core/util'
import { modelChildren } from 'mve-core/modelChildren'



interface TreeRow{

}

function treeBranch(me:mve.LifeModel,row:TreeRow,i:mve.GValue<number>) {
  const expand=mve.valueOf(false)
  const children=mve.arrayModelOf<TreeRow>([])
  return dom({
    type:"li",
    children:[
      dom({
        type:"button",
        text(){
          return expand()?"-":"+"
        },
        event:{
          click(){
            expand(!expand())
          }
        }
      }),
      dom({
        type:"input"
      }),
      dom({
        type:"button",
        text:"追加子节点",
        event:{
          click(){
            expand(true)
            children.push({

            })
          }
        }
      }),
      dom({
        type:"ul",
        style:{
          display(){
            return expand()?"":"none"
          }
        },
        children:modelChildren(children,treeBranch)
      })
    ]
  })
}
export function tree(){
  const rootList=mve.arrayModelOf<TreeRow>([])
  return dom.root(function(me){
    return {
      type:"div",
      children:[
        dom("tree"),
        dom({
          type:"button",text:"追加根节点",
          event:{
            click(){
              rootList.push({})
            }
          }
        }),
        dom({
          type:"ul",
          children:modelChildren(rootList,treeBranch)
        })
      ]
    }
  })
}