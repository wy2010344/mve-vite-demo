import { superCall } from 'wy-helper';
import {
  colorToCSS,
  CursorType,
  flex,
  getActiveEditor,
  KeyCode,
  loadCanvasKit,
  registerFont,
  renderCanvas,
  Renderer,
} from 'mve-dom-helper/canvasRender';
import {
  renderTodoHeader,
  renderFilterBar,
  renderActionBar,
  renderToolBar,
} from './todo-toolbar';
import { renderTodoList } from './todo-list';
import {
  isDraftEditorEditing,
  renderEditorPanel,
  submitDraft,
} from './todo-editor';
import { palette } from './todo-store';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

/**
 * 加载演示字体。CanvasKit（wasm 版）没有系统默认字体，
 * 不注册字体的话段落量出来的宽高都是 0（getLongestLine/getHeight），画不出任何文本。
 */
async function loadDemoFont(): Promise<void> {
  for (const url of FONT_URLS) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const bytes = await resp.arrayBuffer();
      registerFont('Noto Sans SC', bytes);
      return;
    } catch {
      // 尝试下一个源
    }
  }
}

/**
 * 待办清单案例（canvasRender · 类式节点树）：与 `canvas-render2` 案例对齐同一套
 * 数据层与视觉，用来对照两种树形态写同一个界面。
 *
 * 模块划分：
 * - todo-store.ts   数据层（信号 + 增删改 + 过滤 + 撤销重做快照 + 主题）
 * - todo-item.ts    单条待办组件（复选框 / 文本 / 链接 / 删除）
 * - todo-list.ts    滚动列表（Scroll + renderScrollContent + renderArray + SimpleScrollBar）
 * - todo-toolbar.ts 头部 / 过滤栏 / 操作栏 / 工具行
 * - todo-editor.ts  编辑器面板（EditableTextNode + 焦点 + IME + 剪贴板）
 *
 * 两版差异（旧版受限项）：无 TextDefaults（默认色走 palette）、无 UrlOpener
 * （链接用独立按钮窗口打开）、无 placeholder/obscure/singleLine/onSubmit
 * （占位符自绘、回车提交在输入层拦截）、无 Path2（命中即矩形）。
 */
export default async function (canvas: HTMLCanvasElement) {
  // 与 canvas-render2 / canvas-v2-demo 一致：先等 CanvasKit 与字体就绪再渲染，
  // 否则首帧的段落尺寸全为 0（wasm 版没有系统默认字体）。
  await loadCanvasKit('/canvas-kit/canvaskit.js');
  await loadDemoFont();

  const render = renderCanvas(canvas, {
    // 页面背景：覆盖根节点 draw（先去画背景，再交给父类画子节点）
    draw(ctx) {
      ctx.fillStyle = colorToCSS(palette().page);
      ctx.fillRect(0, 0, this.outerWidth(), this.outerHeight());
      superCall(this, 'draw', ctx);
    },
    // 竖向排列，水平居中（子节点均显式定宽）
    layout: flex({ gap: 12, alignFix: true, directionJustify: 'center' }),
    children() {
      renderTodoHeader();
      renderFilterBar();
      renderTodoList();
      renderActionBar();
      renderToolBar();
      renderEditorPanel();
    },
  });

  setupInput(render, canvas);
}

/**
 * 平台输入层：canvas 自身收不到键盘与输入法，借一个离屏 textarea 承接。
 * 与 canvas-v2-demo 的 setupInput 同构，另外补了「草稿框回车提交」的拦截
 * （旧版 EditableTextNode 没有 onSubmit 钩子）。
 */
function setupInput(render: Renderer, canvas: HTMLCanvasElement) {
  const textarea = document.createElement('textarea');
  textarea.style.cssText = [
    'position:fixed',
    'z-index:9999',
    'opacity:0',
    'pointer-events:none',
    'resize:none',
    'border:none',
    'outline:none',
    'background:transparent',
    'overflow:hidden',
    'white-space:pre',
    'font-family:sans-serif',
  ].join(';');
  document.body.appendChild(textarea);

  render.setInputOverlayHandler(
    (x, y, w, h, fontSize) => {
      // 光标处定位：输入法候选框才会跟随光标
      const rect = canvas.getBoundingClientRect();
      textarea.style.display = 'block';
      textarea.style.left = `${rect.left + x}px`;
      textarea.style.top = `${rect.top + y}px`;
      textarea.style.width = `${Math.max(1, w)}px`;
      textarea.style.height = `${Math.max(1, h)}px`;
      textarea.style.fontSize = `${fontSize}px`;
      textarea.focus();
    },
    () => {
      textarea.style.display = 'none';
    }
  );

  render.setCursorHandler(type => {
    canvas.style.cursor = type as CursorType;
  });

  let composing = false;
  textarea.addEventListener('compositionstart', () => {
    composing = true;
    textarea.value = '';
  });
  textarea.addEventListener('compositionupdate', () => {
    render.composingText(textarea.value, textarea.selectionStart);
  });
  textarea.addEventListener('compositionend', () => {
    composing = false;
    const ed = getActiveEditor();
    if (ed) {
      ed.commitComposingText(textarea.value);
    }
    textarea.value = '';
  });
  textarea.addEventListener('input', () => {
    if (!composing) {
      textarea.value = '';
    }
  });

  document.addEventListener('keydown', e => {
    // 组合期间键盘归输入法独占（此时 key 多为 'Process'），不再路由给节点
    if (composing) return;
    // 草稿框回车 = 加入列表（不让它插入换行；Shift+Enter 保留换行）
    if (e.code == 'Enter' && !e.shiftKey && isDraftEditorEditing()) {
      e.preventDefault();
      submitDraft();
      return;
    }
    render.keyPress(
      e.key,
      keyCodeOf(e),
      e.ctrlKey,
      e.shiftKey,
      e.altKey,
      e.metaKey
    );
    if (e.code == 'Tab') {
      e.preventDefault();
    }
  });
}

function keyCodeOf(e: KeyboardEvent): KeyCode {
  switch (e.code) {
    case 'Backspace':
      return KeyCode.Backspace;
    case 'Delete':
      return KeyCode.Delete;
    case 'ArrowLeft':
      return KeyCode.Left;
    case 'ArrowRight':
      return KeyCode.Right;
    case 'ArrowUp':
      return KeyCode.Up;
    case 'ArrowDown':
      return KeyCode.Down;
    case 'PageUp':
      return KeyCode.PageUp;
    case 'PageDown':
      return KeyCode.PageDown;
    case 'Home':
      return KeyCode.Home;
    case 'End':
      return KeyCode.End;
    case 'Enter':
      return KeyCode.Enter;
    case 'Tab':
      return KeyCode.Tab;
    case 'Escape':
      return KeyCode.Escape;
    default:
      return KeyCode.Unknown;
  }
}
