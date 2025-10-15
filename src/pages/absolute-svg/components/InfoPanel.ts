import { fdom, fsvg } from 'mve-dom';
import { simpleFlex } from 'wy-helper';
import { renderALayout } from 'mve-dom-helper';
import type { Ball } from '../types';

// 信息项组件 - 固定尺寸，不需要 hookMeasureSize
function renderInfoItem(label: string, value: string) {
  renderALayout({
    width: 150,
    height: 80,
    render(item) {
      return fdom.div({
        s_position: 'absolute',
        s_left: () => `${item.axis.x.position()}px`,
        s_top: () => `${item.axis.y.position()}px`,
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
            children: label,
          });
          fdom.div({
            s_fontSize: '12px',
            s_opacity: '0.8',
            children: value,
          });
        },
      });
    },
  });
}

// 信息面板组件
export function renderInfoPanel(getSelectedBall: () => Ball | undefined) {
  renderALayout({
    height: 80,
    render(panel) {
      return fsvg.svg({
        s_position: 'absolute',
        s_left: () => `${panel.axis.x.position()}px`,
        s_top: () => `${panel.axis.y.position()}px`,
        width: panel.axis.x.size(),
        height: panel.axis.y.size(),
        children() {
          fsvg.rect({
            width: panel.axis.x.size(),
            height: panel.axis.y.size(),
            fill: 'rgba(255,255,255,0.1)',
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1,
          });

          const selectedBall = getSelectedBall();

          if (selectedBall) {
            // 选中小球的信息 - 使用布局系统
            renderALayout({
              width: () => panel.axis.x.size(),
              height: () => panel.axis.y.size(),
              layout() {
                return simpleFlex({
                  direction: 'x',
                  alignItems: 'center',
                  alignFix: true, // 辅轴(y)尺寸由父元素确定
                  directionFix: 'around', // 主轴(x)尺寸由父元素确定，子元素间距自动计算
                });
              },
              render(infoContainer) {
                return fsvg.g({
                  children() {
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

                    // 每个信息项作为子布局节点
                    infos.forEach(info => {
                      renderInfoItem(info.label, info.value);
                    });
                  },
                });
              },
            });
          } else {
            // 提示信息
            fsvg.text({
              x: panel.axis.x.size() / 2,
              y: panel.axis.y.size() / 2,
              textAnchor: 'middle',
              dominantBaseline: 'middle',
              fontSize: '16px',
              fill: 'rgba(255,255,255,0.7)',
              children: '🎯 点击小球查看详细信息 | ✨ 点击轨迹按钮切换轨迹显示',
            });
          }
        },
      });
    },
  });
}
