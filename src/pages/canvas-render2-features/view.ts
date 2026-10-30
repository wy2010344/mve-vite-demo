import { colorToCSS } from 'mve-dom-helper/canvasRender';
import { loadCanvasKit, registerFont } from 'mve-dom-helper/canvasRender';
import { Fc, flex, rectNode, renderCanvas } from 'mve-dom-helper/canvasRender2';
import { applyTheme, palette } from '../canvas-render2/todo-store';
import { contextMenuDemo, popoverDemo, toastDemo } from './overlay-demos';
import { richEditorDemo } from './rich-editor-demo';
import {
  imageLoaderDemo,
  layoutAuditDemo,
  pointerDemo,
  setAuditRoot,
} from './media-audit-demos';
import { CARD_W } from './ui';

const FONT_URLS = ['/fonts/noto-sans-sc-chinese-simplified-400-normal.woff2'];

/**
 * 加载演示字体。CanvasKit（wasm 版）没有系统默认字体，
 * 不注册字体的话段落量出来的宽高都是 0，画不出任何文本。
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

/** 一列（卡片纵向堆叠，宽度写死避免与 alignFix 的父布局互推尺寸） */
function column(children: readonly Fc[]): Fc {
  return rectNode({
    // 名字只用于诊断（成环 / 尺寸错误会点名节点），不影响布局
    debugName: () => 'column',
    width: () => CARD_W,
    layout: flex({
      direction: 'y',
      gap: 12,
      alignFix: true,
      alignItem: 'stretch',
    }),
    children,
  });
}

/**
 * canvasRender2 新特性示例页。
 *
 * 这页只放**待办清单没有覆盖**的能力，按"引擎层 → 外围层"排列：
 *
 * | 能力 | 引擎位置 | 关键点 |
 * |---|---|---|
 * | Pop / Toast / Placement | `Pop.ts` + `helper/*` | 登记处 + 列表信号，渲染器统一展开 |
 * | postDelayed | `canvasCore/Timer` | 与重绘无关的时间驱动 |
 * | ImageLoader | `canvasCore/ImageLoader` | 宿主注入 fetcher，同 URL 去重缓存 |
 * | RichEditableTextNode | `editable/richSegments` | 纯函数样式段表 + `setStyleRange` |
 * | LayoutAudit | `tree/layoutAudit` | 已建树上探针测量 + 边配对判环 |
 * | 指针语义 | `tree/pointer` | 双击不吞单击、光标由节点消息派生 |
 */
export default async function (canvas: HTMLCanvasElement) {
  // 与其它 demo 一致：先等 CanvasKit 与字体就绪再渲染，避免空段落闪一下
  await loadCanvasKit('/canvas-kit/canvaskit.js');
  await loadDemoFont();
  applyTheme();

  const { node } = renderCanvas({
    canvas,
    // 页面背景：根节点 draw 钩子（先于子节点绘制，随主题信号重绘）
    draw(ctx2) {
      ctx2.fillStyle = colorToCSS(palette().page);
      ctx2.fillRect(0, 0, canvas.width, canvas.height);
    },
    layout: flex({
      direction: 'x',
      gap: 16,
      alignItem: 'start',
      alignFix: true,
      directionJustify: 'center',
    }),
    children: [
      column([toastDemo(), popoverDemo(), contextMenuDemo(), pointerDemo()]),
      column([richEditorDemo(), imageLoaderDemo(), layoutAuditDemo()]),
    ],
  });

  // 布局审计要从根节点开始遍历（审计只读，随时可跑）
  setAuditRoot(node);
}
