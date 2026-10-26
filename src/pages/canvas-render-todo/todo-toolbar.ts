import { alawaysFalse, superCall } from 'wy-helper';
import {
  colorToCSS,
  flex,
  grow,
  renderRect,
  renderRichText,
  renderWrappedText,
  roundRectPath,
  TextAlign,
} from 'mve-dom-helper/canvasRender';
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

const FONT = 'Noto Sans SC';

/** 按钮高度 / 圆角半径（胶囊） */
const BTN_H = 30;

/**
 * 通用按钮：WrappedText 承接文本 + 点击，`draw` 画胶囊底。
 * 宽度显式给定：旧版 RectNode 的尺寸来自父布局分配，不像 canvasRender2 那样
 * 能按内容推导，写死宽度可避免父 flex 均分导致按钮变形。
 */
export function textButton({
  label,
  primary = false,
  active = alawaysFalse,
  disabled,
  width,
  onClick,
}: {
  label: () => string;
  primary?: boolean;
  active?: () => boolean;
  disabled?: () => boolean;
  /** 固定宽度（不给则 autoWidth 按文本撑开） */
  width?: number;
  onClick: () => void;
}) {
  return renderWrappedText({
    autoWidth: width == null,
    width,
    paddingBlock: 6,
    paddingInline: 10,
    mouseClick() {
      if (disabled?.()) return;
      onClick();
    },
    text: label,
    fontFamily: () => FONT,
    fontSize: () => 13,
    color: () => {
      const p = palette();
      if (disabled?.()) return p.btnDisabledText;
      if (primary) return 0xffffffff;
      return active() ? p.btnActiveText : p.btnText;
    },
    draw(ctx) {
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
      roundRectPath(
        ctx,
        0,
        0,
        this.outerWidth(),
        this.outerHeight(),
        BTN_H / 2
      );
      ctx.fill();
      superCall(this, 'draw', ctx);
    },
  });
}

/** 标题 + 统计（统计文本右对齐，grow 撑满） */
export function renderTodoHeader() {
  renderRect({
    width: 380,
    paddingInline: 4,
    layout: flex({ direction: 'x', gap: 8 }),
    children() {
      renderRichText({
        autoWidth: true,
        spans: () => [
          {
            text: '待办清单',
            style: {
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 700,
              color: palette().text,
            },
          },
        ],
      });
      renderRichText({
        // 统计右对齐：显式宽度 + textAlign END（旧版 grow 节点需要基础尺寸）
        width: 240,
        exts: [grow({ argGrow: 1 })],
        // textAlign: TextAlign.END,
        spans: () => {
          const s = stats();
          return [
            {
              text: `共 ${s.total} 项 · 完成 ${s.done} 项`,
              style: {
                fontFamily: FONT,
                fontSize: 13,
                color: palette().placeholder,
              },
            },
          ];
        },
      });
    },
  });
}

/** 过滤切换：全部 / 未完成 / 已完成 */
export function renderFilterBar() {
  const buttons: Array<{ label: string; value: TodoFilter }> = [
    { label: '全部', value: 'all' },
    { label: '未完成', value: 'active' },
    { label: '已完成', value: 'done' },
  ];
  renderRect({
    width: 380,
    height: BTN_H,
    paddingInline: 4,
    layout: flex({ direction: 'x', gap: 8, alignItem: 'stretch' }),
    children() {
      buttons.forEach(b => {
        textButton({
          label: () => b.label,
          active: () => filter.get() == b.value,
          onClick() {
            filter.set(b.value);
          },
        });
      });
    },
  });
}

/** 操作栏：添加一条 / 清除已完成 / 空态提示 */
export function renderActionBar() {
  renderRect({
    width: 380,
    height: BTN_H,
    paddingInline: 4,
    layout: flex({ direction: 'x', gap: 8, alignItem: 'stretch' }),
    children() {
      textButton({
        label: () => '+ 添加一条',
        primary: true,
        onClick() {
          addSampleTodo();
        },
      });
      textButton({
        label: () => '清除已完成',
        onClick() {
          clearDone();
        },
      });
      renderWrappedText({
        width: 160,
        text: () => (visibleTodos().length == 0 ? '当前过滤下没有待办' : ''),
        fontFamily: () => FONT,
        fontSize: () => 12,
        color: () => palette().placeholder,
      });
    },
  });
}

/**
 * 工具行：撤销 / 重做 / 主题切换。
 * 撤销/重做消费 todo-store 的快照历史（增删改均可退）；
 * disabled 现读 canUndo/canRedo 信号，无路可走时置灰。
 */
export function renderToolBar() {
  renderRect({
    width: 380,
    height: BTN_H,
    paddingInline: 4,
    layout: flex({ direction: 'x', gap: 8, alignItem: 'stretch' }),
    children() {
      textButton({
        label: () => '撤销',
        disabled: () => !canUndo(),
        onClick() {
          undoTodo();
        },
      });
      textButton({
        label: () => '重做',
        disabled: () => !canRedo(),
        onClick() {
          redoTodo();
        },
      });
      textButton({
        label: () => (theme.get() == 'dark' ? '切换浅色' : '切换深色'),
        onClick() {
          toggleTheme();
        },
      });
    },
  });
}
