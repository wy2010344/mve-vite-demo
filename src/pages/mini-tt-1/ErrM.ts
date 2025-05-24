// 表示一个可能失败的运算
export type Err<T> =
  | { tag: 'Ok'; value: T }
  | { tag: 'Bad'; message: string };

// 工具函数
export const Ok = <T>(value: T): Err<T> => ({ tag: 'Ok', value });
export const Bad = <T = never>(message: string): Err<T> => ({ tag: 'Bad', message });

// map: 对 Ok 包装的值做映射
export function fmap<A, B>(f: (a: A) => B, err: Err<A>): Err<B> {
  if (err.tag === 'Ok') return Ok(f(err.value));
  return err;
}

// bind (>>=)：链式调用
export function bind<A, B>(err: Err<A>, f: (a: A) => Err<B>): Err<B> {
  if (err.tag === 'Ok') return f(err.value);
  return err;
}

// apply：Applicative 风格函数应用
export function ap<A, B>(fab: Err<(a: A) => B>, fa: Err<A>): Err<B> {
  if (fab.tag === 'Bad') return fab;
  return fmap(fab.value, fa);
}

// mplus：优先使用第一个成功的
export function mplus<A>(x: Err<A>, y: Err<A>): Err<A> {
  return x.tag === 'Bad' ? y : x;
}

// mzero：表示失败
export const mzero: Err<any> = Bad('Err.mzero');
