import {
  Fc,
  Node2,
  asEditorHandle2,
  asRichEditable2,
  editableTextNode,
  flex,
  getActiveEditor,
  rectNode,
  registerKeyPress,
  styleAtIn,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import type { RichSegment, RichTextStyle } from 'mve-dom-helper/canvasRender2';
import { createSignal, storeRef } from 'wy-helper';
import { palette } from '../canvas-render2/todo-store';
import { CARD_W, button, card, hint, row } from './ui';

/**
 * 富文本编辑器（`RichEditableTextNode`）示例 —— 待办清单只演示了普通文本编辑器。
 *
 * 三块能力：
 * - **样式段表**（`RichSegment[]`）：文本是真相源，样式只是"区间 → 样式"的边界表；
 * - **文本变更自动对齐**：打字 / 删除 / 撤销都会经 `alignIn` 平移裁剪段表，
 *   调用方不需要在每个编辑动作里各写一遍（组件内部唯一出口 `writeText`）；
 * - **`setStyleRange`**：把「选区 → 样式」这一步暴露给工具栏 / 快捷键。
 *
 * 与 Kotlin 的差别只是形态：Kotlin 是 `RichEditableTextNode` 继承 + 可变段表，
 * 这里是"纯函数段表 + 编辑器内核闭包状态"，段表算法可以原样搬到 ooc / Rust。
 */

const INITIAL =
  '选中一段文字，按 Ctrl+B 加粗 / Ctrl+I 斜体 / Ctrl+U 下划线。没有选区时，下面的按钮作用于整段。';

/** 逻辑文本（真相源） */
const richText = createSignal(INITIAL);
/** 样式段镜像（由 onSegmentsChange 回写，仅用于展示段表） */
const segTable = createSignal<readonly RichSegment[]>([]);

/** 编辑器节点句柄（经 `arg.nodeRef` 自建 ref，建好后回填） */
let richNode: Node2 | null = null;

function editorHandle() {
  return richNode ? asEditorHandle2(richNode) : undefined;
}

/** 当前选区（无选区 / 未聚焦 → null） */
function selectedRange(): [number, number] | null {
  const pair = editorHandle()?.cursorSelPair();
  if (!pair) return null;
  const a = pair.anchor.offset;
  const b = pair.focus.offset;
  const s = Math.min(a, b);
  const e = Math.max(a, b);
  return e > s ? [s, e] : null;
}

/** 作用区间：有选区用选区，否则整段 */
function targetRange(): [number, number] {
  return selectedRange() ?? [0, richText.get().length];
}

/** 区间起点的当前样式（未被段表覆盖时为 null = 基础样式） */
function styleAtTarget(): RichTextStyle | null {
  if (!richNode) return null;
  const rich = asRichEditable2(richNode);
  if (!rich) return null;
  return styleAtIn(rich.getSegments(), richText.get(), targetRange()[0]);
}

/**
 * 把 [patch] 合并进目标区间的样式（保留原有其它字段）。
 * 这是工具栏 / 快捷键唯一的写入口：先读现样式，再叠加改动，最后整段设回。
 */
function patchStyle(patch: Partial<RichTextStyle>): void {
  if (!richNode) return;
  const rich = asRichEditable2(richNode);
  if (!rich) return;
  const [s, e] = targetRange();
  if (e <= s) return;
  const next: RichTextStyle = { ...(styleAtTarget() ?? {}), ...patch };
  rich.setStyleRange(s, e, next);
}

function toggleBold(): void {
  patchStyle({ fontWeight: styleAtTarget()?.fontWeight === 700 ? 400 : 700 });
}

function toggleItalic(): void {
  patchStyle({ italic: !styleAtTarget()?.italic });
}

function toggleUnderline(): void {
  patchStyle({
    decoration: styleAtTarget()?.decoration?.underline
      ? { underline: false }
      : { underline: true },
  });
}

/** 清除目标区间样式（回到基础样式） */
function clearStyle(): void {
  if (!richNode) return;
  const [s, e] = targetRange();
  asRichEditable2(richNode)?.setStyleRange(s, e, null);
}

// 快捷键：Ctrl/Cmd + B / I / U。
// 引擎的键盘路由把"编辑器不认领的键"广播到全局旁听（registerKeyPress），
// 所以这里不需要改编辑器内核，也不会抢普通输入（可打印键由编辑器自己消费）。
registerKeyPress(e => {
  if (!richNode) return;
  // 只有在"这个富文本编辑器是活跃编辑器"时才改样式，避免影响别的输入框
  if (getActiveEditor() !== editorHandle()) return;
  if (!(e.ctrl || e.meta) || e.alt) return;
  const k = e.key.toLowerCase();
  if (k === 'b') toggleBold();
  else if (k === 'i') toggleItalic();
  else if (k === 'u') toggleUnderline();
});

/** 段表的人话描述（演示"哪段是什么样式"） */
function describeStyle(style: RichTextStyle | null): string {
  if (!style) return '基础';
  const tags: string[] = [];
  if (style.fontWeight === 700) tags.push('粗');
  if (style.italic) tags.push('斜');
  if (style.decoration?.underline) tags.push('下划线');
  return tags.length ? tags.join('+') : '基础';
}

/** 段表文本：`[0,12) 粗  [12,40) 基础` */
function segmentTableText(): string {
  const list = segTable.get();
  const len = richText.get().length;
  if (list.length === 0) return `[0, ${len}) 基础`;
  const parts: string[] = [];
  let prev = 0;
  for (const seg of list) {
    parts.push(`[${prev}, ${seg.end}) ${describeStyle(seg.style)}`);
    prev = seg.end;
  }
  return parts.join('   ');
}

/** 富文本编辑器卡片 */
export function richEditorDemo(): Fc {
  return card('富文本编辑器（segments + setStyleRange）', [
    hint(
      () =>
        '文本是真相源，样式只是"区间 → 样式"的边界表；文本变更时段表自动对齐。'
    ),
    // 输入框外壳（焦点在里层编辑器上：命中链会找到最深 focusable）
    rectNode({
      width: () => CARD_W - 20,
      height: () => 104,
      padding: () => 8,
      radius: () => 6,
      background: () => palette().inputBg,
      borderColor: () => palette().inputBorder,
      borderWidth: () => 1,
      children: [
        function (ctx) {
          const ref = storeRef<Node2>(undefined!);
          editableTextNode({
            width: () => CARD_W - 40,
            height: () => 88,
            text: richText.get,
            onTextChange: v => richText.set(v),
            // 段表读写：读回来是为了"节点被重建时恢复"，写回是为了展示
            segments: segTable.get,
            onSegmentsChange: list => segTable.set(list),
            fontFamily: () => 'Noto Sans SC',
            fontSize: () => 14,
            color: () => textDefaults.text(),
            selectionColor: () => palette().selection,
            nodeRef: ref,
          })(ctx);
          richNode = ref.get();
        },
      ],
    }),
    row([
      button({
        label: () => 'B 粗',
        active: () => styleAtTarget()?.fontWeight === 700,
        onClick: toggleBold,
      }),
      button({
        label: () => 'I 斜',
        active: () => !!styleAtTarget()?.italic,
        onClick: toggleItalic,
      }),
      button({
        label: () => 'U 下划线',
        active: () => !!styleAtTarget()?.decoration?.underline,
        onClick: toggleUnderline,
      }),
      button({ label: () => '清除样式', onClick: clearStyle }),
    ]),
    row([
      button({
        label: () => '整段加粗',
        onClick() {
          if (!richNode) return;
          asRichEditable2(richNode)?.setStyleRange(0, richText.get().length, {
            fontWeight: 700,
          });
        },
      }),
      // 撤销 / 重做是编辑器的公开动作，不依赖焦点（工具栏可以直接调）
      button({
        label: () => '撤销',
        onClick() {
          editorHandle()?.undo();
        },
      }),
      button({
        label: () => '重做',
        onClick() {
          editorHandle()?.redo();
        },
      }),
    ]),
    hint(() => `段表：${segmentTableText()}`),
  ]);
}
