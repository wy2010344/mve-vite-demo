import { createSignal } from 'wy-helper';
import { fdom, fsvg } from 'mve-dom';
import { renderALayout } from 'mve-dom-helper';

// 简单测试版本 - 确保基本功能工作
export default function () {
  const ballX = createSignal(100);
  const ballY = createSignal(100);

  return renderALayout({
    width: 400,
    height: 300,
    render(container) {
      return fdom.div({
        s_position: 'relative',
        s_width: '400px',
        s_height: '300px',
        s_background: '#1e3c72',
        s_borderRadius: '8px',
        children() {
          fsvg.svg({
            s_position: 'absolute',
            s_left: '0px',
            s_top: '0px',
            width: 400,
            height: 300,
            children() {
              // 背景
              fsvg.rect({
                width: 400,
                height: 300,
                fill: 'rgba(0,0,0,0.2)',
              });

              // 测试小球
              fsvg.circle({
                cx: ballX.get(),
                cy: ballY.get(),
                r: 20,
                fill: '#ff6b6b',
                stroke: 'white',
                strokeWidth: 2,
                s_cursor: 'pointer',
                onClick() {
                  ballX.set(Math.random() * 360 + 20);
                  ballY.set(Math.random() * 260 + 20);
                },
              });

              // 说明文字
              fsvg.text({
                x: 200,
                y: 30,
                textAnchor: 'middle',
                fill: 'white',
                fontSize: '16px',
                children: '点击小球移动位置',
              });
            },
          });
        },
      });
    },
  });
}
