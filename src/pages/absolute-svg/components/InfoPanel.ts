import { fdom } from 'mve-dom';
import type { Ball } from '../types';

// 信息项组件 - 固定尺寸
function renderInfoItem(label: string, value: string) {
  fdom.div({
    s_width: '150px',
    s_height: '80px',
    s_display: 'flex',
    s_flexDirection: 'column',
    s_alignItems: 'center',
    s_justifyContent: 'center',
    s_color: 'white',
    s_textAlign: 'center',
    children() {
      fdom.div({
        s_fontSize: '14px',
        s_fontWeight: 'bold',
        s_marginBottom: '4px',
        childrenType: 'text',
        children: label,
      });
      fdom.div({
        s_fontSize: '12px',
        s_opacity: '0.8',
        childrenType: 'text',
        children: value,
      });
    },
  });
}

// 信息面板组件
export function renderInfoPanel(getSelectedBall: () => Ball | undefined) {
  fdom.div({
    s_width: '100%',
    s_height: '80px',
    s_display: 'flex',
    s_justifyContent: 'space-around',
    s_alignItems: 'center',
    s_background: 'rgba(255,255,255,0.1)',
    s_border: '1px solid rgba(255,255,255,0.2)',
    s_borderRadius: '8px',
    s_color: 'white',
    children() {
      const selectedBall = getSelectedBall();

      if (selectedBall) {
        const infos = [
          {
            label: '位置',
            value: `(${Math.round(selectedBall.x)}, ${Math.round(selectedBall.y)})`,
          },
          {
            label: '速度',
            value: `(${selectedBall.vx.toFixed(1)}, ${selectedBall.vy.toFixed(1)})`,
          },
          { label: '半径', value: selectedBall.radius.toFixed(1) },
          { label: '颜色', value: selectedBall.color },
        ];

        // 每个信息项
        infos.forEach(info => {
          renderInfoItem(info.label, info.value);
        });
      } else {
        // 提示信息
        fdom.div({
          s_textAlign: 'center',
          s_fontSize: '16px',
          s_opacity: '0.7',
          children: '🎯 点击小球查看详细信息 | ✨ 点击轨迹按钮切换轨迹显示',
        });
      }
    },
  });
}
