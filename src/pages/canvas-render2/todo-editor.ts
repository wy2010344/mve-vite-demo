import { createSignal } from 'wy-helper';
import {
  editableTextNode,
  flex,
  rectNode,
  wrappedTextNode,
} from 'mve-dom-helper/canvasRender2';
import { textDefaults } from 'mve-dom-helper/canvasRender2';
import { addTodo, palette } from './todo-store';

/**
 * 编辑器演示面板（本批新功能的主秀场）：
 * - 单行新增框：回车提交进列表，提交后自动清空并保留焦点；
 * - 多行备注：Enter 换行、Ctrl+Z/Y 撤销重做、方向键 / Home / End 导航；
 * - 掩码字段：obscure 密码模式（每字素簇一个圆点，字素边界由 Graphemes 判定）；
 * - 三个字段都可聚焦：Tab / Shift+Tab 在面板内循环（Renderer.moveFocus）；
 * - 聚焦态边框走 palette.accent，光标与选区颜色随主题。
 *
 * 键盘与输入法由 Renderer 统一路由：焦点落在编辑器上时，离屏 textarea 接管
 * 真实 DOM 焦点，keydown 转 KeyEvent2、组合串经 onComposing 上报。
 */

/** 新增待办草稿 */
export const draftText = createSignal('');
/** 多行备注 */
export const noteText = createSignal('');
/** 掩码字段 */
export const secretText = createSignal('');

/** 字段标题 */
function fieldLabel(text: string) {
  return wrappedTextNode.of({
    width: () => 356,
    text: () => text,
    fontFamily: () => 'Noto Sans SC',
    fontSize: () => 12,
    color: () => textDefaults.placeholder(),
  });
}

interface FieldArg {
  text: () => string;
  onTextChange: (value: string) => void;
  placeholder: () => string;
  /** 行数（决定输入框高度）：单行 1，多行给 >1 */
  lines: number;
  singleLine?: boolean;
  obscure?: boolean;
  /** 单行回车 / 多行 Ctrl+Enter 的提交回调 */
  onSubmit?: () => void;
  focusOrder?: number;
}

/**
 * 输入字段：外框 rectNode（背景 + 边框 + 圆角）+ 内层 editableTextNode。
 * 外框是可聚焦节点的父容器——点击内层编辑器时，Renderer 沿命中链找到
 * 最深 focusable（即编辑器本身）并登记为活跃编辑器。
 */
function textField(arg: FieldArg) {
  const height = arg.lines * 20 + 12;
  return rectNode.of({
    width: () => 356,
    height: () => height,
    padding: () => 6,
    background: () => palette().inputBg,
    borderColor: () => palette().inputBorder,
    borderWidth: () => 1,
    radius: () => 6,
    children: [
      editableTextNode.of({
        width: () => 342,
        height: () => height - 14,
        text: arg.text,
        onTextChange: arg.onTextChange,
        placeholder: arg.placeholder,
        singleLine: () => !!arg.singleLine,
        obscure: () => !!arg.obscure,
        onSubmit: arg.onSubmit,
        focusOrder: () => arg.focusOrder ?? null,
        fontFamily: () => 'Noto Sans SC',
        fontSize: () => 14,
        color: () => textDefaults.text(),
        selectionColor: () => palette().selection,
      }),
    ],
  });
}

/** 编辑器演示面板（放在列表下方，作为独立一节） */
export function editorPanel() {
  return rectNode.of({
    width: () => 380,
    padding: () => 10,
    background: () => palette().card,
    borderColor: () => palette().border,
    borderWidth: () => 1,
    radius: () => 10,
    layout: flex({ gap: 8, alignItem: 'center' }),
    children: [
      fieldLabel('文本编辑器（Tab 切换 / Ctrl+Z 撤销 / Ctrl+A 全选）'),
      textField({
        text: draftText.get,
        onTextChange: v => draftText.set(v),
        placeholder: () => '输入新待办，回车加入列表',
        lines: 1,
        singleLine: true,
        focusOrder: 1,
        onSubmit() {
          const v = draftText.get().trim();
          if (!v) return;
          addTodo(v);
          draftText.set('');
        },
      }),
      textField({
        text: noteText.get,
        onTextChange: v => noteText.set(v),
        placeholder: () => '多行备注：Enter 换行，Ctrl+Enter 加入列表',
        lines: 3,
        focusOrder: 2,
      }),
      textField({
        text: secretText.get,
        onTextChange: v => secretText.set(v),
        placeholder: () => '掩码字段（obscure）',
        lines: 1,
        singleLine: true,
        obscure: true,
        focusOrder: 3,
      }),
    ],
  });
}
