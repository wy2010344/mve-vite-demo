import { dom, domText } from "mve-dom/index";
import { mve } from 'mve-core/util'
import { modelChildren } from 'mve-core/modelChildren'
import { fragment } from 'mve-core/childrenBuilder'



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
        children:[
					modelChildren(children,treeBranch)
				]
			})
    ]
  })
}
export function tree(me:mve.LifeModel){
  const rootList=mve.arrayModelOf<TreeRow>([])
	return fragment({
		children:[
			domText({
				text:"tree"
			}),
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
				children:[
					modelChildren(rootList,treeBranch)
				]
			})
		]
	})
}