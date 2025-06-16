function assert(bool, message) {
  if (!bool) {
    throw new Error(message);
  }
}
let nVars = 0;
function fresh() {
  return "x" + nVars++;
}

function struct(e) {
  if (e instanceof Array) {
    //如果是数据,每个成员转化成类型
    return e.map(struct);
  }
  if (e instanceof Function) {
    let x = fresh();
    //如果是函数,假设一个参数,计算出返回类型
    return ["=>", x, struct(e(x))];
  }
  return e;
}

function stringify(e) {
  let save = nVars;
  try {
    return JSON.stringify(struct(e));
  } finally {
    nVars = save;
  }
}

function isfun0(f) {
  return f instanceof Function;
}
function fun0(f) {
  assert(isfun0(f));
  return f;
}
function app0(f, a) {
  if (isfun0(f)) {
    return f(a);
  } else return [f, a];
}

/**
 * 函数A->B泛化为依赖函数类型(x:A)->B,其中允许结果类型B引用x
 * @param {*} atp 对应A,就是限制入参类型
 * @param {*} f 函数表达式
 * @returns
 */

function forall0(atp, f) {
  return ["forall", atp, f];
}

function isforall0(f) {
  return f instanceof Array && f[0] == "forall";
}

/**
 *
 * @param {*} e 值
 * @param {*} t 类型
 * @returns
 */
function typed(e, t) {
  let o = (a) => {
    // console.log("执行到这里...")
    return app(o, a);
  };
  o.untyped = e;
  o.type = t;
  return o;
}

function istyped(e) {
  return e.untyped && e.type;
}
/**
 *
 * @param {*} e
 * @returns [值,所属类型]
 */
function untyped(e) {
  assert(istyped(e), "no type: " + e);
  return [e.untyped, e.type];
}

/**
 * forall类型 即pie类型
 * @param {*} atp 限定入参类型
 * @param {*} f 映射方式
 * @returns
 */
function forall(atp, f) {
  let [atpt, atpk] = untyped(atp);
  assert(atpk == "Type" || atpk == "Kind", "illegal arg type/kind: " + atpk);
  let [res, tpe] = untyped(f(typed("x?", atpt))); //返回类型
  return typed(
    forall0(atpt, (x) => applyFunToUnTyped(f, x, atpt)[0]),
    tpe //上级类型
  );
}

function applyFunToUnTyped(f, x, atpt) {
  return untyped(f(typed(x, atpt)));
}

/**
 *
 * @param {*} atp [atpt,atpk]包含类型及其kind 函数的入参限定类型
 * @param {*} f 函数体
 * @returns
 */
function fun(atp, f) {
  let [atpt, atpk] = untyped(atp);
  assert(atpk == "Type" || atpk == "Kind", "illegal arg type/kind: " + atpk);

  return typed(
    fun0((x) => applyFunToUnTyped(f, x, atpt)[0]), //包装后的原始函数
    forall0(atpt, (x) => applyFunToUnTyped(f, x, atpt)[1]) //根据入参类型包装后的函数类型
  );
}

/**
 * 执行
 * @param {*} f 函数(f真实函数,forall类型)
 * @param {*} a 参数
 * @returns
 */
function app(f, a) {
  let [f1, ftp] = untyped(f);
  let [a1, atp] = untyped(a);
  assert(isforall0(ftp), "not a function: " + f);
  let [key, ptp, frtp] = ftp; //key就是forall
  assert(
    stringify(atp) == stringify(ptp),
    "type mismatch: " + stringify(atp) + " != " + stringify(ptp)
  );
  //计算得到返回值
  let res = app0(f1, a1);
  //返回类型依赖具体的入参值,所以计算出真实的返回类型
  let rtp = frtp(a1);
  return typed(res, rtp);
}

/**
 * 声明子类型
 * @param {*} tm 子类型
 * @param {*} ty 上级类型
 * @returns
 */
function constant(tm, ty) {
  let [tyt, tyk] = untyped(ty);
  assert(tyk == "Type" || tyk == "Kind", "illegal arg type/kind: " + tyk);
  return typed(tm, tyt);
}

const Type = typed("Type", "Kind");
function printt(label, e) {
  let [tm, ty] = untyped(e);
  console.log(label, "term: " + stringify(tm));
  console.log(label, "type: " + stringify(ty));
}
let typeId = fun(Type, (t) => t);
printt("typeId", typeId);

/**
 * 这里,即是内部函数的参数类型,是外部的值类型
 *
 * 这个polyId,每一次传参决定最终的类型
 * 返回的本质是quote,但这个quote将类型转换成第一次的类型
 * 即对于所有的M,其下的值x,这个计算返回x,返回类型仍然是M
 */
let polyId = fun(Type, (t) => fun(t, (x) => x));
// let polyId = fun(Type, t => fun(t, x => fun(t, y => y)(x)))
printt("polyId", polyId);

//皮来诺数类型
let N = constant("N", Type);
let z = constant("z", N);
let s = constant(
  "s",
  forall(N, (x) => N)
);

// 这里就用到了typed里的函数
//
/**
let three = s(s(s(z)))
term: ["s",["s",["s","z"]]]
type: "N"
 */

//邱奇数
let ff = (T) => forall(T, (x) => T); // fun type T->T
let ChurchT = forall(Type, (N) => forall(N, (z) => forall(ff(N), (s) => N)));
let ChurchN = (f) =>
  fun(Type, (N) => fun(N, (z) => fun(ff(N), (s) => f(N)(z)(s))));
//邱奇数转化成皮来诺数
let peano = fun(ChurchT, (n) => n(N)(z)(s));
let three = ChurchN((N) => (z) => (s) => s(s(s(z))));
printt("ChurchT", ChurchT);
printt("three", three);
printt("peano(three)", peano(three));
//这个展示会好很多
/**
 term: ["s",["s",["s","z"]]]
type: "N"
 */

let plus = fun(ChurchT, (a) =>
  fun(ChurchT, (b) =>
    ChurchN((N) => (z) => (s) => {
      let b1 = b(N)(z)(s);
      return a(N)(b1)(s);
    })
  )
);

let six = plus(three)(three);
console.log("3+3=6:");
printt("peano(six)", peano(six));
/**
term: ["s",["s",["s",["s",["s",["s","z"]]]]]]
type: "N"
 */
