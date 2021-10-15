

import { mve }from 'mve-core/util'
import { EOChild }from 'mve-core/childrenBuilder'
import testMDX from './test.mdx'
import { transMdx } from './vite-mdx-mve-tsx-plugin/visitTsx'
import { createElement, Dom,Text } from 'mve-dom/tsxSupport'
import { fragment } from 'mve-core/childrenBuilder'
import { dom } from 'mve-dom'

export function support(me:mve.LifeModel){
	return <Dom type="div">
		{/* {transMdx(testMDX)} */}
		<Dom type="div">
			欢迎使用小议的mve。它包含mve-core与mve-dom两部分，前一部分与dom无关，可自定义其它引擎，后一部分是mve-core在dom上的简单桥接。
		</Dom>
		<Dom type="h3">
			git地址
		</Dom>
		<Dom type="ul">
			<LinkA title="当前项目源码地址" url="https://gitee.com/wy2010344/mve-vite-demo.git"/>
			<LinkA title="当前项目源码演示地址" url="https://wy2010344.gitee.io/mve-vite-demo/"/>
			<LinkA title="文章包地址" url="https://gitee.com/wy2010344/article.git"/>
			<LinkSub title={
					<Text>mve-core</Text>
				}
			>
				<LinkA title="gitee" url="https://gitee.com/wy2010344/npm_mve.git"/>
				<LinkA title="github" url="https://github.com/wy2010344/npm_mve.git"/>
			</LinkSub>
			<LinkSub title={
					<Text>mve-dom</Text>
				}
			>
				<LinkA title="gitee" url="https://gitee.com/wy2010344/npm_mve-DOM.git"/>
				<LinkA title="github" url="https://github.com/wy2010344/npm_mve-DOM.git"/>
			</LinkSub>
		</Dom>
		<Dom type="h3">特点</Dom>
		<Dom type="ul">
			{fragment({
				children:[			
					"过程式（函数式）基因，比react更早。作者避免在ts/js中使用class/this等概念。",
					"无组件概念，完全使用编程语言本身的模块(函数)复用。",
					"基础模型只有mve.Value<T>和mve.ArrayModel<T>，构建出庞大的页面逻辑。",
					"界面布局使用纯ts/js，不引入复杂的xml，更高效地复用。",
					"mvvm对属性节点针对性更新(受vue启发)，性能高。并创新地发现使用mve.ArrayModel<T>与界面片段一一对应(支持同级嵌套)，不使用虚拟DOM与任何形式的享元复用，和异步更新。",
					"区分与DOM引擎无关的核心模块，可用于其它自定义引擎。并提供简单的dom桥接模块。",
					"开放可定制自己的mve使用方式。"].map(v=><Dom type="li" text={v}/>)
			})}
		</Dom>
		<Dom type="div" style={{
					"text-align":"center"
		}}>
			创作不易，如果给你带来帮助，欢迎给作者打赏。
			<Dom type="h4">微信</Dom>
			<Dom type="img" attr={{src:"https://wy2010344.gitee.io/article/%E5%BE%AE%E4%BF%A1%E6%94%B6%E6%AC%BE%E7%A0%81-small.png"}}/>
			<Dom type="h4">支付宝</Dom>
			<Dom type="img" attr={{src:"https://wy2010344.gitee.io/article/%E6%94%AF%E4%BB%98%E5%AE%9D%E6%94%B6%E6%AC%BE%E7%A0%81-small.png"}}/>
		</Dom>
	</Dom>
}

export function LinkSub(p:{
	title:JSX.Element
	children:EOChild<Node>|EOChild<Node>[]
},...children:EOChild<Node>[]){
	return <Dom type="li">
		{p.title}
		{dom({
			type:"ul",
			children
		})}
	</Dom>
}
function LinkA(p:{title:string,url:string}){
	return <Dom type="li">
		<Text>{p.title}</Text>
		<Href url={p.url}/>
	</Dom>
}

export function Href(p:{url:string}){
	return <Dom type="a" attr={{href:p.url}}>{p.url}</Dom>
}