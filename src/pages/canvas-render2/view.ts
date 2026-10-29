import { colorToCSS } from 'mve-dom-helper/canvasRender';
import { loadCanvasKit, registerFont } from 'mve-dom-helper/canvasRender';
import { flex, renderCanvas, setUrlOpener } from 'mve-dom-helper/canvasRender2';
import { todoList } from './todo-list';
import { editorPanel } from './todo-editor';
import { actionBar, filterBar, todoHeader, toolBar } from './todo-toolbar';
import { modifierHud, nestedScrollDemo, nowrapDemo } from './todo-demos';
import { applyTheme, palette } from './todo-store';

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
 * 待办清单案例：函数式声明式节点树 + 信号驱动的动态列表 + 滚动。
 *
 * 模块划分：
 * - todo-store.ts  数据层（信号 + 增删改 + 过滤 + 撤销重做快照 + 主题）
 * - todo-item.ts   单条待办组件（复选框 / 文本 / 链接 / 删除）
 * - todo-list.ts   滚动列表（scrollContent + forEachNode + overlayScrollBar）
 * - todo-toolbar.ts 头部 / 过滤栏 / 操作栏 / 工具行（撤销·重做·主题）
 * - todo-editor.ts  编辑器面板（EditableTextNode + 焦点 + IME + 剪贴板）
 *
 * 新功能演示：UrlOpener 链接点击、TextDefaults 主题回写、
 * Path2 复选框命中、TabRender 制表位展开、快照撤销/重做、
 * EditableTextNode（光标 / 选区 / 撤销 / 掩码 / 多行）、
 * 焦点子系统（点击聚焦 / Tab 遍历）与 IME 组合输入。
 */
export default async function (
  canvas: HTMLCanvasElement,
  onSelectionChange?: (text: string) => void
) {
  // 与其它 demo 一致：先等 CanvasKit 与字体就绪再渲染，避免空段落闪一下
  await loadCanvasKit('/canvas-kit/canvaskit.js');
  await loadDemoFont();

  // 平台宿主注册链接打开实现（Web：新标签页打开）
  setUrlOpener(url => window.open(url, '_blank'));
  // 初始主题：回写 TextDefaults（之后由工具行按钮切换）
  applyTheme();

  const { selectionManager } = renderCanvas({
    canvas,
    // 页面背景：根节点 draw 钩子（先于子节点绘制，随主题信号重绘）
    draw(ctx2) {
      ctx2.fillStyle = colorToCSS(palette().page);
      ctx2.fillRect(0, 0, canvas.width, canvas.height);
    },
    // 竖向排列，水平居中（子节点均显式定宽）
    layout: flex({
      gap: 12,
      alignItem: 'center',
      alignFix: true,
      directionJustify: 'center',
    }),
    children: [
      todoHeader(),
      filterBar(),
      todoList(),
      actionBar(),
      toolBar(),
      modifierHud(),
      nowrapDemo(),
      nestedScrollDemo(),
      editorPanel(),
    ],
  });

  // 跨组件选择：松手时把 SelectionManager 拼接出的选区文本抛给上层
  if (onSelectionChange) {
    canvas.addEventListener('mouseup', () => {
      onSelectionChange(selectionManager.selectedText() ?? '');
    });
  }
}
