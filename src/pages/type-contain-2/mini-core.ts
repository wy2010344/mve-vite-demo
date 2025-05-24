import { en } from "@faker-js/faker";
import { arrayEqual, kvPair, KVPair } from "wy-helper";

// 基础表达式类型
export type Expr =
  | { tag: 'Var'; name: string }
  | { tag: 'Type' }
  | { tag: 'Lam'; param: string; type: Expr; body: Expr }
  | { tag: 'Pi'; param: string; type: Expr; body: Expr }
  | { tag: 'App'; func: Expr; arg: Expr }
  | { tag: 'Def'; name: string; type: Expr; impl: Expr } // 用于拓展语言
  | { tag: 'Ctor'; name: string; args: Expr[] }


// 类型别名
export type Type = Expr;

// 环境定义（用 KVPair 实现）
export type Env = KVPair<{ type: Type; value?: Expr }> | undefined;

// 变量查找（出错时抛出）
export function lookupVar(env: Env, name: string): Type {
  const found = env?.get(name);
  if (!found) {
    throw new Error(`Unbound variable: ${name}`);
  }
  return found.value.type;
}

/**
 * 替换变量
 * 将e中的name替换成val
 * @param e 
 * @param name 
 * @param val 
 * @returns 
 */
export function subst(e: Expr, name: string, val: Expr): Expr {
  switch (e.tag) {
    case 'Var': return e.name === name ? val : e;
    case 'Type': return e;
    case 'Lam': {
      if (e.param === name) return e;
      return {
        ...e,
        type: subst(e.type, name, val),
        body: subst(e.body, name, val)
      };
    }
    case 'Pi': {
      if (e.param === name) return e;
      return {
        ...e,
        type: subst(e.type, name, val),
        body: subst(e.body, name, val)
      };
    }
    case 'App': return {
      tag: 'App',
      func: subst(e.func, name, val),
      arg: subst(e.arg, name, val)
    };
    case 'Ctor': return {
      tag: "Ctor",
      name: e.name,
      args: e.args.map(arg => subst(arg, name, val))
    }
    case 'Def': return e; // 不替换定义体
  }
}
// 类型推导（抛出异常的形式）
export function infer(env: Env, expr: Expr): Type {
  switch (expr.tag) {
    case 'Var': return lookupVar(env, expr.name);
    case 'Type': return { tag: 'Type' };

    case 'Lam': {
      const envExt = kvPair(expr.param, { type: expr.type }, env);
      const bodyTy = infer(envExt, expr.body);
      return { tag: 'Pi', param: expr.param, type: expr.type, body: bodyTy };
    }

    case 'App': {
      const tf = infer(env, expr.func);
      const tfWhnf = whnf(tf, env);
      if (tfWhnf.tag !== 'Pi') throw new Error('Function must have Pi type');
      const argTy = infer(env, expr.arg);
      if (!exprEquals(argTy, tfWhnf.type)) {
        throw new Error('Function argument type mismatch')
      }
      return subst(tfWhnf.body, tfWhnf.param, expr.arg);
    }

    case 'Pi': {
      const envExt = kvPair(expr.param, { type: expr.type }, env);
      const bodyTy = infer(envExt, expr.body);
      return { tag: 'Type' };
    }

    case 'Ctor': {
      const def = ctorRegistry.get(expr.name);
      if (!def) throw new Error(`Unknown constructor: ${expr.name}`);
      const expectedTypes = def.argTypes(expr.args);
      if (expr.args.length !== expectedTypes.length)
        throw new Error(`Constructor ${expr.name} expects ${expectedTypes.length} arguments`);
      for (let i = 0; i < expr.args.length; i++) {
        const actual = infer(env, expr.args[i]);
        const expected = expectedTypes[i];
        if (!exprEquals(actual, expected)) {
          throw new Error(`Argument ${i} of constructor ${expr.name} has wrong type`);
        }
      }
      return def.returnType(expr.args); // 可以是常量，比如 Nat，或者依赖于 args 的表达式
    }
    case 'Def': {
      const inferred = infer(env, expr.impl);
      if (!exprEquals(inferred, expr.type)) throw new Error(`Definition type mismatch`);
      return expr.type;
    }
  }
}


// 归约到弱头范式（仅用于应用）
export function whnf(expr: Expr, env: Env): Expr {
  if (expr.tag === 'App') {
    const f = whnf(expr.func, env);
    if (f.tag === 'Lam') {
      return whnf(subst(f.body, f.param, expr.arg), env);
    }
    return { tag: 'App', func: f, arg: expr.arg };
  }
  return expr;
}

// 添加定义（可用于用户扩展）
export function addDef(
  env: Env,
  name: string,
  type: Type,
  impl: Expr): Env {
  return kvPair(name, { type, value: impl }, env);
}
export function exprEquals(a: Expr, b: Expr): boolean {
  return alphaEq(a, b, undefined, undefined);
}

function alphaEq(
  e1: Expr,
  e2: Expr,
  xs1: KVPair<string> | undefined,
  xs2: KVPair<string> | undefined
): boolean {
  if (e1.tag !== e2.tag) return false;
  switch (e1.tag) {
    case 'Type': return true;
    case 'Var': {
      const v1 = xs1?.get(e1.name)?.value ?? e1.name;
      const v2 = xs2?.get((e2 as any).name)?.value ?? (e2 as any).name;
      return v1 === v2;
    }
    case 'Lam':
    case 'Pi': {
      const a = e1 as any;
      const b = e2 as any;
      const fresh = gensym();
      return alphaEq(a.type, b.type, xs1, xs2) &&
        alphaEq(
          a.body,
          b.body,
          kvPair(a.param, fresh, xs1),
          kvPair(b.param, fresh, xs2)
        );
    }
    case 'App':
      return alphaEq(e1.func, (e2 as any).func, xs1, xs2) &&
        alphaEq(e1.arg, (e2 as any).arg, xs1, xs2);
    case 'Ctor':
      const e2_ = e2 as typeof e1
      return e1.name == e2_.name && arrayEqual(e1.args, e2_.args, function (e1, e2) {
        return alphaEq(e1, e2, xs1, xs2)
      })
    case 'Def': {
      const a = e1
      const b = e2 as any;
      return a.name === b.name &&
        alphaEq(a.type, b.type, xs1, xs2) &&
        alphaEq(a.impl, b.impl, xs1, xs2);
    }
  }
}
let gensymCounter = 0;
function gensym(): string {
  return `_v${gensymCounter++}`;
}

type CtorRule = {
  argTypes: ((args: Expr[]) => Type[]); // 输入参数类型列表
  returnType: (args: Expr[]) => Type;   // 根据 args 返回的类型
};

/**
 * 类型构造器
 */
const ctorRegistry = new Map<string, CtorRule>();














function Var(name: string): Expr {
  return { tag: 'Var', name };
}
function App(func: Expr, arg: Expr): Expr {
  return { tag: 'App', func, arg };
}
function Pi(param: string, type: Expr, body: Expr): Expr {
  return { tag: 'Pi', param, type, body };
}
function Lam(param: string, type: Expr, body: Expr): Expr {
  return { tag: 'Lam', param, type, body };
}
function Ctor(name: string, args: Expr[]): Expr {
  return { tag: 'Ctor', name, args };
}
function Def(name: string, type: Expr, impl: Expr): Expr {
  return { tag: 'Def', name, type, impl };
}

export function miniCore() {
  ctorRegistry.set("Nil", {
    argTypes(args) {
      return args
    },
    returnType: ([A]) => App(App(Var('Vec'), A), Zero)
  })
  ctorRegistry.set('Cons', {
    argTypes([A, n, head, tail]) {
      return [
        A, n, A, App(App(Var('Vec'), A), n)
      ]
    },
    returnType([A, n]) {
      return App(App(Var("Vec"), A), App(Var('S'), n))
    },
  })
  const Zero: Expr = Var('Z');
  function S(n: Expr): Expr {
    return App(Var('S'), n);
  }
  let env: Env = undefined
  env = addDef(env, 'Nat', { tag: 'Type' }, { tag: 'Var', name: 'Nat' });
  env = addDef(env, 'Z', { tag: 'Var', name: 'Nat' }, Zero);
  env = addDef(env, 'S', Pi('n', Var('Nat'), Var('Nat')), Var('S'));
  // lookupVec : ∀ (A : Type) (n : Nat) → Vec A n → Fin n → A
  const lookupVecType =
    Pi('A', Var('Type'),
      Pi('n', Var('Nat'),
        Pi('vec', App(App(Var('Vec'), Var('A')), Var('n')),
          Pi('i', App(Var('Fin'), Var('n')),
            Var('A')
          ))));
  env = addDef(env, 'lookupVec', lookupVecType, Var('lookupVec'));
  const nat = Var('Nat');
  const zero = Zero;
  const one = S(zero);
  const vec = Ctor('Cons', [
    nat, zero,
    Ctor('Ctor', []), // head = dummy
    Ctor('Nil', [nat])
  ]);
  const fin = Ctor('FZ', [zero]);

  const call = App(
    App(
      App(
        App(Var('lookupVec'), nat),
        one
      ),
      vec
    ),
    fin
  );

  const resultType = infer(env, call); // 应该是 Nat
  console.log("r", resultType)
}

