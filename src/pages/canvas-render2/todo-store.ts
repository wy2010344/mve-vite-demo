import { createSignal } from 'wy-helper';
import { rgba } from 'mve-dom-helper/canvasRender';
import type { ColorInt } from 'mve-dom-helper/canvasRender';
import { textDefaults } from 'mve-dom-helper/canvasRender2';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  /** 可选链接：条目内渲染链接片段，点击经 UrlOpener 打开（演示 RichTextSpan.url） */
  link?: string;
}

export type TodoFilter = 'all' | 'active' | 'done';

let nextId = 1;

/** 全部待办（信号驱动：变化时布局/绘制自动更新） */
export const todos = createSignal<Todo[]>([]);

/** 当前过滤条件 */
export const filter = createSignal<TodoFilter>('all');

/** 过滤后的可见待办（todo-list 直接消费） */
export function visibleTodos(): Todo[] {
  const f = filter.get();
  const list = todos.get();
  if (f == 'active') {
    return list.filter(t => !t.done);
  }
  if (f == 'done') {
    return list.filter(t => t.done);
  }
  return list;
}

// ---------- 变更入口：快照式撤销/重做（演示级） ----------
// 引擎层的 UndoRedo 是动作式（TextEditAction，服务编辑器键盘编辑）；
// 列表数据结构不匹配文本动作，这里用同语义的快照栈演示撤销/重做交互。

const past = createSignal<Todo[][]>([]);
const future = createSignal<Todo[][]>([]);

/** 统一变更入口：变更前快照入撤销栈、清空重做栈 */
function commit(mutate: (list: Todo[]) => Todo[]) {
  past.set([...past.get(), todos.get()]);
  future.set([]);
  todos.set(mutate(todos.get()));
}

export function addTodo(text: string, link?: string): void {
  commit(list => [...list, { id: nextId++, text, done: false, link }]);
}

export function toggleTodo(id: number): void {
  commit(list => list.map(t => (t.id == id ? { ...t, done: !t.done } : t)));
}

export function removeTodo(id: number): void {
  commit(list => list.filter(t => t.id != id));
}

export function clearDone(): void {
  commit(list => list.filter(t => !t.done));
}

export function undoTodo(): void {
  const stack = past.get();
  if (stack.length == 0) return;
  const prev = stack[stack.length - 1];
  past.set(stack.slice(0, -1));
  future.set([todos.get(), ...future.get()]);
  todos.set(prev);
}

export function redoTodo(): void {
  const stack = future.get();
  if (stack.length == 0) return;
  const next = stack[0];
  future.set(stack.slice(1));
  past.set([...past.get(), todos.get()]);
  todos.set(next);
}

export const canUndo = () => past.get().length > 0;
export const canRedo = () => future.get().length > 0;

/** 统计：总数与完成数 */
export function stats(): { total: number; done: number } {
  const list = todos.get();
  return { total: list.length, done: list.filter(t => t.done).length };
}

const SAMPLES = [
  '写本周周报',
  '买牛奶和鸡蛋',
  '健身 30 分钟',
  '回复评审邮件',
  ' review 渲染管线 PR',
  '读 10 页书',
  '整理桌面文件',
  '预约牙医',
  '给妈妈打电话',
  '修复滚动条拖拽',
];

/** 追加一条随机示例待办 */
export function addSampleTodo(): void {
  addTodo(SAMPLES[Math.floor(Math.random() * SAMPLES.length)]);
}

// 初始种子数据：12 条（超出列表视口，便于演示滚动）；
// 混入链接待办 / Tab 文本 / 迁移笔记，演示 RichTextSpan.url 与 TabRender
todos.set(
  Array.from({ length: 12 }, (_, i) => ({
    id: nextId++,
    text:
      i == 4
        ? 'Tab 文本:\t制表位展开为 4 空格'
        : i == 7
          ? '查看 WorkBuddy 文档'
          : SAMPLES[i % SAMPLES.length],
    done: i % 4 == 0,
    link:
      i == 7 ? 'https://www.workbuddy.cn/docs/workbuddy/Overview' : undefined,
  }))
);

// ---------- 主题（演示 TextDefaults 的 setter 回写） ----------

export type Theme = 'light' | 'dark';
export const theme = createSignal<Theme>('light');

/** 主题配色（ColorInt；demo 组件统一从这取色，切主题时随信号重绘） */
export interface Palette {
  page: ColorInt;
  card: ColorInt;
  cardDone: ColorInt;
  border: ColorInt;
  track: ColorInt;
  thumb: ColorInt;
  checkboxBorder: ColorInt;
  link: ColorInt;
  btnBg: ColorInt;
  btnText: ColorInt;
  btnActiveBg: ColorInt;
  btnActiveText: ColorInt;
  btnDisabledBg: ColorInt;
  btnDisabledText: ColorInt;
  /** 输入框底色 */
  inputBg: ColorInt;
  /** 输入框边框（聚焦时改用 accent） */
  inputBorder: ColorInt;
  /** 编辑器选区高亮 */
  selection: ColorInt;
  /** 聚焦强调色（光标 / 聚焦边框） */
  accent: ColorInt;
}

const LIGHT: Palette = {
  page: 0xfff8fafc,
  card: 0xffffffff,
  cardDone: 0xfff1f5f9,
  border: 0xffe2e8f0,
  track: 0xfff1f5f9,
  thumb: 0xffcbd5e1,
  checkboxBorder: 0xff94a3b8,
  link: 0xff2563eb,
  btnBg: 0xfff1f5f9,
  btnText: 0xff475569,
  btnActiveBg: 0xffdbeafe,
  btnActiveText: 0xff1d4ed8,
  btnDisabledBg: 0xfff8fafc,
  btnDisabledText: 0xffcbd5e1,
  inputBg: 0xfff8fafc,
  inputBorder: 0xffcbd5e1,
  selection: rgba(59, 130, 246, 90),
  accent: 0xff2563eb,
};

const DARK: Palette = {
  page: 0xff0f172a,
  card: 0xff1e293b,
  cardDone: 0xff172033,
  border: 0xff334155,
  track: 0xff0f172a,
  thumb: 0xff475569,
  checkboxBorder: 0xff64748b,
  link: 0xff60a5fa,
  btnBg: 0xff334155,
  btnText: 0xffcbd5e1,
  btnActiveBg: 0xff1e3a8a,
  btnActiveText: 0xff93c5fd,
  btnDisabledBg: 0xff1e293b,
  btnDisabledText: 0xff475569,
  inputBg: 0xff0f172a,
  inputBorder: 0xff475569,
  selection: rgba(96, 165, 250, 90),
  accent: 0xff60a5fa,
};

export function palette(): Palette {
  return theme.get() == 'dark' ? DARK : LIGHT;
}

/**
 * 应用主题：经 TextDefaults setter 回写核心中性默认色
 * （对标 Kotlin：组件包切主题时同步引擎默认色，昼/夜自动换肤）。
 * 默认文本色随信号失效，读取方（wrappedTextNode 默认 color）重绘更新。
 */
export function applyTheme(): void {
  const dark = theme.get() == 'dark';
  textDefaults.text = dark ? rgba(226, 232, 240) : rgba(30, 41, 59);
  textDefaults.placeholder = dark ? rgba(100, 116, 139) : rgba(148, 163, 184);
}

export function toggleTheme(): void {
  theme.set(theme.get() == 'dark' ? 'light' : 'dark');
  applyTheme();
}
