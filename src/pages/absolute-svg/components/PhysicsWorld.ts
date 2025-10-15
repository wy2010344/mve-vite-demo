import { fsvg } from 'mve-dom';
import { renderALayout } from 'mve-dom-helper';
import type { Ball } from '../types';
import { renderArray } from 'mve-helper';

// 物理世界组件
export function renderPhysicsWorld(
  balls: () => Ball[],
  showTrails: () => boolean,
  onBallClick: (ballId: number) => void
) {
  renderALayout({
    grow: 1, // 占据剩余空间
    render(world) {
      return fsvg.svg({
        s_position: 'absolute',
        s_left: () => `${world.axis.x.position()}px`,
        s_top: () => `${world.axis.y.position()}px`,
        width: world.axis.x.size,
        height: world.axis.y.size,
        children() {
          // 世界背景
          fsvg.rect({
            width: world.axis.x.size,
            height: world.axis.y.size,
            fill: 'rgba(0,0,0,0.2)',
            data_physicsContainer: 'true',
          });

          // 渲染小球和轨迹
          renderArray(balls, function (ball) {
            // 轨迹
            if (showTrails() && ball.trail.length > 1) {
              const pathData = ball.trail.reduce((path, point, index) => {
                return (
                  path +
                  (index === 0
                    ? `M ${point.x} ${point.y}`
                    : ` L ${point.x} ${point.y}`)
                );
              }, '');

              fsvg.path({
                d: pathData,
                stroke: ball.color,
                strokeWidth: 2,
                fill: 'none',
                opacity: 0.6,
                strokeLinecap: 'round',
              });
            }

            // 小球阴影
            fsvg.circle({
              cx: ball.x + 2,
              cy: ball.y + 2,
              r: ball.radius,
              fill: 'rgba(0,0,0,0.3)',
            });

            // 小球主体
            fsvg.circle({
              cx: ball.x,
              cy: ball.y,
              r: ball.radius,
              fill: ball.color,
              stroke: ball.selected ? 'white' : 'rgba(255,255,255,0.3)',
              strokeWidth: ball.selected ? 3 : 1,
              s_cursor: 'pointer',
              transform: ball.selected ? 'scale(1.1)' : 'scale(1)',
              s_transformOrigin: `${ball.x} ${ball.y}`,
              onClick: () => onBallClick(ball.id),
            });

            // 小球高光
            fsvg.circle({
              cx: ball.x - ball.radius * 0.3,
              cy: ball.y - ball.radius * 0.3,
              r: ball.radius * 0.3,
              fill: 'rgba(255,255,255,0.4)',
            });

            // 速度向量（仅选中时显示）
            if (ball.selected) {
              const vectorScale = 5;
              fsvg.line({
                x1: ball.x,
                y1: ball.y,
                x2: ball.x + ball.vx * vectorScale,
                y2: ball.y + ball.vy * vectorScale,
                stroke: 'yellow',
                strokeWidth: 2,
                markerEnd: 'url(#arrowhead)',
              });
            }
          });

          // 箭头标记定义
          fsvg.defs({
            children() {
              fsvg.marker({
                id: 'arrowhead',
                markerWidth: 10,
                markerHeight: 7,
                refX: 9,
                refY: 3.5,
                orient: 'auto',
                children() {
                  fsvg.polygon({
                    points: '0 0, 10 3.5, 0 7',
                    fill: 'yellow',
                  });
                },
              });
            },
          });
        },
      });
    },
  });
}
