import { fdom, fsvg } from 'mve-dom';
import { hookMeasureSize } from 'mve-dom-helper';

// 这是 hookMeasureSize 的正确使用场景：
// 文本内容动态变化，需要根据实际渲染尺寸来决定容器大小

export function renderDynamicTextButton(
  getText: () => string,
  onClick: () => void
) {
  // 正确使用 hookMeasureSize：让按钮根据文本内容自动调整大小
  const size = hookMeasureSize();

  fdom.button({
    s_display: 'inline-block',
    s_padding: '8px 16px',
    s_background: 'rgba(255,255,255,0.2)',
    s_border: '1px solid rgba(255,255,255,0.3)',
    s_borderRadius: '6px',
    s_color: 'white',
    s_cursor: 'pointer',
    s_fontSize: '14px',
    s_whiteSpace: 'nowrap', // 防止文本换行
    plugin: size.plugin, // 让 hookMeasureSize 测量这个元素
    onClick,
    children: getText(), // 动态文本内容
  });
}

// 另一个正确的使用场景：根据 SVG 内容自动调整容器大小
export function renderAutoSizedIcon(
  iconContent: () => void,
  onClick?: () => void
) {
  const size = hookMeasureSize();

  fdom.div({
    s_display: 'inline-block',
    plugin: size.plugin, // 测量这个 div 的实际尺寸
    children() {
      fsvg.svg({
        // 不设置固定尺寸，让内容决定
        viewBox: '0 0 24 24',
        s_cursor: onClick ? 'pointer' : 'default',
        onClick,
        children: iconContent,
      });
    },
  });
}
