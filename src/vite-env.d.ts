/// <reference types="vite/client" />

declare namespace JSX {
	type IntrinsicElements=import("mve-dom/tsxSupport").JSX.IntrinsicElements
	type Element=import("mve-dom/tsxSupport").JSX.Element
	type ElementChildrenAttribute=import('mve-dom/tsxSupport').JSX.ElementChildrenAttribute
}

declare module '*.mdx'{
	let MDXComponent:import("./vite-mdx-mve-tsx-plugin/visitTsx").MdxAstType[]
	export default MDXComponent
}