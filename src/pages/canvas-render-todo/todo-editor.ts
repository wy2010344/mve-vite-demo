import { createSignal, superCall } from 'wy-helper';
import {
  colorToCSS,
  flex,
  getActiveEditor,
  renderRect,
  renderEditableText,
  renderWrappedText,
  roundRectPath,
} from 'mve-dom-helper/canvasRender';
import type { EditableTextNode } from 'mve-dom-helper/canvasRender';
import { addTodo, palette } from './todo-store';
import { textButton } from './todo-toolbar';

const FONT = 'Noto Sans SC';

/**
 * 编辑器演示面板（对齐 canvasRender2 的 todo-editor，按旧版能力裁剪）：
 * - 单行草稿：回车提交进列表（Enter 由 setupInput 在 keydown 阶段拦截，
 *   旧版 EditableTextNode 没有 onSubmit 钩子，只能在平台输入层挡）；
 * - 多行备注：Enter 换行、Ctrl+Z/Y 撤销重做、方向键 / Home / End 导航；
 * - 两个字段都可聚焦：Tab / Shift+Tab 在面板内循环（Renderer.moveFocus）；
 * - 旧版没有 obscure / placeholder / singleLine 参数，占位符在 draw 里自绘，
 *   聚焦边框读 `isFocused()`（EngineGlobal.focused 信号，聚焦变化自动重绘）。
 */

/** 新增待办草稿 */
export const draftText = createSignal('');
/** 多行备注 */
export const noteText = createSignal('');

/** 当前草稿编辑器实例（供 view 的输入层判定"回车提交"） */
let draftEditor: EditableTextNode | null = null;

export function isDraftEditorEditing(): boolean {
  return draftEditor != null && getActiveEditor() === draftEditor;
}

/** 提交草稿到列表 */
export function submitDraft(): void {
  const v = draftText.get().trim();
  if (!v) return;
  addTodo(v);
  draftText.set('');
}

interface FieldArg {
  text: () => string;
  onTextChange: (value: string) => void;
  placeholder: string;
  /** 行数（决定输入框高度）：单行 1，多行给 >1 */
  lines: number;
  focusOrder: number;
}

/** 输入字段：编辑器自己画卡片底/边框/占位符（旧版没有独立的外框参数） */
function textField(arg: FieldArg) {
  const height = arg.lines * 20 + 12;
  return renderEditableText({
    width: 360,
    height,
    padding: 6,
    text: arg.text,
    // 受控回写：旧版签名要求返回新值（内部会用它继续推进光标）
    setText: v => {
      arg.onTextChange(v);
      return v;
    },
    focusOrder: arg.focusOrder,
    fontFamily: () => FONT,
    fontSize: () => 14,
    color: () => palette().text,
    selectionColor: () => palette().selection,
    // 旧版 cursorColor 只接受静态色值（不走 ValueOrGet），取构造时的主题色
    cursorColor: palette().accent,
    draw(ctx) {
      const p = palette();
      const focused = this.isFocused();
      const w = this.outerWidth();
      const h = this.outerHeight();
      ctx.fillStyle = colorToCSS(p.inputBg);
      roundRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 6);
      ctx.fill();
      ctx.strokeStyle = colorToCSS(focused ? p.accent : p.inputBorder);
      ctx.lineWidth = 1;
      ctx.stroke();
      // 占位符：旧版没有 placeholder 参数，文本为空时用 2D context 自绘
      if (!this.text()) {
        ctx.fillStyle = colorToCSS(p.placeholder);
        ctx.font = `14px ${FONT}, sans-serif`;
        ctx.textBaseline = 'top';
        ctx.fillText(
          arg.placeholder,
          this.paddingInlineStart(),
          this.paddingBlockStart() + 1
        );
      }
      // 段落 + 光标 + 选区（父类 RichTextNode 的绘制）
      superCall(this, 'draw', ctx);
    },
  });
}

/** 字段标题 */
function fieldLabel(text: string) {
  return renderWrappedText({
    width: 360,
    height: 18,
    text: () => text,
    fontFamily: () => FONT,
    fontSize: () => 12,
    color: () => palette().placeholder,
  });
}

/** 编辑器演示面板（放在列表下方，作为独立一节） */
export function renderEditorPanel() {
  renderRect({
    width: 380,
    padding: 10,
    layout: flex({ gap: 8, alignItem: 'stretch' }),
    draw(ctx) {
      const p = palette();
      const w = this.outerWidth();
      const h = this.outerHeight();
      ctx.fillStyle = colorToCSS(p.card);
      roundRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 10);
      ctx.fill();
      ctx.strokeStyle = colorToCSS(p.border);
      ctx.lineWidth = 1;
      ctx.stroke();
      superCall(this, 'draw', ctx);
    },
    children() {
      fieldLabel('文本编辑器（Tab 切换 / Ctrl+Z 撤销 / Ctrl+A 全选）');
      draftEditor = textField({
        text: draftText.get,
        onTextChange: v => draftText.set(v),
        placeholder: '输入新待办，回车加入列表',
        lines: 1,
        focusOrder: 1,
      });
      textField({
        text: noteText.get,
        onTextChange: v => noteText.set(v),
        placeholder: '多行备注：Enter 换行，Ctrl+Z 撤销',
        lines: 3,
        focusOrder: 2,
      });
      renderRect({
        width: 360,
        height: 30,
        layout: flex({
          direction: 'x',
          gap: 8,
          alignItem: 'stretch',
        }),
        children() {
          textButton({
            width: 88,
            label: () => '加入列表',
            primary: true,
            onClick: submitDraft,
          });
          renderWrappedText({
            width: 160,
            height: 30,
            text: () => `草稿：${draftText.get().length} 字`,
            fontFamily: () => FONT,
            fontSize: () => 12,
            color: () => palette().placeholder,
            paddingBlock: 6,
          });
        },
      });
    },
  });
}
