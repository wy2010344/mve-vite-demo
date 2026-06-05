import { fdom } from 'mve-dom';
import { addEffect, createSignal } from 'wy-helper';
import { orbs } from './modules/state';
import { createOrbElements, createDropCapElement } from './modules/components';
import {
  calculateLayout,
  updateOrbs,
  generateCircleObstacles,
  generatePullquoteRects,
  generateTextProjection,
} from './modules/layout';
import {
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
} from './modules/eventHandlers';
import {
  syncSelectionState,
  isTextSelectionInteractionActive,
} from './modules/interaction';
import { textProjectionEqual } from './modules/utils';
import { committedTextProjection } from './modules/state';
import { createScheduleRender } from './scheduleRender';

// 预加载字体
await document.fonts.ready;

export default function () {
  const domCache: {
    //cache lifetime: same as page
    stage: HTMLDivElement;
    dropCap: HTMLDivElement;
    //cache lifetime: on body line-count changes
    bodyLines: HTMLSpanElement[];
    // cache lifetime: on headline line-count changes
    headlineLines: HTMLSpanElement[];
    // cache lifetime: on pullquote line-count changes
    pullquoteLines: HTMLSpanElement[];
    // cache lifetime: on pullquote-count changes
    pullquoteBoxes: HTMLDivElement[];
  } = {
    stage: undefined!,
    dropCap: undefined!,
    bodyLines: [],
    headlineLines: [],
    pullquoteLines: [],
    pullquoteBoxes: [],
  };

  const stage = fdom.div({
    className: 'stage relative w-full h-[100vh] overflow-hidden text-[#e8e4dc]',
    s_background:
      'radial-gradient(ellipse at 50% 40%, #0f0f14 0%, #0a0a0c 100%)',
    children() {
      // 创建首字母大写元素
      domCache.dropCap = createDropCapElement();

      // 创建球体元素
      createOrbElements();
    },
  });

  domCache.stage = stage;

  addEffect(() => {
    function syncPool<T extends HTMLElement>(
      pool: T[],
      count: number,
      create: () => T
    ): void {
      while (pool.length < count) {
        const element = create();
        stage.appendChild(element);
        pool.push(element);
      }
      for (let index = 0; index < pool.length; index++) {
        pool[index]!.style.display = index < count ? '' : 'none';
      }
    }

    function projectTextProjection(projection: any): void {
      // 同步标题行
      syncPool(domCache.headlineLines, projection.headlineLines.length, () => {
        const element = document.createElement('span');
        element.className =
          'headline-line absolute whitespace-pre font-bold text-white tracking-[-0.5px] z-2 select-text';
        return element;
      });
      for (let index = 0; index < projection.headlineLines.length; index++) {
        const element = domCache.headlineLines[index]!;
        const line = projection.headlineLines[index]!;
        element.textContent = line.text;
        element.style.left = `${projection.headlineLeft + line.x}px`;
        element.style.top = `${projection.headlineTop + line.y}px`;
        element.style.font = projection.headlineFont;
        element.style.lineHeight = `${projection.headlineLineHeight}px`;
      }

      // 同步正文行
      syncPool(domCache.bodyLines, projection.bodyLines.length, () => {
        const element = document.createElement('span');
        element.className =
          'line absolute whitespace-pre z-1 text-[#e8e4dc] select-text';
        return element;
      });
      for (let index = 0; index < projection.bodyLines.length; index++) {
        const element = domCache.bodyLines[index]!;
        const line = projection.bodyLines[index]!;
        element.textContent = line.text;
        element.style.left = `${line.x}px`;
        element.style.top = `${line.y}px`;
        element.style.font = projection.bodyFont;
        element.style.lineHeight = `${projection.bodyLineHeight}px`;
      }

      // 同步引用文本行
      syncPool(
        domCache.pullquoteLines,
        projection.pullquoteLines.length,
        () => {
          const element = document.createElement('span');
          element.className =
            'pullquote-line absolute whitespace-pre italic text-[#e8a070] select-text';
          return element;
        }
      );
      for (let index = 0; index < projection.pullquoteLines.length; index++) {
        const element = domCache.pullquoteLines[index]!;
        const line = projection.pullquoteLines[index]!;
        element.textContent = line.text;
        element.style.left = `${line.x}px`;
        element.style.top = `${line.y}px`;
        element.style.font = projection.pullquoteFont;
        element.style.lineHeight = `${projection.pullquoteLineHeight}px`;
      }
    }

    // 事件监听
    stage.addEventListener('pointerdown', event => {
      handlePointerDown(event, orbs.get());
      scheduleRender();
    });

    stage.addEventListener(
      'touchmove',
      event => {
        if (isTextSelectionInteractionActive()) return;
        event.preventDefault();
      },
      { passive: false }
    );

    window.addEventListener('pointermove', event => {
      handlePointerMove(event);
      scheduleRender();
    });

    window.addEventListener('pointerup', event => {
      handlePointerUp(event);
      scheduleRender();
    });

    window.addEventListener('pointercancel', event => {
      handlePointerCancel(event);
      scheduleRender();
    });

    window.addEventListener('resize', () => scheduleRender());
    document.addEventListener('selectionchange', () => {
      syncSelectionState();
      scheduleRender();
    });

    // 创建渲染循环
    const scheduleRender = createScheduleRender(function (
      now: number
    ): boolean {
      if (isTextSelectionInteractionActive()) {
        return false;
      }

      // 计算布局
      const layout = calculateLayout();

      // 更新球体
      const stillAnimating = updateOrbs(now, layout);

      // 生成圆形障碍物
      const circleObstacles = generateCircleObstacles(layout);

      // 生成引用文本矩形
      const pullquoteRects = generatePullquoteRects(layout);

      // 生成文本投影
      const textProjection = generateTextProjection(
        layout,
        circleObstacles,
        pullquoteRects
      );

      // 更新文本投影
      if (!textProjectionEqual(committedTextProjection.get(), textProjection)) {
        projectTextProjection(textProjection);
        committedTextProjection.set(textProjection);
      }

      // 更新首字母大写位置
      const { contentLeft, bodyTop } = layout;
      domCache.dropCap.style.left = `${contentLeft}px`;
      domCache.dropCap.style.top = `${bodyTop}px`;

      // 同步引用文本框
      syncPool(domCache.pullquoteBoxes, pullquoteRects.length, () => {
        const element = document.createElement('div');
        element.className = 'pullquote-box';
        return element;
      });

      for (let index = 0; index < pullquoteRects.length; index++) {
        const pullquote = pullquoteRects[index]!;
        const boxElement = domCache.pullquoteBoxes[index]!;
        boxElement.style.left = `${pullquote.x}px`;
        boxElement.style.top = `${pullquote.y}px`;
        boxElement.style.width = `${pullquote.w}px`;
        boxElement.style.height = `${pullquote.h}px`;
      }

      return stillAnimating;
    });

    // 启动渲染循环
    scheduleRender();
  });

  return stage;
}
