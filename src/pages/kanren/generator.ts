import { baseUnify, KSubsitution, KType, KVar, pair, list, toArray, walk } from "wy-helper/kanren";




type Goal = (state: KSubsitution) => Generator<KSubsitution>



export function* toAnd(state: KSubsitution, g1: Goal, g2: Goal) {
  for (const s1 of g1(state)) {
    yield* g2(s1)
  }
}

function and(g1: Goal, g2: Goal) {
  return function (state: KSubsitution) {
    return toAnd(state, g1, g2)
  }
}

export function* toOr(state: KSubsitution, g1: Goal, g2: Goal) {
  yield* g1(state)
  yield* g2(state)
}

function or(g1: Goal, g2: Goal) {
  return function (state: KSubsitution) {
    return toOr(state, g1, g2)
  }
}

export function* toUnify(sub: KSubsitution, a: KType, b: KType) {
  const [suc, sub1] = baseUnify(a, b, sub)
  if (suc) {
    yield sub1
  }
}
function unify(a: KType, b: KType) {
  return function (state: KSubsitution) {
    return toUnify(state, a, b)
  }
}




function append(a: KType, b: KType, c: KType) {
  const h = KVar.create()
  const t = KVar.create()
  const res = KVar.create()
  return function (state: KSubsitution): Generator<KSubsitution> {
    return or(
      and(
        unify(a, null),
        unify(b, c)
      ),
      and(
        unify(a, pair(h, t)),
        and(
          unify(c, pair(h, res)),
          s => append(t, b, res)(s)
        )
      )
    )(state)
  }
}

// 运行查询：获取前n个结果
function* run(n: number, goal: Goal) {
  const initial: KSubsitution = null
  const results = goal(initial);
  let count = 0;
  for (const state of results) {
    if (count++ >= n) return;
    yield state;
  }
}

export function runG() {


  const a = KVar.create()
  const b = KVar.create()

  console.log("run...")

  for (const result of append(a, b, list(1, 2, 3, 4, 5, 6))(null)) {
    console.log('result', toArray(walk(a, result)), toArray(walk(b, result)))
  }
}