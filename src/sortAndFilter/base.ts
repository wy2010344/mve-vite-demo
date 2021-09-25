import { mve,BaseArray,SimpleArray } from 'mve-core/util'
import { dom } from 'mve-dom'

import { modelChildren } from 'mve-core/modelChildren'



const SORTDIR=['asc','desc','none'] as const
export type SORTTYPE=(typeof SORTDIR)[number]
/**
 * 过滤头部
 * @param filterFactory 
 * @returns 
 */
export function filterSortArea(filterFactory:(filter:string,dir:SORTTYPE)=>void){
	let filterInput:HTMLInputElement
	let sortSelect:HTMLSelectElement
	return [
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
			text:"开始搜索",
			event:{
				click(){
					const begin=Date.now()
					const filter=filterInput.value
					const dir=sortSelect.value as SORTTYPE
					console.log(filter,dir)
					filterFactory(filter,dir)
					console.log("消耗时间",Date.now()-begin)
				}
			}
		})
	]
}

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

export const totalData:number[]=[]
for(let i=0;i<300;i++){
	totalData.push(Math.floor(Math.random() * 10000))
}

export function sortAndFilterBase(filterFactory:(text:string,dir:SORTTYPE,arr:mve.ArrayModel<Row>)=>void){
  return function(me:mve.LifeModel){  
    const list=mve.arrayModelOf<Row>(totalData.map((v,i)=>{
			return {
        index:i,
        show:mve.valueOf(true),
        order:mve.valueOf(0),
        value:v
			}
		}))
    const transition=mve.valueOf('')
    return dom({
      type:"div",
      children:[
				filterSortArea(function(text,dir){
					filterFactory(text,dir,list)
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
            'flex-direction':'column',
            'font-family':'Monaco',
            'letter-spacing':'2px',
            'text-align':'right'
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