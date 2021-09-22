

import { mve }from 'mve-core/util'
import { dom } from 'mve-dom'
import { EOChildren }from 'mve-core/childrenBuilder'
export function support(me:mve.LifeModel){
  return dom({
    type:"div",
    children:[
      dom({
        type:"div",
        text:`欢迎使用小议的mve。它包含mve-core与mve-dom两部分，前一部分与dom无关，可自定义其它引擎，后一部分是mve-core在dom上的简单桥接。`
      }),
      dom({
        type:"h3",
        text:"git地址"
      }),
      dom({
        type:"ul",
        children:[
          linkA("当前项目源码地址","https://gitee.com/wy2010344/mve-vite-demo.git"),
          linkA("当前项目源码演示地址","https://wy2010344.gitee.io/mve-vite-demo/"),
          linkA("文章包地址","https://gitee.com/wy2010344/article.git"),
          linkSub("mve-core",[
            linkA("gitee","https://gitee.com/wy2010344/npm_mve.git"),
            linkA("github","https://github.com/wy2010344/npm_mve.git")
          ]),
          linkSub("mve-dom",[
            linkA("gitee","https://gitee.com/wy2010344/npm_mve-DOM.git"),
            linkA("github","https://github.com/wy2010344/npm_mve-DOM.git")
          ])
        ]
      }),
      dom({
        type:"h3",
        text:"特点"
      }),
      dom({
        type:"ul",
        children:[
          "过程式（函数式）基因，比react更早。作者避免在ts/js中使用class/this等概念。",
          "无组件概念，完全使用编程语言本身的模块(函数)复用。",
          "基础模型只有mve.Value<T>和mve.ArrayModel<T>，构建出庞大的页面逻辑。",
          "界面布局使用纯ts/js，不引入复杂的xml，更高效地复用。",
          "mvvm对属性节点针对性更新(受vue启发)，性能高。并创新地发现使用mve.ArrayModel<T>与界面片段一一对应(支持同级嵌套)，不使用虚拟DOM与任何形式的享元复用，和异步更新。",
          "区分与DOM引擎无关的核心模块，可用于其它自定义引擎。并提供简单的dom桥接模块。",
         "开放可定制自己的mve使用方式。"
        ].map(v=>{
          return dom({
            type:"li",
            text:v
          })
        })
      }),
			dom({
				type:"div",
				style:{
					"text-align":"center"
				},
				children:[
					dom("创作不易，如果给你带来帮助，欢迎给作者打赏。"),
					dom({
						type:"h4",
						text:"微信"
					}),
					dom({
						type:"img",
						attr:{
							src:"https://wy2010344.gitee.io/article/%E5%BE%AE%E4%BF%A1%E6%94%B6%E6%AC%BE%E7%A0%81-small.png"
						}
					}),
					dom({
						type:"h4",
						text:"支付宝"
					}),
					dom({
						type:"img",
						attr:{
							src:"https://wy2010344.gitee.io/article/%E6%94%AF%E4%BB%98%E5%AE%9D%E6%94%B6%E6%AC%BE%E7%A0%81-small.png"
						}
					})
				]
			})
    ]
  })
}

export function linkSub(title:string,children:EOChildren<Node>){
  return dom({
    type:"li",
    children:[
      dom(title),
      dom({
        type:"ul",
        children
      })
    ]
  })
}
function linkA(title:string,url:string){
  return dom({
    type:"li",
    children:[
      dom(title+"："),
      aHref(url)
    ]
  })
}

export function aHref(url:string){
  return dom({
    type:"a",
    text:url,
    attr:{
      href:url
    }
  })
}