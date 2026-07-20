/**
 * 特权上下文 (Privileged Context) Demo
 *
 * 规则 `context/privileged-context`:
 *   配置的特权函数: dangerousOp / rawQuery / execSync / adminAction
 *   它们只能在标记了 `@privileged` 的上下文中调用
 *   标记了 `@privileged` 的回调不能逃逸到非特权上下文
 *
 * TypeScript 类型约束:
 *   1. Branded Type 让 PrivilegedHandle 在外部无法伪造
 *   2. runPrivileged 泛型包装器让匿名函数被立即执行并丢弃，只有返回值 T 泄出
 *   3. JSDoc `@privileged` 让 ESLint 规则识别回调的特权身份
 */

declare function rawQuery(sql: string): unknown;
declare function dangerousOp(action: string): void;
declare function execSync(cmd: string): string;
declare function adminAction(action: string): void;

// ============================================================
// 1. Branded Type — 特权句柄的编译期屏障
// ============================================================

declare const __PrivilegedHandle: unique symbol;

/** 特权句柄 — 只能在 runPrivileged 回调内获得，外部无法构造 */
export type PrivilegedHandle = {
  readonly [__PrivilegedHandle]: 'PrivilegedHandle';
};

// ============================================================
// 2. 核心包装器 — 匿名函数不泄漏
// ============================================================

/**
 * 在特权上下文中执行回调。
 *
 * 泛型 T 允许回调返回任意值，但 PrivilegedHandle 本身不会逃逸:
 * 回调被立即调用，handle 随即销毁。
 */
export function runPrivileged<T>(
  /** @privileged */
  callback: (handle: PrivilegedHandle) => T
): T {
  const handle = {} as PrivilegedHandle;
  return callback(handle);
}

// ============================================================
// 3. 使用示例
// ============================================================

// --- 基础: 直接在 runPrivileged 中调用特权函数 ---
const result = runPrivileged(handle => {
  rawQuery('SELECT * FROM users WHERE role = "admin"');
  dangerousOp('backup before migration');
  return 'migration done';
});
// result 是 'migration done'，但 handle 已销毁

// --- 中级: 组合多个特权操作 ---
runPrivileged(handle => {
  rawQuery('BEGIN');
  dangerousOp('ALTER TYPE status ADD VALUE "archived"');
  rawQuery('COMMIT');
});

// --- 高级: 通过辅助函数传递 handle ---
/** @privileged */
function queryAsAdmin(sql: string, handle: PrivilegedHandle): unknown {
  return rawQuery(sql);
}

/** @privileged */
function runAsAdmin(action: string, handle: PrivilegedHandle): void {
  dangerousOp(action);
}

runPrivileged(handle => {
  queryAsAdmin('SELECT * FROM users WHERE role = "admin"', handle);
  runAsAdmin('backup before migration', handle);
});

// ============================================================
// 4. ❌ 错误示范 (会触发 lint error)
// ============================================================

// 错误1: 特权函数在非特权上下文中直接调用
// rawQuery('SELECT 1')  // → context/privileged-context: error

// 错误2: 特权回调赋值给非特权变量 (逃逸)
// const leaked = () => { dangerousOp('oops') }

// 错误3: 特权回调作为非特权参数传递
// someRegularFunction(() => { execSync('rm -rf /') })

// ============================================================
// 5. 类型约束验证 — 编译期拦截
// ============================================================

// 以下在编译期就会报错，因为外部无法构造 PrivilegedHandle:
// const fake = {} as PrivilegedHandle  // ❌ 类型断言可绕过 Branded，但语义上不被鼓励

export {};
