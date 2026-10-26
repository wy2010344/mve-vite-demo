import { superCall } from 'wy-helper';
import {
  colorToCSS,
  flex,
  LayoutNode,
  registerScroll,
  renderRect,
  renderScrollBar,
  renderScrollContent,
  renderWrappedText,
  roundRectPath,
  Scroll,
  SimpleScrollBar,
} from 'mve-dom-helper/canvasRender';
import { renderArray, renderIf, renderOneKey } from 'mve-helper';
import { renderTodoItem } from './todo-item';
import { palette, visibleTodos } from './todo-store';

/**
 * 待办列表：滚动容器 + 动态条目 + 滚动条（对齐 canvasRender2 的 todo-list）。
 *
 * 关键点：
 * - 动态列表由 `renderArray` 按条目对象引用复用：`toggleTodo` 只替换被改的那一条，
 *   其余对象引用不变，节点不会被重建；
 * - 滚动 = `new Scroll(容器)` + `registerScroll`（滚轮）+ `renderScrollContent`
 *   （内容在父坐标系按容器 inner 区裁剪）+ `SimpleScrollBar` 子类（滑块与拖拽）；
 * - 空态提示用 `hide` 控制：无可见待办时隐藏（被父布局过滤，不占位）。
 */
export function renderTodoList() {
  renderRect({
    width: 380,
    height: 340,
    padding: 8,
    layout: flex({
      direction: 'x',
      gap: 4,
      alignFix: true,
      alignItem: 'stretch',
    }),
    draw(ctx) {
      const p = palette();
      const w = this.outerWidth();
      const h = this.outerHeight();
      ctx.fillStyle = colorToCSS(p.card);
      roundRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 10);
      ctx.fill();
      ctx.strokeStyle = colorToCSS(p.border);
      ctx.lineWidth = 1;
      ctx.stroke();
      superCall(this, 'draw', ctx);
    },
    children() {
      const it = this;
      // 空态提示：用 renderOneKey 做条件渲染（数据变化时真正增删节点）。
      // 注意不能用 NodeArg.hide——它在构建期就被 flatten 过滤掉，之后不会回来。
      renderIf(
        () => visibleTodos().length,
        function () {
          const container = it.node as LayoutNode;
          const scroll = new Scroll(container, 'y');
          registerScroll(scroll);
          renderScrollBar({
            scroll,
            direction: 'y',
          });
          renderScrollContent({
            // 宽度显式给定（旧版 flex 里 grow 且未定尺寸的节点会让主方向分配陷入
            // 循环调用 memo）：380 - padding 16 - 滚动条 10 - gap 4
            width: 350,
            y: () => -scroll.value(),
            // alignFix 锁定 cross 为自身 inner；stretch 让条目横向撑满内容区
            layout: flex({ alignFix: true, alignItem: 'stretch', gap: 6 }),
            children() {
              renderArray(visibleTodos, todo => {
                renderTodoItem(todo);
              });
            },
          });
        },
        function () {
          renderWrappedText({
            width: 350,
            height: 24,
            text: () => '暂无待办，点击下方按钮添加',
            fontFamily: () => 'Noto Sans SC',
            fontSize: () => 13,
            color: () => palette().placeholder,
          });
        }
      );
    },
  });
}
