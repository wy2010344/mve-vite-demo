/**
 * data Val =
     Lam Clos
  |  Pair Val Val
  |  Con Name Val
  |  Unit
  |  Set
  |  Pi  Val Clos
  |  Sig Val Clos
  |  One
  |  Fun  Pos SClos
  |  Data Pos SClos 
  |  Nt Neut
 */

import { Ident } from "./AbsCore"

export type Name = Ident
//值域
export type Val =
  | { tag: "Lam", value: Clos }//λ抽象
  | { tag: "Pair", left: Val, right: Val } //依赖对
  | { tag: "Con", name: Name, value: Val }//构造子（用于代数数据类型）
  | { tag: "Unit" }//单元类型
  | { tag: "Set" }//类型的类型
  | { tag: "Pi", val: Val, clos: Clos }//Π类型（依赖函数类型
  | { tag: "Sig", val: Val, clos: Clos }//Σ类型（依赖对类型）
  | { tag: "Fun", pos: Pos, clos: SClos }//函数定义匹配（case）
  | { tag: "Data", pos: Pos, clos: SClos }//数据定义
  | { tag: "Nt", value: Neut }//未归约项

/**
 * data Neut = Gen  Int Name       -- 变量生成
        | App  Neut Nf        -- 应用
        | Fst  Neut | Snd Neut-- 对对的操作
        | NtFun Pos SClos Neut-- case 函数应用
 */
//中性项
type Neut =
  | { tag: "Gen", id: number, value: Name }//变量生成
  | { tag: "App", fun: Neut, arg: Nf }//应用
  | { tag: "Fst", value: Neut } //对的前一部分
  | { tag: "Snd", value: Neut } //对的后一部分
  | { tag: 'NtFun', pos: Pos, clos: SClos, value: Neut }//case函数的应用

type SClos = {

}
type Clos = {

}

type Pos = {

}

type Nf = {

}

