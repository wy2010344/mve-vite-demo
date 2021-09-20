
///https://zhuanlan.zhihu.com/p/91144493

export {}

interface IA {
  d: string;
  e: string;
}

interface ID {
  h: string
}

interface IC {
  f: string;
  g: ID,
  i: IB[]
}

interface IB {
  a: boolean;
  b: IA;
  c: IC;
  h: IB[]
}


/**找出不是object的key */
type NonObjectPropKeys<T> = { [K in keyof T]: T[K] extends any[] ? K : T[K] extends object ? never : K }[keyof T]

/**挑出不是Object的字段 */
type NonObjectPicks<T> = Pick<T, NonObjectPropKeys<T>>

/**挑出是Object的字段 */
type ObjectPicks<T> = Pick<T, Exclude<keyof T, NonObjectPropKeys<T>>>

type Obj<T> = T extends object ? T : never

/**联合转交叉*/
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type FlattenObjectKey<T> = {
  'default': T extends object ?
    UnionToIntersection<Obj<T[keyof T]>> extends object ?
      NonObjectPicks<T> & FlattenObjectKey<ObjectPicks<T>[keyof ObjectPicks<T>]>
      : T : never,
  'array': T
}[T extends any[] ? 'array' : T extends object ? 'default' : never]

/**
 * 总体思路
 * 将顶层终节点取出
 * 将子层叠加聚合
 */
type FlattenObject<T extends object> = NonObjectPicks<T>
  & UnionToIntersection<FlattenObjectKey<ObjectPicks<T>[keyof ObjectPicks<T>]>>


type A=FlattenObject<IB>