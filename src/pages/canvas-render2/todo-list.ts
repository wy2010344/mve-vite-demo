import { colorToCSS } from 'mve-dom-helper/canvasRender';
import {
  createScroll,
  Fc,
  flex,
  forEachNode,
  grow,
  ifNode,
  Node2,
  node2,
  nodeOf,
  rectNode,
  registerScroll,
  scrollBar,
  scrollContent,
  tfc,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { todoItem } from './todo-item';
import { palette, visibleTodos, type Todo } from './todo-store';
import { StateHolder } from 'mve-core';

/**
 * 待办列表模块：滚动容器 + 动态条目 + 滚动条。
 *
 * 关键点：
 * - 条目由 forEachNode 管理（按 todo.id 增量复用/销毁），
 *   增删待办不会重建整个列表；
 * - 滚轮/拖滑块滚动由 Scroll 模块负责（内容裁剪见 scrollContent）；
 * - 空态提示在无可见待办时占位显示（高度 0 隐藏，不占布局）。
 */
export const todoList = tfc(function (ctx, container) {
  // nodeOf 第一段捕获容器 node（供 createScroll 绑定），
  // 第二段在真实 ctx 上应用；children 里的 ctx 元素命令式创建滚动子节点
  const scroll = createScroll(container, 'y');
  registerScroll(ctx, scroll); // 滚轮滚动（指针在容器 inner 区内时消费）
  rectNode.create({
    width: () => 380,
    height: () => 340,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    radius: () => 10,
    padding: () => 8,
    layout: flex({
      direction: 'x',
      gap: 4,
      alignItem: 'stretch',
      alignFix: true,
    }),
    children: [
      ifNode(
        () => visibleTodos().length,
        function () {
          return listOf(
            scrollBar.of({
              scroll,
              trackColor: () => palette().track,
              thumbColor: () => palette().thumb,
            }),
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
                    // of() 自建节点身份并直接应用到当前 holder
                    return todoItem.of({ todo: () => eachTime.getValue() })(
                      this
                    );
                  }
                ),
              ],
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
      ),
    ],
  })(container)(ctx);
});

function listOf(...args: Fc[]) {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    args.forEach(arg => arg(ctx));
  };
}
