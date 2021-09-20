
/////////////

import { QueryParam, QueryWrapper } from "../router"

interface CRouter{
	[key:string]:QueryWrapper<QueryParam> | CSubRouter
}
interface CSubRouter{
	[key:string]:CRouter
}

/*V extends {
	[key1 in infer KV] : any
} ? KV extends string ? {
	[key2 in `${PF}/${KV}` ] : V[key2]
} : never : never
*/


export type PrefixCS<PF extends string,V extends CRouter>=V extends {
	[key in infer KV] : any
} ? KV extends string ? {
	key:`${PF}/${KV}`,
	arg:V[KV]
} : never : never

export type PrefixC<V extends CRouter>=V extends {
	[key in infer KV]:any
} ? KV extends string ? {
	key:KV
	arg:V[KV]
} : never : never

///////////////////////////////
type av=PrefixCS<"aa",{
	a:QueryWrapper<{
		x:string
		y:string
	}>,
	b:QueryWrapper<{
		login:string,
		z:string
	}>
}>

type JOINCS<S extends CSubRouter>=S extends {
	[sk in infer SK] : CRouter
} ? SK extends string
	? PrefixCS<SK,S[SK]> : never
	: never
/*
{
	a:VQ<{
		x:string
		y:string
	}>,
	b:VQ<{
		login:string,
		z:string
	}>
},
*/
type VC=PrefixC<{
	a:QueryWrapper<{
		x:string
		y:string
	}>,
	b:QueryWrapper<{
		login:string,
		z:string
	}>
}>
type VCS=JOINCS<{
	f1:{
		f2:QueryWrapper<{
			k:string
			z:string
		}>
	},
	f3:{
		vk:QueryWrapper<{
			km:string
			kv:string
		}>
	}
}>

type VVV=VC | VCS
/////////////////////////////////////////////////////

export {}