import {
  CursorType2,
  Fc,
  Node2,
  flex,
  rectNode,
  richTextNode,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import { storeRef } from 'wy-helper';
import { palette } from '../canvas-render2/todo-store';

/**
 * 新特性示例页的公共小部件。
 *
 * 这一页只演示 canvasRender2 里**待办清单没覆盖**的能力：
 * 浮层（Pop / Toast / Placement）、异步图片（ImageLoader + postDelayed）、
 * 富文本编辑器（样式段）、布局依赖审计（LayoutAudit）、
 * 以及双击 / 右键 / 光标这些指针语义。
 */

/** 卡片宽度（两列排布，画布约 900 宽） */
export const CARD_W = 416;

/** 单行说明文字（自动按卡片宽换行） */
export function hint(text: () => string): Fc {
  return wrappedTextNode({
    width: () => CARD_W - 20,
    text,
    fontFamily: () => 'Noto Sans SC',
    fontSize: () => 12,
    color: () => textDefaults.placeholder(),
  });
}

/** 卡片标题 */
export function cardTitle(text: string): Fc {
  return richTextNode({
    autoWidth: () => true,
    spans: () => [
      {
        text,
        style: {
          fontFamily: 'Noto Sans SC',
          fontSize: 15,
          fontWeight: 700,
          color: textDefaults.text(),
        },
      },
    ],
  });
}

/**
 * 卡片：底色 / 边框 / 圆角 + 竖排内容。
 * 宽度写死，避免在 alignFix 的父布局里触发"向父级要尺寸"的依赖环。
 */
export function card(title: string, children: readonly Fc[]): Fc {
  return rectNode({
    // 名字只用于诊断（成环 / 尺寸错误会点名节点），不影响布局
    debugName: () => `card(${title})`,
    width: () => CARD_W,
    padding: () => 10,
    radius: () => 10,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({
      direction: 'y',
      gap: 8,
      alignFix: true,
      alignItem: 'stretch',
    }),
    children: [cardTitle(title), ...children],
  });
}

/**
 * 横向一行（宽度由内容决定，左对齐）。
 *
 * 注意：这里**不能**写 `alignFix: true`。本行是 `direction:'x'`，交叉轴 = 纵向；
 * 而它的父（`card`/`column`）主轴纵向是 `grow`（由子节点撑高）。若把交叉轴
 * 纵向锁成 `alignFix`，子节点就要向父级要高度、父级又向子节点要高度 —— 互推成环
 * （`LayoutCycleError` / "循环调用 memo"）。所以交叉轴高度一律由自身内容推导，
 * 这是与待办清单 `todoItem`（`flex({direction:'x'})`）一致的写法。
 */
export function row(children: readonly Fc[], gap = 8): Fc {
  return rectNode({
    // 名字只用于诊断（成环 / 尺寸错误会点名节点），不影响布局
    debugName: () => 'row',
    layout: flex({
      direction: 'x',
      gap,
      alignItem: 'center',
    }),
    children,
  });
}

export interface ButtonArg {
  label: () => string;
  /** 主按钮（深底白字） */
  primary?: boolean;
  /** 高亮态（读信号，随状态重绘） */
  active?: () => boolean;
  onClick: () => void;
}

/**
 * 按钮：**带节点句柄**。
 *
 * 浮层（下拉 / 右键菜单）要把按钮自己的绝对矩形当锚点，所以这里不能只返回
 * `Fc`——用 `create(...)(ref)` 先占住 ref，节点建好后 `node()` 就是它的句柄
 * （与 `nodeOf` 同一手法，只是把取值点暴露给调用方）。
 */
export function buildButton(arg: ButtonArg): {
  fc: Fc;
  node: () => Node2 | null;
} {
  const ref = storeRef<Node2>(undefined!);
  const node = () => (ref.get() as Node2 | undefined) ?? null;
  const fc = rectNode({
    nodeRef: ref,
    paddingInline: () => 10,
    paddingBlock: () => 5,
    radius: () => 6,
    background: () => {
      if (arg.primary) return 0xff1d4ed8;
      return arg.active?.() ? palette().btnActiveBg : palette().btnBg;
    },
    borderColor: () => palette().border,
    borderWidth: () => 1,
    cursor: () => CursorType2.POINTER,
    mouseClick() {
      arg.onClick();
    },
    layout: flex({ direction: 'x' }),
    children: [
      wrappedTextNode({
        autoWidth: () => true,
        text: arg.label,
        fontFamily: () => 'Noto Sans SC',
        fontSize: () => 13,
        color: () => {
          if (arg.primary) return 0xffffffff;
          return arg.active?.() ? palette().btnActiveText : palette().btnText;
        },
      }),
    ],
  });
  return { fc, node };
}

/** 不需要句柄时只要 Fc */
export function button(arg: ButtonArg): Fc {
  return buildButton(arg).fc;
}

/** 一个中性的小标签（键位提示等） */
export function chip(text: () => string): Fc {
  return rectNode({
    paddingInline: () => 6,
    paddingBlock: () => 2,
    radius: () => 4,
    background: () => palette().cardDone,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({ direction: 'x' }),
    children: [
      wrappedTextNode({
        autoWidth: () => true,
        text,
        fontFamily: () => 'Noto Sans SC',
        fontSize: () => 11,
        color: () => palette().btnText,
      }),
    ],
  });
}
