import { colorToCSS, roundRectPath } from 'mve-dom-helper/canvasRender';
import {
  flex,
  grow,
  rectNode,
  richTextNode,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import {
  addSampleTodo,
  canRedo,
  canUndo,
  clearDone,
  filter,
  palette,
  redoTodo,
  stats,
  theme,
  toggleTheme,
  undoTodo,
  visibleTodos,
  type TodoFilter,
} from './todo-store';
import { alawaysFalse } from 'wy-helper';

/**
 * 通用圆角按钮：spans 取色 + draw 画胶囊底。
 * label / disabled 都是 getter——状态变化时随信号重绘
 * （disabled 在点击时也要现读，避免过期状态）。
 */
function textButton({
  label,
  primary = false,
  active = alawaysFalse,
  disabled,
  onClick,
}: {
  label: () => string;
  primary?: boolean;
  active?: () => boolean;
  disabled?: () => boolean;
  onClick: () => void;
}) {
  return wrappedTextNode.of({
    autoWidth: () => true,
    padding: () => 10,
    mouseClick() {
      if (disabled?.()) return;
      onClick();
    },
    spans: () => {
      const p = palette();
      const off = disabled?.() ?? false;
      const color = off
        ? p.btnDisabledText
        : primary
          ? 0xffffffff
          : active()
            ? p.btnActiveText
            : p.btnText;
      return [
        {
          text: label(),
          style: {
            fontFamily: 'Noto Sans SC',
            fontSize: 13,
            color,
          },
        },
      ];
    },
    draw(ctx, n) {
      const p = palette();
      const off = disabled?.() ?? false;
      ctx.fillStyle = colorToCSS(
        off
          ? p.btnDisabledBg
          : primary
            ? 0xff1d4ed8
            : active()
              ? p.btnActiveBg
              : p.btnBg
      );
      roundRectPath(ctx, 0, 0, n.width(), n.height(), n.height() / 2);
      ctx.fill();
    },
  });
}

/** 标题 + 统计（统计文本右对齐，grow 撑满） */
export function todoHeader() {
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 4,
    layout: flex({
      direction: 'x',
      gap: 8,
    }),
    children: [
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [
          {
            text: '待办清单',
            style: {
              fontFamily: 'Noto Sans SC',
              fontSize: 20,
              fontWeight: 700,
              color: textDefaults.text,
            },
          },
        ],
      }),
      richTextNode.of({
        exts: [grow({ argGrow: 1 })],
        spans: () => {
          const s = stats();
          return [
            {
              text: `共 ${s.total} 项 · 完成 ${s.done} 项`,
              style: {
                fontFamily: 'Noto Sans SC',
                fontSize: 13,
                color: textDefaults.placeholder,
              },
            },
          ];
        },
      }),
    ],
  });
}

/** 过滤切换：全部 / 未完成 / 已完成 */
export function filterBar() {
  const buttons: Array<{ label: string; value: TodoFilter }> = [
    { label: '全部', value: 'all' },
    { label: '未完成', value: 'active' },
    { label: '已完成', value: 'done' },
  ];
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 4,
    layout: flex({ direction: 'x', gap: 8, directionJustify: 'center' }),
    children: buttons.map(b =>
      textButton({
        label: () => b.label,
        active: () => filter.get() == b.value,
        onClick() {
          filter.set(b.value);
        },
      })
    ),
  });
}

/** 操作栏：添加一条 / 清除已完成 / 空态提示 */
export function actionBar() {
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 4,
    layout: flex({
      direction: 'x',
      gap: 8,
      directionJustify: 'center',
    }),
    children: [
      textButton({
        label: () => '+ 添加一条',
        primary: true,
        onClick() {
          addSampleTodo();
        },
      }),
      textButton({
        label: () => '清除已完成',
        onClick() {
          clearDone();
        },
      }),
      // 底部提示：当前过滤下无数据时高亮
      wrappedTextNode.of({
        exts: [grow({ argGrow: 1 })],
        text: () => (visibleTodos().length == 0 ? '当前过滤下没有待办' : ''),
      }),
    ],
  });
}

/**
 * 工具行：撤销 / 重做 / 主题切换。
 * 撤销/重做消费 todo-store 的快照历史（增删改均可退）；
 * disabled 现读 canUndo/canRedo 信号，无路可走时置灰。
 */
export function toolBar() {
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 4,
    layout: flex({
      direction: 'x',
      gap: 8,
      directionJustify: 'center',
    }),
    children: [
      textButton({
        label: () => '撤销',
        disabled: () => !canUndo(),
        onClick() {
          undoTodo();
        },
      }),
      textButton({
        label: () => '重做',
        disabled: () => !canRedo(),
        onClick() {
          redoTodo();
        },
      }),
      textButton({
        label: () => (theme.get() == 'dark' ? '切换浅色' : '切换深色'),
        onClick() {
          toggleTheme();
        },
      }),
    ],
  });
}
