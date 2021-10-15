import { defineConfig,PluginOption,transformWithEsbuild } from 'vite'
export default defineConfig({
	server:{
		port:4000
	},
	base:'./',
	plugins:[
		viteMveMdxPlugin()
	]
})

import mdx from '@mdx-js/mdx'
import {mdxStringifyMve} from './src/vite-mdx-mve-tsx-plugin/mdxTransfier'
function viteMveMdxPlugin():PluginOption{
	const compiler=mdx.createCompiler()
	return {
		name:"vite-mve-mdx-tsx-plugin",
		enforce:"pre",
		async transform(code,id){
			if(/\.mdx?$/.test(id)){
				const node=compiler.parse(code)
				const nCode= ` 
import {Dom,createElement,Svg} from 'mve-dom/tsxSupport'
export default ${mdxStringifyMve(code)}
				`
				console.log(nCode)
				const out=await transformWithEsbuild(nCode,id+".tsx")
				return out
			}
		}
	}
}