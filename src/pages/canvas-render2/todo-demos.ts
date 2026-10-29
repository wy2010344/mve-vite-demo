import {
  rgba,
  type ColorInt,
  type RichTextSpan,
} from 'mve-dom-helper/canvasRender';
import {
  align,
  createScroll,
  Fc,
  flex,
  grow,
  Node2,
  rectNode,
  richTextNode,
  scrollBar,
  scrollContent,
  textDefaults,
} from 'mve-dom-helper/canvasRender2';
import {
  altSignal,
  ctrlSignal,
  metaSignal,
  pressedSignal,
  registerKeyPress,
  shiftSignal,
} from 'mve-dom-helper/canvasRender2';
import type { StateHolder } from 'mve-core';
import { createSignal } from 'wy-helper';
import { palette } from './todo-store';
import { rgb } from 'culori';

/**
 * 复刻过程中新增特性的可视化演示（对应 canvasRender2 的 P0/P1 改造）：
 *
 * 1. 修饰键 / 按压态实时信号（Focus.ts）
 *    - ctrlSignal / shiftSignal / altSignal / metaSignal：宿主每次键鼠事件上报权威快照；
 *    - pressedSignal：最近一次左键按下命中的叶子节点（与焦点解耦，用于按压反馈）。
 *    下方 HUD 直接读这些信号，按键 / 点按即时高亮。
 *
 * 2. 按键旁听（registerKeyPress / notifyKeyPress）
 *    - 节点都没消费的按键会广播给旁听器；这里把它显示成"最近按键"。
 *
 * 3. noWrap 单行不折行（RichTextNode）
 *    - 宽度由父布局决定、超出部分裁剪隐藏，对齐仍生效（与 maxLines=1 补省略号不同）。
 *
 * 4. 嵌套滚动（scrollWheel + parentScroll）
 *    - 内层滚到底后剩余滚轮量接续外层（Scroll2.parentScroll），对标 Kotlin Scroll.parentScroll。
 */

// 模块级信号：最近一次"旁听"到的按键（registerKeyPress 在模块加载时注册一次）
const lastKeySignal = createSignal('(无)');
registerKeyPress(e => {
  lastKeySignal.set(e.key ? e.key : e.code);
});

/** 标题文本片段 */
function label(text: string, color: ColorInt): RichTextSpan {
  return {
    text,
    style: { fontFamily: 'Noto Sans SC', fontSize: 12, color },
  };
}

/** 一个小药丸（label 文本 + 激活态背景），active 读信号即实时响应 */
function pill(labelText: string, active: () => boolean): Fc {
  return rectNode.of({
    paddingInline: () => 8,
    paddingBlock: () => 4,
    radius: () => 6,
    background: () => (active() ? palette().accent : palette().cardDone),
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({}),
    children: [
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [label(labelText, active() ? 0xffffffff : 0xff334155)],
      }),
    ],
  });
}

/** 修饰键 + 按压态 HUD（演示信号层） */
export function modifierHud(): Fc {
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 10,
    paddingBlock: () => 6,
    radius: () => 8,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({ direction: 'x', gap: 6 }),
    children: [
      pill('Ctrl', () => ctrlSignal.get()),
      pill('Shift', () => shiftSignal.get()),
      pill('Alt', () => altSignal.get()),
      pill('Meta', () => metaSignal.get()),
      pill('Pressed', () => pressedSignal.get() != null),
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [
          label(`最近按键: ${lastKeySignal.get()}`, palette().link),
        ],
      }),
    ],
  });
}

/** noWrap 单行不折行：宽文本在定宽盒内被裁剪（对齐仍生效） */
export function nowrapDemo(): Fc {
  return rectNode.of({
    width: () => 380,
    paddingInline: () => 10,
    paddingBlock: () => 8,
    radius: () => 8,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({ direction: 'x', gap: 8 }),
    children: [
      richTextNode.of({
        exts: [grow({ argGrow: 1 })],
        noWrap: () => true,
        spans: () => [
          label(
            '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长的单行文本（noWrap 会裁剪溢出部分，不会折行也不会补省略号）',
            textDefaults.text()
          ),
        ],
      }),
    ],
  });
}

/** 多个 Fc 顺序挂载到同一父（对齐 todo-list 的 listOf） */
function listOf(...args: Fc[]): Fc {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    args.forEach(arg => arg(ctx));
  };
}

/** 生成若干高条目，作为内层滚动内容（制造溢出） */
function tallItems(): Fc[] {
  return Array.from({ length: 12 }, (_, i) =>
    rectNode.of({
      height: () => 40,
      paddingInline: () => 10,
      background: () => palette().cardDone,
      radius: () => 6,
      children: [
        richTextNode.of({
          autoWidth: () => true,
          spans: () => [label(`内层条目 ${i + 1}`, textDefaults.text())],
        }),
      ],
    })
  );
}

/**
 * 嵌套滚动：外层固定高度卡片，内部再放一个固定高度（300）的内层滚动区。
 * 内层滚到底后，剩余滚轮量经 parentScroll 接续外层 —— 单条滚轮手势连续驱动两层。
 */
export function nestedScrollDemo(): Fc {
  return rectNode.of({
    width: () => 380,
    height: () => 180,
    padding: () => 8,
    radius: () => 8,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({
      direction: 'y',
      gap: 4,
      alignFix: true,
      alignItem: 'stretch',
    }),
    children: [
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [
          label(
            '嵌套滚动：内层滚到底后剩余量接续外层（parentScroll）',
            textDefaults.placeholder()
          ),
        ],
      }),
      // 外层滚动容器（占满剩余高度）
      rectNode.of({
        exts: [grow({ argGrow: 1 })],
        layout: flex({
          direction: 'x',
          alignItem: 'stretch',
          alignFix: true,
          directionJustify: 'start',
          gap: 4,
        }),
        // borderColor: () => rgba(0, 0, 0),
        // background: () => rgba(0, 0, 0),
        children: [
          function (outerCtx: StateHolder<Node2, readonly Node2[]>) {
            const outerScroll = createScroll(
              outerCtx.getParent() as Node2,
              'y'
            );
            return listOf(
              scrollContent.of({
                scroll: outerScroll,
                layout: flex({
                  direction: 'y',
                  gap: 4,
                  alignFix: true,
                  alignItem: 'stretch',
                }),
                exts: [grow({ argGrow: 1 })],
                children: [
                  // 内层容器：固定 300 高（既作内层视口，又让外层可滚）
                  rectNode.of({
                    height: () => 300,
                    layout: flex({
                      direction: 'x',
                      alignItem: 'stretch',
                      alignFix: true,
                      directionJustify: 'start',
                      gap: 4,
                    }),
                    children: [
                      function (
                        innerCtx: StateHolder<Node2, readonly Node2[]>
                      ) {
                        const innerScroll = createScroll(
                          innerCtx.getParent() as Node2,
                          'y',
                          undefined,
                          outerScroll
                        );
                        return listOf(
                          scrollContent.of({
                            scroll: innerScroll,
                            exts: [grow({ argGrow: 1 })],
                            layout: flex({
                              direction: 'y',
                              gap: 4,
                              alignFix: true,
                              alignItem: 'stretch',
                            }),
                            children: tallItems(),
                          }),
                          scrollBar.of({
                            scroll: innerScroll,
                            trackColor: () => palette().track,
                            thumbColor: () => palette().thumb,
                          })
                        )(innerCtx);
                      },
                    ],
                  }),
                  rectNode.of({
                    height: () => 300,
                  }),
                ],
              }),
              scrollBar.of({
                scroll: outerScroll,
                trackColor: () => palette().track,
                thumbColor: () => palette().thumb,
              })
            )(outerCtx);
          },
        ],
      }),
    ],
  });
}
