// 标识符（变量/构造器/数据类型的名字）
export type Ident = string;

// token 类型（带位置的关键词，比如 `data`、`case`）
export type CaseTk = { pos: [number, number]; name: string };
export type DataTk = { pos: [number, number]; name: string };

// 表达式（核心语法）
export type Exp =
  | { tag: 'Lam'; param: Patt; body: Exp }           // λ表达式
  | { tag: 'Set' }                                   // 类型宇宙 Set
  | { tag: 'Pi'; param: Patt; type: Exp; body: Exp } // Π类型
  | { tag: 'Sig'; param: Patt; fst: Exp; snd: Exp }  // Σ类型（依赖对）
  | { tag: 'One' }                                   // 1 类型（终对象）
  | { tag: 'Unit' }                                  // 单元值
  | { tag: 'Pair'; fst: Exp; snd: Exp }              // 构造对
  | { tag: 'Con'; name: Ident; value: Exp }          // 构造器应用
  | { tag: 'Data'; keyword: DataTk; summands: Summand[] } // 数据类型声明
  | { tag: 'Case'; keyword: CaseTk; branches: Branch[] }  // 模式匹配
  | { tag: 'Fst'; pair: Exp }                        // 投影 1
  | { tag: 'Snd'; pair: Exp }                        // 投影 2
  | { tag: 'App'; func: Exp; arg: Exp }              // 函数应用
  | { tag: 'Var'; name: Ident }                      // 变量引用
  | { tag: 'Void' }                                  // 空类型
  | { tag: 'Dec'; decl: Decl; inExpr: Exp }          // let 定义
  | { tag: 'PN' }                                    // 特殊（暂未知，可能是 placeholder）

// 顶层或局部声明
export type Decl =
  | { tag: 'Def'; name: Patt; type: Exp; value: Exp }     // 普通定义
  | { tag: 'Drec'; name: Patt; type: Exp; value: Exp }    // 递归定义

// 模式（用于 λ、Π、Σ、定义）
export type Patt =
  | { tag: 'PVar'; name: Ident }                // 变量
  | { tag: 'Punit' }                            // 单元模式
  | { tag: 'PPair'; fst: Patt; snd: Patt }      // 对模式

// 数据构造器声明
export type Summand = {
  tag: 'Summand';
  name: Ident;
  type: Exp;
};

// case 分支
export type Branch = {
  tag: 'Branch';
  name: Ident;
  body: Exp;
};