import { createSignal, simpleFlex, addEffect } from 'wy-helper';
import { fdom } from 'mve-dom';
import { hookMeasureSize, renderALayout } from 'mve-dom-helper';

import type { Ball, PhysicsParams } from './types';
import { createBalls, updateBallPhysics, AnimationManager } from './physics';
import { renderControlPanel } from './components/ControlPanel';
import { renderPhysicsWorld } from './components/PhysicsWorld';
import { renderInfoPanel } from './components/InfoPanel';
import { renderDynamicTextButton } from './components/DynamicText';
import { hookTrackSignal } from 'mve-helper';
import { subscribeRequestAnimationFrame } from 'wy-dom-helper';

export default function () {
  const isPlaying = createSignal(false);
  const showTrails = createSignal(true);
  const ballCount = createSignal(8);
  const gravity = createSignal(0.2);

  // 状态管理
  const balls = createSignal<Ball[]>(createBalls(ballCount.get()));
  // 动画管理器
  const animationManager: AnimationManager | null = null;

  // 物理更新函数
  function updatePhysics() {
    const container = document.querySelector(
      '[data-physics-container]'
    ) as HTMLElement;
    if (!container || !isPlaying.get()) return;

    const params: PhysicsParams = {
      gravity: gravity.get(),
      bounce: 0.8,
      containerWidth: container.offsetWidth,
      containerHeight: container.offsetHeight,
    };

    addEffect(() => {
      const updatedBalls = updateBallPhysics(
        balls.get(),
        params,
        showTrails.get()
      );
      balls.set(updatedBalls);
    });
  }

  hookTrackSignal(isPlaying.get, function (playing) {
    if (playing) {
      return subscribeRequestAnimationFrame(updatePhysics);
    }
  });

  function resetBalls() {
    isPlaying.set(false);
    animationManager?.stop();
    balls.set(createBalls(ballCount.get()));
  }

  function toggleTrails() {
    showTrails.set(!showTrails.get());
  }

  function changeBallCount() {
    const newCount = ballCount.get() >= 12 ? 4 : ballCount.get() + 2;
    ballCount.set(newCount);
    balls.set(createBalls(newCount));
  }

  function changeGravity() {
    addEffect(() => {
      const newGravity = gravity.get() >= 0.5 ? 0.1 : gravity.get() + 0.1;
      gravity.set(Math.round(newGravity * 10) / 10);
    });
  }

  function handleBallClick(ballId: number) {
    addEffect(() => {
      const updatedBalls = balls.get().map(b => ({
        ...b,
        selected: b.id === ballId ? !b.selected : false,
      }));
      balls.set(updatedBalls);
    });
  }

  function getSelectedBall(): Ball | undefined {
    return balls.get().find(b => b.selected);
  }

  return renderALayout({
    width: 800,
    height: 600,
    layout() {
      return simpleFlex({
        direction: 'y',
        alignItems: 'stretch',
        alignFix: true,
        gap: 0,
      });
    },
    render(container) {
      return fdom.div({
        s_width: () => `${container.axis.x.size()}px`,
        s_height: () => `${container.axis.y.size()}px`,
        s_position: 'relative',
        s_background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        s_borderRadius: '12px',
        s_boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        s_overflow: 'hidden',
        children() {
          // 控制面板
          renderControlPanel(
            isPlaying.get,
            showTrails.get,
            ballCount.get,
            gravity.get,
            function () {
              isPlaying.set(!isPlaying.get());
            },
            resetBalls,
            toggleTrails,
            changeBallCount,
            changeGravity
          );

          // 物理世界容器
          renderPhysicsWorld(balls.get, showTrails.get, handleBallClick);

          // 信息面板
          renderInfoPanel(getSelectedBall);

          // 演示 hookMeasureSize 的正确使用：动态文本按钮
          renderDynamicTextButton(
            () => {
              const ballsCount = balls.get().length;
              const selectedCount = balls.get().filter(b => b.selected).length;
              const status = isPlaying.get() ? '运行中' : '已暂停';
              // 动态文本内容，长度会变化
              return `${status} | 小球: ${ballsCount} | 选中: ${selectedCount}`;
            },
            () => {
              // 点击显示详细统计
              const ballsData = balls.get();
              const avgSpeed =
                ballsData.reduce(
                  (sum, b) => sum + Math.sqrt(b.vx * b.vx + b.vy * b.vy),
                  0
                ) / ballsData.length;
              alert(`平均速度: ${avgSpeed.toFixed(2)}`);
            }
          );
        },
      });
    },
  });
}
