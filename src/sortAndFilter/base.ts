import { mve,BaseArray,SimpleArray } from 'mve-core/util'
import { dom } from 'mve-dom'

import { modelChildren } from 'mve-core/modelChildren'


/**
 * 进阶
 * 最筛选展示固定几个结果（只有用filterChildren比较好吗？）
 */

export interface Row{
  index:number
  /**可见性 */
  show:mve.Value<boolean>
  order:mve.Value<number>
  value:number
}
const SORTDIR=['asc','desc','none'] as const
type SORTTYPE=(typeof SORTDIR)[number]
export function sortAndFilterBase(filterFactory:(text:string,dir:SORTTYPE,arr:mve.ArrayModel<Row>)=>void){
  
  return function(me:mve.LifeModel){

    const vs:Row[]=[]
    for(let i=0;i<300;i++){
      vs.push({
        index:i,
        show:mve.valueOf(true),
        order:mve.valueOf(i),
        value:Math.floor(Math.random() * 10000)
      })
    }
  
    const list=mve.arrayModelOf<Row>(vs)
  
  
    let filterInput:HTMLInputElement
    let sortSelect:HTMLSelectElement
  
    const transition=mve.valueOf('')
    return dom({
      type:"div",
      children:[
        dom({
          type:"input",
          init(e){
            filterInput=e
          },
        }),
        dom({
          type:"select",
          init(e){sortSelect=e},
          children:SORTDIR.map(v=>{
            return dom({
              type:"option",
              text:v,
              value:v
            })
          })
        }),
        dom({
          type:"button",
          text:"使用z-index开始",
          event:{
            click(){
              const filter=filterInput.value
              const dir=sortSelect.value as SORTTYPE
              console.log(filter,dir)
              filterFactory(filter,dir,list)
            }
          }
        }),
        dom({
          type:"input",
          attr:{
            placeholder:"transition如 all 1s"
          },
          event:{
            change(e){
              const v=e.target.value
              transition(v)
            }
          }
        }),
        dom({
          type:"div",
          style:{
            display:"flex",
            'flex-direction':'column'
          },
          children:modelChildren(list,function(me,row,i){
            return dom({
              type:"div",
              style:{
                display(){
                  return row.show()?"flex":'none'
                },
                "justify-content":"space-around",
                order:row.order,
                transition
              },
              children:[
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text:i
                }),
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text:"随机数据"
                }),
                dom({
                  type:"span",
                  style:{
                    flex:1
                  },
                  text:row.value
                })
              ]
            })
          })
        })
      ]
    })
  }
}