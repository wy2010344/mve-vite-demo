import { superCall } from 'wy-helper';
import {
  colorToCSS,
  flex,
  renderRect,
  renderWrappedText,
  roundRectPath,
} from 'mve-dom-helper/canvasRender';
import type { RichTextSpan } from 'mve-dom-helper/canvasRender';
import { palette, removeTodo, toggleTodo, type Todo } from './todo-store';

const FONT = 'Noto Sans SC';

/**
 * 单条待办：复选框（点击切换完成）+ 文本（完成时灰色删除线）+ 删除按钮。
 * 与 `canvas-render2` 版同构，差别只在类式 API：
 * - 卡片底色/圆角/边框由自身 `draw` 手写（旧版 RectNode 没有 background/border 参数）；
 *   先画自身再 `superCall(this, 'draw', ctx)` 画子节点，与 canvasRender2 的
 *   「背景先于子节点」顺序一致；
 * - 复选框与删除按钮都是 18×18 的 RectNode，命中判定即其矩形（旧版无 Path2）；
 * - 条目对象由 renderArray 的 key 捕获，`toggleTodo` 只替换被改的那一条，
 *   其余条目对象引用不变，因此闭包读到的始终是最新数据。
 */
export function renderTodoItem(todo: Todo) {
  renderRect({
    height: 40,
    paddingInline: 10,
    paddingBlock: 11,
    layout: flex({ direction: 'x', gap: 8, alignItem: 'stretch' }),
    draw(ctx) {
      const p = palette();
      const w = this.outerWidth();
      const h = this.outerHeight();
      ctx.fillStyle = colorToCSS(todo.done ? p.cardDone : p.card);
      roundRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 6);
      ctx.fill();
      ctx.strokeStyle = colorToCSS(p.border);
      ctx.lineWidth = 1;
      ctx.stroke();
      superCall(this, 'draw', ctx);
    },
    children() {
      // 复选框：完成时绿底 + 白色对勾
      renderRect({
        width: 18,
        height: 18,
        notInLayout: false,
        draw(ctx) {
          const done = todo.done;
          const p = palette();
          ctx.beginPath();
          roundRectPath(ctx, 0.75, 0.75, 16.5, 16.5, 4);
          if (done) {
            ctx.fillStyle = colorToCSS(0xff22c55e);
            ctx.fill();
          }
          ctx.strokeStyle = colorToCSS(done ? 0xff22c55e : p.checkboxBorder);
          ctx.lineWidth = 1.5;
          ctx.stroke();
          if (done) {
            ctx.strokeStyle = colorToCSS(0xffffffff);
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(4.5, 9.5);
            ctx.lineTo(7.5, 12.5);
            ctx.lineTo(13.5, 6);
            ctx.stroke();
          }
        },
        mouseClick() {
          toggleTodo(todo.id);
        },
      });

      // 文本：宽度显式给定（旧版 flex 里 grow 且未定尺寸的节点会让主方向分配陷入
      // 循环调用 memo；canvasRender2 的 size/fromInside 模型没有这个限制）。
      // 有链接按钮时留出 18 + gap 8 的宽度。
      renderWrappedText({
        width: todo.link ? 244 : 270,
        spans: (): RichTextSpan[] => {
          const p = palette();
          const main: RichTextSpan = {
            text: todo.text,
            style: {
              fontFamily: FONT,
              fontSize: 13,
              color: todo.done ? p.placeholder : p.text,
              decoration: todo.done ? { lineThrough: true } : {},
            },
          };
          if (!todo.link) return [main];
          return [
            main,
            {
              text: ' 打开链接',
              url: todo.link,
              style: {
                fontFamily: FONT,
                fontSize: 13,
                color: p.link,
                decoration: { underline: true },
              },
            },
          ];
        },
      });

      // 链接按钮：仅带 link 的条目出现（hide 的节点会被父布局过滤，不占位）。
      // 旧版 RichTextNode 只把 span.url 当样式，没有链接命中判定，
      // 因此这里用独立按钮承接点击，行为与 canvasRender2 的点链接一致。
      renderRect({
        width: 18,
        height: 18,
        hide: () => !todo.link,
        draw(ctx) {
          ctx.strokeStyle = colorToCSS(palette().link);
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(5, 12);
          ctx.lineTo(11, 6);
          ctx.moveTo(7, 6);
          ctx.lineTo(11, 6);
          ctx.lineTo(11, 10);
          ctx.stroke();
        },
        mouseClick() {
          if (todo.link) window.open(todo.link, '_blank');
        },
      });

      // 删除按钮：点击移除该条
      renderRect({
        width: 18,
        height: 18,
        draw(ctx) {
          ctx.strokeStyle = colorToCSS(palette().checkboxBorder);
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(5, 5);
          ctx.lineTo(13, 13);
          ctx.moveTo(13, 5);
          ctx.lineTo(5, 13);
          ctx.stroke();
        },
        mouseClick() {
          removeTodo(todo.id);
        },
      });
    },
  });
}
