import { BuildResult, getAsOne } from "./util";
import { VirtualChild, VirtualChildParam } from "./virtualTreeChildren";

export interface FragmentNode<T, EO> extends BuildResult<T> {
	children: EOChild<T, EO>[]
}
/**
 * 片段自定义组件
 * @param config 
 * @param children 
 * @returns 
 */
export function fragment<T, EO>(p: FragmentNode<T, EO>): EOChild<T, EO> {
	const children = p.children
	return function (parent) {
		const outs: BuildResult<T>[] = []
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
export interface OriginalNode<T, EO> extends BuildResult<T> {
	children: EO[]
}
/**
 * 原生组件
 * @param config 
 * @param children 
 */
export function original<T, EO>(p: OriginalNode<T, EO>): EOChild<T, EO> {
	const children = p.children
	return function (parent) {
		for (const child of children) {
			parent.push(child)
		}
		return p
	}
}
/**重复的函数节点/组件封装成mve*/
export interface EOChild<T, EO> {
	(parent: VirtualChild<EO>): BuildResult<T> | void
}

export function baseChildrenBuilder<T, EO>(children: EOChild<T, EO>, parent: VirtualChild<EO>) {
	return children(parent.newChildAtLast())
}
export function childrenBuilder<T, EO>(x: VirtualChildParam<EO>, children: EOChild<T, EO>[]) {
	const outs: BuildResult<T>[] = []
	const root = VirtualChild.newRootChild(x)
	for (const child of children) {
		const out = baseChildrenBuilder(child, root)
		if (out) {
			outs.push(out)
		}
	}
	return getAsOne(outs)
}