import { fdom } from 'mve-dom';
import { ValueOrGet } from 'wy-helper';

// 按钮组件
function renderSVGButton(content: ValueOrGet<string>, onClick: () => void) {
  fdom.button({
    s_width: '60px',
    s_height: '40px',
    s_background: 'rgba(255,255,255,0.1)',
    s_border: '1px solid rgba(255,255,255,0.3)',
    s_borderRadius: '8px',
    s_color: 'white',
    s_cursor: 'pointer',
    onClick,
    childrenType: 'text',
    children: content,
  });
}

// 控制面板组件
export function renderControlPanel(
  isPlaying: () => boolean,
  showTrails: () => boolean,
  ballCount: () => number,
  gravity: () => number,
  onTogglePlay: () => void,
  onReset: () => void,
  onToggleTrails: () => void,
  onChangeBallCount: () => void,
  onChangeGravity: () => void
) {
  fdom.div({
    s_width: '100%',
    s_height: '80px',
    s_display: 'flex',
    s_justifyContent: 'space-around',
    s_alignItems: 'center',
    s_background: 'rgba(255,255,255,0.1)',
    s_border: '1px solid rgba(255,255,255,0.2)',
    s_borderRadius: '8px',
    children() {
      // 播放/暂停按钮
      renderSVGButton(() => (isPlaying() ? '⏸️' : '▶️'), onTogglePlay);

      // 重置按钮
      renderSVGButton('🔄', onReset);

      // 轨迹开关 - 根据状态改变颜色
      renderSVGButton('✨', onToggleTrails);

      // 小球数量控制
      renderSVGButton(() => `🔢 ${ballCount()}`, onChangeBallCount);

      // 重力控制
      renderSVGButton(() => `🌍 ${gravity().toFixed(1)}`, onChangeGravity);
    },
  });
}
