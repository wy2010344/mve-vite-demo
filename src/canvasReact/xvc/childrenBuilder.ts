import { BuildResult, getAsOne } from "./util";
import { VirtualChild, VirtualChildParam } from "./virtualTreeChildren";

export interface FragmentNode<EO> extends BuildResult {
	children: EOChild<EO>[]
}
/**
 * 片段自定义组件
 * @param config 
 * @param children 
 * @returns 
 */
export function fragment<EO>(p: FragmentNode<EO>): EOChild<EO> {
	const children = p.children
	return function (parent) {
		const outs: BuildResult[] = []
		outs.push(p)
		for (const child of children) {
			const out = baseChildrenBuilder(child, parent)
			if (out) {
				outs.push(out)
			}
		}
		return getAsOne(outs)
	}
}
export interface OriginalNode<EO> extends BuildResult {
	children: EO[]
}
/**
 * 原生组件
 * @param config 
 * @param children 
 */
export function original<EO>(p: OriginalNode<EO>): EOChild<EO> {
	const children = p.children
	return function (parent) {
		for (const child of children) {
			parent.push(child)
		}
		return p
	}
}
/**重复的函数节点/组件封装成mve*/
export interface EOChild<EO> {
	(parent: VirtualChild<EO>): BuildResult | void
}

export function baseChildrenBuilder<EO>(children: EOChild<EO>, parent: VirtualChild<EO>) {
	return children(parent.newChildAtLast())
}
export function childrenBuilder<EO>(x: VirtualChildParam<EO>, children: EOChild<EO>[]) {
	const outs: BuildResult[] = []
	const root = VirtualChild.newRootChild(x)
	for (const child of children) {
		const out = baseChildrenBuilder(child, root)
		if (out) {
			outs.push(out)
		}
	}
	return getAsOne(outs)
}