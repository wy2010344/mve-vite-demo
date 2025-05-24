


type Expr =
  | { tag: 'Var'; name: string }
  | { tag: 'Type' }
  | { tag: 'Pi'; param: string; type: Expr; body: Expr }
  | { tag: 'Lam'; param: string; type: Expr; body: Expr }
  | { tag: 'App'; func: Expr; arg: Expr }
  | DataExpr// 通用数据类型和构造器


type DataExpr = { tag: 'Data'; name: string; args: Expr[] }

type Env = Map<string, Expr>;

function lookup(env: Env, name: string): Expr {
  const v = env.get(name);
  if (!v) throw new Error(`Unbound var: ${name}`);
  return v;
}

// === 数据类型注册表 ===
type DataTypeDef = {
  name: string;
  constructors: Record<string, Expr[]>; // 构造器参数类型列表
  checkType: (env: Env, expr: DataExpr) => Expr;
};
const dataTypeRegistry = new Map<string, DataTypeDef>();
function registerDataType(def: DataTypeDef) {
  dataTypeRegistry.set(def.name, def);
}



// === 类型推导（简易版） ===
function infer(env: Env, expr: Expr): Expr {
  switch (expr.tag) {
    case 'Var':
      return lookup(env, expr.name);

    case 'Type':
      return { tag: 'Type' };

    case 'Pi': {
      const typeType = infer(env, expr.type);
      if (typeType.tag !== 'Type') throw new Error('Pi domain must be a Type');
      const env2 = new Map(env);
      env2.set(expr.param, expr.type);
      const bodyType = infer(env2, expr.body);
      if (bodyType.tag !== 'Type') throw new Error('Pi codomain must be a Type');
      return { tag: 'Type' };
    }

    case 'Lam': {
      const env2 = new Map(env);
      env2.set(expr.param, expr.type);
      const bodyType = infer(env2, expr.body);
      return { tag: 'Pi', param: expr.param, type: expr.type, body: bodyType };
    }

    case 'App': {
      const funcType = infer(env, expr.func);
      if (funcType.tag !== 'Pi') throw new Error('Apply to non-function');
      const argType = infer(env, expr.arg);
      if (!exprEquals(argType, funcType.type)) throw new Error('Argument type mismatch');
      // 替换返回类型中的形参
      return subst(funcType.body, funcType.param, expr.arg);
    }

    case 'Data': {
      const def = dataTypeRegistry.get(expr.name);
      if (!def) throw new Error(`Unknown data type: ${expr.name}`);
      return def.checkType(env, expr);
    }
  }
}


// === 简单的表达式相等性检查（结构相等） ===

function exprEquals(a: Expr, b: Expr): boolean {
  if (a.tag !== b.tag) return false;
  switch (a.tag) {
    case 'Var': return a.name === (b as any).name;
    case 'Type': return true;
    case 'Pi':
    case 'Lam':
      return a.param === (b as any).param
        && exprEquals(a.type, (b as any).type)
        && exprEquals(a.body, (b as any).body);
    case 'App':
      return exprEquals(a.func, (b as any).func) && exprEquals(a.arg, (b as any).arg);
    case 'Data':
      if (a.name !== (b as any).name) return false;
      if (a.args.length !== (b as any).args.length) return false;
      for (let i = 0; i < a.args.length; i++) {
        if (!exprEquals(a.args[i], (b as any).args[i])) return false;
      }
      return true;
  }
}

// === 简单替换函数（只替换Var） ===

function subst(expr: Expr, param: string, val: Expr): Expr {
  switch (expr.tag) {
    case 'Var': return expr.name === param ? val : expr;
    case 'Type': return expr;
    case 'Pi': {
      if (expr.param === param) return expr;
      return { tag: 'Pi', param: expr.param, type: subst(expr.type, param, val), body: subst(expr.body, param, val) };
    }
    case 'Lam': {
      if (expr.param === param) return expr;
      return { tag: 'Lam', param: expr.param, type: subst(expr.type, param, val), body: subst(expr.body, param, val) };
    }
    case 'App': return { tag: 'App', func: subst(expr.func, param, val), arg: subst(expr.arg, param, val) };
    case 'Data': return { tag: 'Data', name: expr.name, args: expr.args.map(a => subst(a, param, val)) };
  }
}



// === 注册一个简单的Nat数据类型 ===

registerDataType({
  name: 'Nat',
  constructors: {
    zero: [],
    succ: [{ tag: 'Data', name: 'Nat', args: [] }],
  },
  checkType(env, expr) {
    if (expr.args.length === 0 && expr.name === 'zero') {
      return { tag: 'Data', name: 'Nat', args: [] };
    }
    if (expr.name === 'succ' && expr.args.length === 1) {
      const argTy = infer(env, expr.args[0]);
      if (argTy.tag === 'Data' && argTy.name === 'Nat') {
        return { tag: 'Data', name: 'Nat', args: [] };
      }
      throw new Error('succ argument must be Nat');
    }
    throw new Error(`Invalid constructor for Nat: ${expr.name}`);
  },
});

// === 测试 ===

// 环境初始化，Nat类型本身的类型是 Type
const globalEnv: Env = new Map();
globalEnv.set('Nat', { tag: 'Type' });

// 表示 Nat
const natType: Expr = { tag: 'Data', name: 'Nat', args: [] };
// 表示 0
const zero: Expr = { tag: 'Data', name: 'zero', args: [] };

// 表示 succ(0)
const one: Expr = { tag: 'Data', name: 'succ', args: [zero] };

// 测试推导
console.log('zero type:', infer(globalEnv, zero)); // 应该是 Nat
console.log('one type:', infer(globalEnv, one));   // 应该是 Nat