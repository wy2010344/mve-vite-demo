import {
  CursorType2,
  Fc,
  absoluteX,
  absoluteY,
  flex,
  rectNode,
  resolvePlacement,
  richTextNode,
  usePopRegistry,
  showPopover,
  showToast,
  postDelayed,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import type { Placement, PlacementRect } from 'mve-dom-helper/canvasRender2';
import type { StateHolder } from 'mve-core';
import { createSignal } from 'wy-helper';
import type { Node2 } from 'mve-dom-helper/canvasRender2';
import { palette } from '../canvas-render2/todo-store';
import { CARD_W, buildButton, button, card, hint, row } from './ui';

/**
 * 浮层三件套：Pop / Toast / Placement。
 *
 * 三者都是**登记处 + 列表信号**（`Pop.ts` 的 `PopRegistry`）：
 * 业务侧只 append 一段 `Fc`，由渲染器在根节点 children 末尾统一展开——
 * 浮层不参与业务布局，也永远不会被业务容器裁掉。
 */

// ---------- Toast ----------

/** 已弹出 / 已自动关闭的 toast 计数（演示 postDelayed 确实按时触发） */
const toastShown = createSignal(0);
const toastClosed = createSignal(0);

/** 一条 toast 的外观：圆角卡片 + 圆点 + 文案 */
function toastBody(text: string, accent: number): Fc {
  return rectNode.of({
    paddingInline: () => 14,
    paddingBlock: () => 8,
    radius: () => 8,
    // 带 children 的容器必须给 layout：否则默认绝对布局既无法给子节点分配尺寸，
    // 放进 Toast 层（交叉轴 alignItem:'center'）时又会因"无自身尺寸"被 StackLayout 抛错。
    // 这里走横向 flex，宽度由「圆点 + 文案」内容推导。
    layout: flex({ direction: 'x', gap: 8, alignItem: 'center' }),
    background: () => 0xff1e293b,
    children: [
      rectNode.of({
        width: () => 8,
        height: () => 8,
        radius: () => 4,
        background: () => accent,
      }),
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [
          {
            text,
            style: {
              fontFamily: 'Noto Sans SC',
              fontSize: 13,
              color: 0xfff8fafc,
            },
          },
        ],
      }),
    ],
  });
}

/** Toast 卡片：自动关闭 / 常驻（点它自己关） */
export function toastDemo(): Fc {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    const registry = usePopRegistry(ctx);
    return card('Toast（Pop.ts + Timer.postDelayed）', [
      hint(
        () =>
          '自动关闭走 postDelayed（与重绘无关的时间驱动）；常驻的那条点它自己关闭。'
      ),
      row([
        button({
          label: () => '弹出 toast（3s 自动关）',
          primary: true,
          onClick() {
            if (!registry) return;
            toastShown.set(toastShown.get() + 1);
            showToast(registry, {
              content: toastBody('已保存（3 秒后自动关闭）', 0xff34d399),
              durationMs: 3000,
            });
            // 到点后再统计一次：证明 postDelayed 真的触发了（而不是靠重绘）
            postDelayed(3100, () => toastClosed.set(toastClosed.get() + 1));
          },
        }),
        button({
          label: () => '常驻（点它关闭）',
          onClick() {
            if (!registry) return;
            toastShown.set(toastShown.get() + 1);
            // 内容自己接管点击：点一下即关闭。
            // close 在 showToast 返回后才拿到，但 mouseClick 是之后才触发的，
            // 闭包读到的自然是最新值（与"先声明后赋值"的回调同一手法）。
            let close: () => void = () => {};
            close = showToast(registry, {
              content: rectNode.of({
                paddingInline: () => 14,
                paddingBlock: () => 8,
                radius: () => 8,
                background: () => 0xff7c2d12,
                cursor: () => CursorType2.POINTER,
                mouseClick() {
                  close();
                  toastClosed.set(toastClosed.get() + 1);
                },
                layout: flex({ direction: 'x', alignItem: 'center' }),
                children: [
                  richTextNode.of({
                    autoWidth: () => true,
                    spans: () => [
                      {
                        text: '常驻 toast：点我关闭',
                        style: {
                          fontFamily: 'Noto Sans SC',
                          fontSize: 13,
                          color: 0xfffed7aa,
                        },
                      },
                    ],
                  }),
                ],
              }),
              durationMs: 0,
            });
          },
        }),
      ]),
      hint(
        () => `弹出 ${toastShown.get()} 条 · 已关闭 ${toastClosed.get()} 条`
      ),
    ])(ctx);
  };
}

// ---------- Popover / Placement ----------

/** 面板里的一行可点选项 */
function menuItem(text: string, onPick: () => void): Fc {
  return rectNode.of({
    paddingInline: () => 10,
    paddingBlock: () => 6,
    radius: () => 4,
    background: () => palette().cardDone,
    cursor: () => CursorType2.POINTER,
    mouseClick: onPick,
    layout: flex({ direction: 'x' }),
    children: [
      richTextNode.of({
        autoWidth: () => true,
        spans: () => [
          {
            text,
            style: {
              fontFamily: 'Noto Sans SC',
              fontSize: 13,
              color: textDefaults.text(),
            },
          },
        ],
      }),
    ],
  });
}

/**
 * 面板外观（浮层内容本身就是普通节点，随便建）。
 *
 * 这里**不**写 `alignFix`：面板是 `showPopover` 浮层的内容，浮层面板
 * （`popoverPanel`）是 `notInLayout`，尺寸由自身子项推导（主轴纵向 `grow`）；
 * 若面板交叉轴横向再 `alignFix`，就会向浮层面板要宽度、面板又向面板内容要宽度
 * —— 开浮层时成环。所以横向宽度由内容（最宽菜单项）推导，`alignItem:'stretch'`
 * 让各菜单项撑满面板宽（标准下拉观感）。
 */
function panelBody(children: readonly Fc[]): Fc {
  return rectNode.of({
    padding: () => 6,
    radius: () => 8,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    layout: flex({ direction: 'y', gap: 4, alignItem: 'stretch' }),
    children,
  });
}

/** 节点 → 画布内矩形（浮层锚点） */
function rectOfNode(node: () => Node2 | null): PlacementRect {
  const n = node();
  if (!n) return { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: absoluteX(n),
    y: absoluteY(n),
    width: n.width(),
    height: n.height(),
  };
}

/** 上一次选择的项（演示从面板里选出结果） */
const picked = createSignal('(未选择)');

export function popoverDemo(): Fc {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    const placements: Placement[] = [
      'BottomStart',
      'TopStart',
      'RightStart',
      'LeftStart',
    ];
    const buttons = placements.map(p =>
      buildButton({
        label: () => p,
        onClick() {
          showPopover(ctx, {
            anchor: () => rectOfNode(btn.node),
            placement: () => p,
            gap: () => 4,
            children: [
              panelBody([
                menuItem('复制', () => {
                  picked.set('复制');
                }),
                menuItem('重命名', () => {
                  picked.set('重命名');
                }),
                menuItem('删除', () => {
                  picked.set('删除');
                }),
              ]),
            ],
          });
        },
      })
    );
    const btn = buttons[0];

    // 常驻面板：dismissOnOutsideClick=false，只能点面板里的"关闭"收起
    const stickyBtn = buildButton({
      label: () => '常驻面板（不自动关）',
      onClick() {
        let close: () => void = () => {};
        close = showPopover(ctx, {
          anchor: () => rectOfNode(stickyBtn.node),
          placement: () => 'BottomEnd',
          dismissOnOutsideClick: () => false,
          children: [
            panelBody([
              menuItem('点外面不会关我', () => {}),
              menuItem('关闭', () => close()),
            ]),
          ],
        });
      },
    });

    // 翻转 / 贴边是纯几何（`resolvePlacement`）：这里直接演算两个"放得下 / 放不下"的输入，
    // 比"把按钮摆到画布底部"更可控，也顺带说明它不依赖任何节点状态。
    const flipText = () =>
      [
        '试算 resolvePlacement("BottomStart", 锚 120×24):',
        `· 视口够高 → y=${
          resolvePlacement(
            'BottomStart',
            { x: 40, y: 40, width: 120, height: 24 },
            { width: 180, height: 60 },
            { width: 420, height: 400 },
            4
          ).y
        }（贴在锚点下方）`,
        `· 下方放不下 → y=${
          resolvePlacement(
            'BottomStart',
            { x: 40, y: 360, width: 120, height: 24 },
            { width: 180, height: 60 },
            { width: 420, height: 400 },
            4
          ).y
        }（翻到锚点上方）`,
      ].join('\n');

    return card('Popover / Placement（8 方向 + 翻转 + 贴边）', [
      hint(
        () => '面板不参与布局（notInLayout），位置由 resolvePlacement 现算。'
      ),
      row(buttons.map(b => b.fc)),
      row([stickyBtn.fc]),
      hint(() => `上一次选择：${picked.get()}`),
      wrappedTextNode.of({
        width: () => CARD_W - 20,
        text: flipText,
        fontFamily: () => 'Noto Sans SC',
        fontSize: () => 11,
        lineHeightMultiplier: () => 1.5,
        color: () => textDefaults.placeholder(),
      }),
    ])(ctx);
  };
}

// ---------- 右键菜单 ----------

/** 右键点击计数（证明右键只派发 contextmenu，不派发 down） */
const rightClicks = createSignal(0);

export function contextMenuDemo(): Fc {
  return function (ctx: StateHolder<Node2, readonly Node2[]>) {
    return card('右键菜单（mouseContextMenu + Pop 层）', [
      hint(
        () => '右键不派发 down：不会启动文本拖选，只沿命中链派发 contextmenu。'
      ),
      rectNode.of({
        width: () => CARD_W - 20,
        height: () => 64,
        radius: () => 8,
        background: () => palette().cardDone,
        borderColor: () => palette().border,
        borderWidth: () => 1,
        // 带 children 的容器必须给 layout，否则默认绝对布局无法给子节点分配尺寸
        layout: flex({ direction: 'x', alignItem: 'stretch' }),
        mouseContextMenu(event) {
          rightClicks.set(rightClicks.get() + 1);
          showPopover(ctx, {
            // 锚点 = 光标处的一个零尺寸矩形，面板贴在指针右下
            anchor: () => ({
              x: event.globalX,
              y: event.globalY,
              width: 0,
              height: 0,
            }),
            placement: () => 'RightStart',
            gap: () => 2,
            children: [
              panelBody([
                menuItem('打开', () => picked.set('右键-打开')),
                menuItem('在新窗口打开', () => picked.set('右键-新窗口')),
                menuItem('属性', () => picked.set('右键-属性')),
              ]),
            ],
          });
        },
        children: [
          rectNode.of({
            padding: () => 10,
            layout: flex({ direction: 'x' }),
            children: [
              richTextNode.of({
                autoWidth: () => true,
                spans: () => [
                  {
                    text: `在框内点右键（已右键 ${rightClicks.get()} 次）`,
                    style: {
                      fontFamily: 'Noto Sans SC',
                      fontSize: 13,
                      color: textDefaults.placeholder(),
                    },
                  },
                ],
              }),
            ],
          }),
        ],
      }),
    ])(ctx);
  };
}
