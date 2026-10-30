import type { GetValue } from 'wy-helper';
import { colorToCSS } from 'mve-dom-helper/canvasRender';
import type { RichTextSpan } from 'mve-dom-helper/canvasRender';
import {
  appendRoundedRect,
  createPath2,
  fc,
  flex,
  grow,
  node2,
  rectNode,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import { palette, removeTodo, toggleTodo, type Todo } from './todo-store';

export interface TodoItemArg {
  /** 当前待办（getter：信号变化后重取，保证渲染最新数据） */
  todo: GetValue<Todo>;
}

/**
 * 单条待办：复选框（点击切换完成）+ 文本（完成时灰色删除线）+ 删除按钮。
 * 布局：横向 flex；条目显式高度，子节点 cross 轴 stretch，
 * 文本 grow 撑满剩余宽度（自动换行由 richTextNode 负责）。
 *
 * 新功能演示：
 * - 复选框命中走 Path2（圆角方框录制 → applyTo 回放绘制 + contains 纯 JS 判定）；
 * - 带 link 的待办渲染链接片段（RichTextSpan.url），点击经 UrlOpener 打开；
 * - 条目配色随主题（palette + TextDefaults）切换。
 */
export const todoItem = fc(function (ctx, arg: TodoItemArg) {
  const todo = arg.todo;
  // 复选框路径：圆角方框录制一次，绘制回放与命中判定共用
  const box = createPath2();
  appendRoundedRect(box, 0.75, 0.75, 16.5, 16.5, 4);
  rectNode({
    height: () => 40,
    // 竖向 padding 让 stretch 后的文本行高与条目高度匹配，视觉居中
    paddingInline: () => 10,
    paddingBlock: () => 11,
    background: () => {
      const p = palette();
      return todo().done ? p.cardDone : p.card;
    },
    borderColor: () => palette().border,
    borderWidth: () => 1,
    radius: () => 6,
    layout: flex({ direction: 'x', gap: 8 }),
    children: [
      // 复选框：Path2 圆角方框——绘制回放与命中判定共用同一份路径
      // （contains 为偶数规则纯 JS 判定，命中区域跟随圆角而非外接矩形）
      node2({
        size: () => 18,
        acceptHit(x, y) {
          return box.contains(x, y);
        },
        draw(ctx2: CanvasRenderingContext2D) {
          const done = todo().done;
          box.applyTo(ctx2);
          if (done) {
            ctx2.fillStyle = colorToCSS(0xff22c55e);
            ctx2.fill();
          }
          ctx2.strokeStyle = colorToCSS(
            done ? 0xff22c55e : palette().checkboxBorder
          );
          ctx2.lineWidth = 1.5;
          ctx2.stroke();
          if (done) {
            // 对勾：直接走 2D context（细线段无命中需求）
            ctx2.strokeStyle = colorToCSS(0xffffffff);
            ctx2.lineWidth = 2;
            ctx2.lineCap = 'round';
            ctx2.beginPath();
            ctx2.moveTo(4.5, 9.5);
            ctx2.lineTo(7.5, 12.5);
            ctx2.lineTo(13.5, 6);
            ctx2.stroke();
          }
        },
        mouseClick() {
          toggleTodo(todo().id);
        },
      }),
      // 文本：完成时灰色删除线；带 link 时追加链接片段
      // （点击链接由 richTextNode 命中后经 UrlOpener 打开，不触发本节点回调）
      wrappedTextNode({
        exts: [grow({ argGrow: 1 })],
        spans: (): RichTextSpan[] => {
          const t = todo();
          const main: RichTextSpan = {
            text: t.text,
            style: {
              fontFamily: 'Noto Sans SC',
              fontSize: 13,
              color: t.done ? textDefaults.placeholder() : textDefaults.text(),
              decoration: t.done ? { lineThrough: true } : {},
            },
          };
          if (!t.link) return [main];
          return [
            main,
            {
              text: ' 打开链接',
              url: t.link,
              style: {
                fontFamily: 'Noto Sans SC',
                fontSize: 13,
                color: palette().link,
                decoration: { underline: true },
              },
            },
          ];
        },
      }),
      // 删除按钮：点击移除该条
      node2({
        size: () => 18,
        draw(ctx2: CanvasRenderingContext2D) {
          ctx2.strokeStyle = colorToCSS(palette().checkboxBorder);
          ctx2.lineWidth = 1.5;
          ctx2.lineCap = 'round';
          ctx2.beginPath();
          ctx2.moveTo(5, 5);
          ctx2.lineTo(13, 13);
          ctx2.moveTo(13, 5);
          ctx2.lineTo(5, 13);
          ctx2.stroke();
        },
        mouseClick() {
          removeTodo(todo().id);
        },
      }),
    ],
  })(ctx);
});
