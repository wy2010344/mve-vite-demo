import { fdom, fsvg } from 'mve-dom';
import { simpleFlex, ValueOrGet } from 'wy-helper';
import { renderALayout } from 'mve-dom-helper';

// SVG 按钮组件 - 在 SVG 内部使用
function renderSVGButton(content: ValueOrGet<string>, onClick: () => void) {
  renderALayout({
    width: 60,
    height: 40,
    render(button) {
      return fsvg.g({
        transform() {
          return `translate(${button.axis.x.position()}, ${button.axis.y.position()})`;
        },
        s_cursor: 'pointer',
        onClick,
        children() {
          // 按钮背景
          fsvg.rect({
            width: 60,
            height: 40,
            fill: 'rgba(255,255,255,0.1)',
            stroke: 'rgba(255,255,255,0.3)',
            strokeWidth: 1,
            rx: 8,
          });

          // 按钮文字
          fsvg.text({
            x: 30,
            y: 20,
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            fontSize: '16px',
            fill: 'white',
            childrenType: 'text',
            children: content,
          });
        },
      });
    },
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
  renderALayout({
    height: 80,
    render(panel) {
      return fsvg.svg({
        s_position: 'absolute',
        s_left: () => `${panel.axis.x.position()}px`,
        s_top: () => `${panel.axis.y.position()}px`,
        width: panel.axis.x.size,
        height: panel.axis.y.size,
        children() {
          // 面板背景
          fsvg.rect({
            width: panel.axis.x.size(),
            height: panel.axis.y.size(),
            fill: 'rgba(255,255,255,0.1)',
            stroke: 'rgba(255,255,255,0.2)',
            strokeWidth: 1,
          });

          // 使用布局系统排列控制按钮
          renderALayout({
            width: () => panel.axis.x.size(),
            height: () => panel.axis.y.size(),
            layout() {
              return simpleFlex({
                direction: 'x',
                alignItems: 'center',
                alignFix: true,
                directionFix: 'around',
              });
            },
            render(buttonContainer) {
              return fsvg.g({
                children() {
                  // 播放/暂停按钮
                  renderSVGButton(
                    () => (isPlaying() ? '⏸️' : '▶️'),
                    onTogglePlay
                  );

                  // 重置按钮
                  renderSVGButton('🔄', onReset);

                  // 轨迹开关 - 根据状态改变颜色
                  renderSVGButton('✨', onToggleTrails);

                  // 小球数量控制
                  renderSVGButton(() => `🔢 ${ballCount()}`, onChangeBallCount);

                  // 重力控制
                  renderSVGButton(
                    () => `🌍 ${gravity().toFixed(1)}`,
                    onChangeGravity
                  );
                },
              });
            },
          });
        },
      });
    },
  });
}
