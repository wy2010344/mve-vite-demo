import { KVPair, kvPair } from 'wy-helper';

// 基础表达式类型
export type Expr =
  | { tag: 'Var'; name: string }
  | { tag: 'Type' }
  | { tag: 'Lam'; param: string; type: Expr; body: Expr }
  | { tag: 'Pi'; param: string; type: Expr; body: Expr }
  | { tag: 'App'; func: Expr; arg: Expr }
  | { tag: 'Def'; name: string; type: Expr; impl: Expr }
  | { tag: 'Ctor'; name: string; args: Expr[] };

export type Type = Expr;
export type Env = KVPair<{ type: Type; value?: Expr }> | undefined;

export type CtorRule = {
  params: string[];
  argTypes: (args: Expr[]) => Type[];
  returnType: (args: Expr[]) => Type;
};

export const ctorEnv: Record<string, CtorRule> = {};

export function registerCtor(name: string, rule: CtorRule) {
  ctorEnv[name] = rule;
}

export function lookupVar(env: Env, name: string): Type {
  const found = env?.get(name);
  if (!found) throw new Error(`Unbound variable: ${name}`);
  return found.value.type;
}

export function subst(e: Expr, name: string, val: Expr): Expr {
  switch (e.tag) {
    case 'Var': return e.name === name ? val : e;
    case 'Type': return e;
    case 'Lam':
      if (e.param === name) return e;
      return { ...e, type: subst(e.type, name, val), body: subst(e.body, name, val) };
    case 'Pi':
      if (e.param === name) return e;
      return { ...e, type: subst(e.type, name, val), body: subst(e.body, name, val) };
    case 'App': return { tag: 'App', func: subst(e.func, name, val), arg: subst(e.arg, name, val) };
    case 'Def': return e;
    case 'Ctor': return { tag: 'Ctor', name: e.name, args: e.args.map(arg => subst(arg, name, val)) };
  }
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
        alphaEq(a.body, b.body, kvPair(a.param, fresh, xs1), kvPair(b.param, fresh, xs2));
    }
    case 'App':
      return alphaEq(e1.func, (e2 as any).func, xs1, xs2) &&
        alphaEq(e1.arg, (e2 as any).arg, xs1, xs2);
    case 'Def': {
      const a = e1 as any;
      const b = e2 as any;
      return a.name === b.name &&
        alphaEq(a.type, b.type, xs1, xs2) &&
        alphaEq(a.impl, b.impl, xs1, xs2);
    }
    case 'Ctor': {
      const a = e1 as any;
      const b = e2 as any;
      if (a.name !== b.name || a.args.length !== b.args.length) return false;
      return a.args.every((arg: Expr, i: number) => alphaEq(arg, b.args[i], xs1, xs2));
    }
  }
}

let gensymCounter = 0;
function gensym(): string {
  return `_v${gensymCounter++}`;
}

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
      if (!exprEquals(argTy, tfWhnf.type)) throw new Error('Function argument type mismatch');
      return subst(tfWhnf.body, tfWhnf.param, expr.arg);
    }
    case 'Pi': {
      const envExt = kvPair(expr.param, { type: expr.type }, env);
      const bodyTy = infer(envExt, expr.body);
      return { tag: 'Type' };
    }
    case 'Def': {
      const inferred = infer(env, expr.impl);
      if (!exprEquals(inferred, expr.type)) throw new Error(`Definition type mismatch`);
      return expr.type;
    }
    case 'Ctor': {
      const rule = ctorEnv[expr.name];
      if (!rule) throw new Error(`Unknown constructor: ${expr.name}`);
      const expected = rule.argTypes(expr.args);
      if (expected.length !== expr.args.length) {
        throw new Error(`Constructor ${expr.name} expects ${expected.length} args`);
      }
      for (let i = 0; i < expr.args.length; i++) {
        const inferred = infer(env, expr.args[i]);
        if (!exprEquals(inferred, expected[i])) {
          throw new Error(`Arg ${i} type mismatch`);
        }
      }
      return rule.returnType(expr.args);
    }
  }
}

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

export function addDef(env: Env, name: string, type: Type, impl: Expr): Env {
  return kvPair(name, { type, value: impl }, env);
}

// === DEMO ===

const Var = (name: string): Expr => ({ tag: 'Var', name });
const App = (func: Expr, arg: Expr): Expr => ({ tag: 'App', func, arg });
const Pi = (param: string, type: Expr, body: Expr): Expr => ({ tag: 'Pi', param, type, body });
const Ctor = (name: string, args: Expr[]): Expr => ({ tag: 'Ctor', name, args });
const Type: Expr = { tag: 'Type' };

const Z = Var('Z');
const S = (n: Expr): Expr => App(Var('S'), n);
const Nat = Var('Nat');
const Fin = (n: Expr): Expr => App(Var('Fin'), n);
const Vec = (A: Expr, n: Expr): Expr => App(App(Var('Vec'), A), n);

function getDef(env: Env, key: string) {
  return env?.get(key)?.value.type
}
export function m2() {
  let env: Env = undefined;

  env = addDef(env, 'Type', Type, Type);
  env = addDef(env, 'Nat', Type, Var('Nat'));
  env = addDef(env, 'Z', getDef(env, 'Nat')!, Var('Z'));
  env = addDef(env, 'S', Pi('n', getDef(env, 'Nat')!, Var('Nat')), Var('S'));
  env = addDef(env, 'Fin', Pi('n', Var('Nat'), Type), Var('Fin'));
  env = addDef(env, 'Vec', Pi('A', Type, Pi('n', Var('Nat'), Type)), Var('Vec'));

  registerCtor('FZ', {
    params: ['n'],
    argTypes: ([n]) => [n],
    returnType: ([n]) => Fin(S(n))
  });

  registerCtor('FS', {
    params: ['n', 'f'],
    argTypes: ([n, f]) => [n, Fin(n)],
    returnType: ([n]) => Fin(S(n))
  });

  registerCtor('Nil', {
    params: ['A'],
    argTypes: ([A]) => [Type],
    returnType: ([A]) => Vec(A, Z)
  });

  registerCtor('Cons', {
    params: ['A', 'n', 'head', 'tail'],
    argTypes: ([A, n, head, tail]) => [Type, Var('Nat'), A, Vec(A, n)],
    returnType: ([A, n]) => Vec(A, S(n))
  });

  // 添加 lookupVec 类型
  const lookupVecType = Pi('A', Type,
    Pi('n', Var('Nat'),
      Pi('v', Vec(Var('A'), Var('n')),
        Pi('i', Fin(Var('n')),
          Var('A')))));
  env = addDef(env, 'lookupVec', lookupVecType, Var('lookupVec'));
  env = addDef(env, 'x', Var('Nat'), Var('x'));

  // 构造 Vec Nat (S Z)
  const vec = Ctor('Cons', [Var('Nat'), Var('Z'), Var('x'), Ctor('Nil', [Var('Nat')])]);

  // 构造 Fin (S Z) 元素 FZ Z
  const index = Ctor('FZ', [Var('Z')]);

  // lookupVec Nat (S Z) vec (FZ Z)
  const call = App(
    App(
      App(
        App(Var('lookupVec'), Var('Nat')),
        S(Var('Z'))),
      vec),
    index);

  console.log('推导类型:', infer(env, call));
}