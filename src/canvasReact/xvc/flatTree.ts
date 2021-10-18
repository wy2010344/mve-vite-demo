
/**
 * 打平一棵树
 * T 树
 * V 树的叶子类型
 * S 打平后key的分割
 */
export type FlatTree<T, V, S extends string> = {
	[k1 in IncludeKey<T, V>]: T[k1]
} & CombineRouterSub<ExcludeKey<T, V> & string, T, S>

/**子级加前缀 */
export type CombineRouterSub<K extends (keyof V & string), V, S extends string> = UnionToIntersection<ToUnion<K, V[K], S>>
/**加前缀，变联合*/
type ToUnion<K extends string, V, S extends string> = V extends {
	[key in infer KV]: any
} ? KV extends string ? {
	[key2 in `${K}${S}${KV}`]: V[KV]
} : never : never

/**
 * 联合转交叉
 */
export type UnionToIntersection<U> =
	(U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
* T里选择value的类型是F的key
*/
export type IncludeKey<T, F> = {
	[key in keyof T]: T[key] extends F ? key : never
}[keyof T]
/**
* T里选择value的类型不是F的key
*/
export type ExcludeKey<T, F> = {
	[key in keyof T]: T[key] extends F ? never : key
}[keyof T]
