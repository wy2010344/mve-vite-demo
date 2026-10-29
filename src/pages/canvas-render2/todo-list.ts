import { colorToCSS } from 'mve-dom-helper/canvasRender';
import {
  createScroll,
  Fc,
  fc,
  flex,
  forEachNode,
  grow,
  ifNode,
  Node2,
  node2,
  overlayScrollBar,
  overlayScrollBarStyle,
  rectNode,
  scrollContent,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import type { ScrollBarStyle2 } from 'mve-dom-helper/canvasRender2';
import { todoItem } from './todo-item';
import { palette, visibleTodos, type Todo } from './todo-store';
import { StateHolder } from 'mve-core';

/**
 * 待办列表模块：滚动容器 + 动态条目 + 滚动条。
 *
 * 关键点：
 * - 条目由 forEachNode 管理（按 todo.id 增量复用/销毁），
 *   增删待办不会重建整个列表；
 * - 滚动条用 macOS 风格浮层式（overlayScrollBar）：不占布局宽度、滚动时浮现、
 *   停手自动淡出；滚轮/拖滑块滚动由 Scroll 模块负责（内容裁剪见 scrollContent）；
 * - 空态提示在无可见待办时占位显示（高度 0 隐藏，不占布局）。
 */
/** 浮层滚动条观感：沿用调色板的滑块色，其余取 macOS 默认数值 */
function scrollBarStyle(): ScrollBarStyle2 {
  return {
    ...overlayScrollBarStyle,
    thumb: palette().thumb,
  };
}

export const todoList = fc(function (ctx) {
  rectNode.of({
    width: () => 380,
    height: () => 340,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    radius: () => 10,
    padding: () => 8,
    // 无 gap：浮层滚动条不占布局宽度，内容直接拿满容器 inner
    layout: flex({
      direction: 'x',
      alignItem: 'stretch',
      alignFix: true,
    }),
    children: [
      function (childCtx: StateHolder<Node2, readonly Node2[]>) {
        // children 是懒构建的（renderNode 在容器 set 之后才 create），
        // 所以父节点只能在子构建期经 ctx.getParent() 取——
        // 这也是 fc（无 ref）组合节点时的标准写法。
        const scroll = createScroll(childCtx.getParent() as Node2, 'y');
        // 滚轮由 scrollContent / scrollBar 自己沿命中链接管，这里不用再注册
        ifNode(
          () => visibleTodos().length,
          function () {
            return listOf(
              scrollContent.of({
                scroll,
                exts: [grow({ argGrow: 1 })], // 横向撑满容器剩余空间
                // alignFix 锁定 cross 为自身 inner；stretch 让条目横向撑满内容区
                layout: flex({ alignFix: true, alignItem: 'stretch', gap: 6 }),
                children: [
                  // 动态列表：forEachNode 按 key（todo.id）增量复用/销毁条目节点
                  forEachNode<Todo, number>(
                    cb => visibleTodos().forEach(t => cb(t.id, t)),
                    function (key, eachTime) {
                      // fc 组件直接调用得到节点，不再需要 .of()
                      return todoItem({ todo: () => eachTime.getValue() })(
                        this
                      );
                    }
                  ),
                ],
              }),
              // macOS 风格浮层滚动条：滚动/悬停时浮现，停手 850ms 后淡出
              overlayScrollBar.of({
                scroll,
                style: () => scrollBarStyle(),
              })
            )(this);
          },
          function () {
            // 空态提示：没有可见待办时显示，否则高度归零不占布局
            wrappedTextNode.of({
              autoWidth: () => true,
              text: () => '暂无待办，点击下方按钮添加',
            })(this);
          }
        )(childCtx);
      },
    ],
  })(ctx);
});

function listOf(...args: Fc[]) {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    args.forEach(arg => arg(ctx));
  };
}
