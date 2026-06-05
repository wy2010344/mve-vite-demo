import { fitHeadline, layoutColumn } from './utils';
import { orbs, pointer, drag, events, lastFrameTime } from './state';
import {
  TextProjection,
  CircleObstacle,
  PullquoteRect,
  PositionedLine,
} from './constants';
import {
  BODY_FONT,
  BODY_LINE_HEIGHT,
  PQ_FONT,
  PQ_LINE_HEIGHT,
  NARROW_BREAKPOINT,
  NARROW_GUTTER,
  NARROW_COL_GAP,
  NARROW_BOTTOM_GAP,
  NARROW_ORB_SCALE,
  NARROW_ACTIVE_ORBS,
  GUTTER,
  COL_GAP,
  BOTTOM_GAP,
  HEADLINE_FONT_FAMILY,
} from './constants';
import {
  preparedBody,
  preparedPullquotes,
  pullquoteSpecs,
  DROP_CAP_LINES,
  DROP_CAP_TOTAL_W,
} from '../prepared';
import { layoutWithLines } from '@chenglou/pretext';

// 计算布局
export function calculateLayout() {
  const pageWidth = document.documentElement.clientWidth;
  const pageHeight = document.documentElement.clientHeight;
  const isNarrow = pageWidth < NARROW_BREAKPOINT;
  const gutter = isNarrow ? NARROW_GUTTER : GUTTER;
  const colGap = isNarrow ? NARROW_COL_GAP : COL_GAP;
  const bottomGap = isNarrow ? NARROW_BOTTOM_GAP : BOTTOM_GAP;
  const orbRadiusScale = isNarrow ? NARROW_ORB_SCALE : 1;
  const currentOrbs = orbs.get();
  const activeOrbCount = isNarrow
    ? Math.min(NARROW_ACTIVE_ORBS, currentOrbs.length)
    : currentOrbs.length;

  // 计算标题布局
  const headlineWidth = Math.min(
    pageWidth - gutter * 2 - (isNarrow ? 12 : 0),
    1000
  );
  const maxHeadlineHeight = Math.floor(pageHeight * (isNarrow ? 0.2 : 0.24));
  const { lines: headlineLines, fontSize: headlineSize } = fitHeadline(
    headlineWidth,
    maxHeadlineHeight,
    isNarrow ? 38 : 92
  );
  const headlineLineHeight = Math.round(headlineSize * 0.93);
  const headlineHeight = headlineLines.length * headlineLineHeight;

  // 计算正文布局
  const bodyTop = gutter + headlineHeight + (isNarrow ? 14 : 20);
  const bodyHeight = pageHeight - bodyTop - bottomGap;
  const columnCount = pageWidth > 1000 ? 3 : pageWidth > 640 ? 2 : 1;
  const totalGutter = gutter * 2 + colGap * (columnCount - 1);
  const maxContentWidth = Math.min(pageWidth, 1500);
  const columnWidth = Math.floor((maxContentWidth - totalGutter) / columnCount);
  const contentLeft = Math.round(
    (pageWidth - (columnCount * columnWidth + (columnCount - 1) * colGap)) / 2
  );

  return {
    pageWidth,
    pageHeight,
    isNarrow,
    gutter,
    colGap,
    bottomGap,
    orbRadiusScale,
    currentOrbs,
    activeOrbCount,
    headlineWidth,
    headlineHeight,
    bodyTop,
    bodyHeight,
    columnCount,
    columnWidth,
    contentLeft,
  };
}

// 更新球体位置
export function updateOrbs(now: number, layout: any): boolean {
  const {
    pageWidth,
    pageHeight,
    gutter,
    bottomGap,
    orbRadiusScale,
    activeOrbCount,
  } = layout;
  const currentOrbs = orbs.get();
  const currentDrag = drag.get();
  const currentEvents = events.get();
  let currentPointer = pointer.get();
  let stillAnimating = false;

  // 处理指针事件
  if (currentEvents.pointerDown !== null) {
    const down = currentEvents.pointerDown;
    currentPointer = down;
  }

  if (currentEvents.pointerMove !== null) {
    const move = currentEvents.pointerMove;
    currentPointer = move;
    if (currentDrag !== null) {
      // 创建新的 orbs 数组以触发响应式更新
      const updatedOrbs = [...currentOrbs];
      const orb = updatedOrbs[currentDrag.orbIndex]!;
      orb.x = currentDrag.startOrbX + (move.x - currentDrag.startPointerX);
      orb.y = currentDrag.startOrbY + (move.y - currentDrag.startPointerY);
      orbs.set(updatedOrbs);
    }
  }

  if (currentEvents.pointerUp !== null) {
    const up = currentEvents.pointerUp;
    currentPointer = up;
    if (currentDrag !== null) {
      const dx = up.x - currentDrag.startPointerX;
      const dy = up.y - currentDrag.startPointerY;
      // 创建新的 orbs 数组以触发响应式更新
      const updatedOrbs = [...currentOrbs];
      const orb = updatedOrbs[currentDrag.orbIndex]!;
      if (dx * dx + dy * dy < 16) {
        orb.paused = !orb.paused;
      } else {
        orb.x = currentDrag.startOrbX + dx;
        orb.y = currentDrag.startOrbY + dy;
      }
      orbs.set(updatedOrbs);
      drag.set(null);
    }
  }

  const draggedOrbIndex = currentDrag?.orbIndex ?? -1;
  const currentLastFrameTime = lastFrameTime.get() ?? now;
  const dt = Math.min((now - currentLastFrameTime) / 1000, 0.05);

  // 创建新的 orbs 数组以触发响应式更新
  const updatedOrbs = [...currentOrbs];
  for (let index = 0; index < updatedOrbs.length; index++) {
    if (index >= activeOrbCount) continue;
    const orb = updatedOrbs[index]!;
    const radius = orb.r * orbRadiusScale;
    if (orb.paused || index === draggedOrbIndex) continue;
    stillAnimating = true;
    orb.x += orb.vx * dt;
    orb.y += orb.vy * dt;

    if (orb.x - radius < 0) {
      orb.x = radius;
      orb.vx = Math.abs(orb.vx);
    }
    if (orb.x + radius > pageWidth) {
      orb.x = pageWidth - radius;
      orb.vx = -Math.abs(orb.vx);
    }
    if (orb.y - radius < gutter * 0.5) {
      orb.y = radius + gutter * 0.5;
      orb.vy = Math.abs(orb.vy);
    }
    if (orb.y + radius > pageHeight - bottomGap) {
      orb.y = pageHeight - bottomGap - radius;
      orb.vy = -Math.abs(orb.vy);
    }
  }

  // 球体碰撞检测
  for (let index = 0; index < activeOrbCount; index++) {
    const a = updatedOrbs[index]!;
    const aRadius = a.r * orbRadiusScale;
    for (
      let otherIndex = index + 1;
      otherIndex < activeOrbCount;
      otherIndex++
    ) {
      const b = updatedOrbs[otherIndex]!;
      const bRadius = b.r * orbRadiusScale;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = aRadius + bRadius + (layout.isNarrow ? 12 : 20);
      if (dist >= minDist || dist <= 0.1) continue;

      const force = (minDist - dist) * 0.8;
      const nx = dx / dist;
      const ny = dy / dist;

      if (!a.paused && index !== draggedOrbIndex) {
        a.vx -= nx * force * dt;
        a.vy -= ny * force * dt;
      }
      if (!b.paused && otherIndex !== draggedOrbIndex) {
        b.vx += nx * force * dt;
        b.vy += ny * force * dt;
      }
    }
  }

  // 更新 orbs 状态
  if (stillAnimating) {
    orbs.set(updatedOrbs);
  }

  // 更新其他状态
  pointer.set(currentPointer);
  events.set({
    pointerDown: null,
    pointerMove: null,
    pointerUp: null,
  });
  lastFrameTime.set(stillAnimating ? now : null);

  return stillAnimating;
}

// 生成圆形障碍物
export function generateCircleObstacles(layout: any): CircleObstacle[] {
  const { currentOrbs, activeOrbCount, orbRadiusScale, isNarrow } = layout;
  const circleObstacles: CircleObstacle[] = [];

  for (let index = 0; index < activeOrbCount; index++) {
    const orb = currentOrbs[index]!;
    circleObstacles.push({
      cx: orb.x,
      cy: orb.y,
      r: orb.r * orbRadiusScale,
      hPad: isNarrow ? 10 : 14,
      vPad: isNarrow ? 2 : 4,
    });
  }

  return circleObstacles;
}

// 生成引用文本矩形
export function generatePullquoteRects(layout: any): PullquoteRect[] {
  const {
    isNarrow,
    colGap,
    bodyTop,
    bodyHeight,
    columnCount,
    contentLeft,
    columnWidth,
  } = layout;
  const pullquoteRects: PullquoteRect[] = [];

  if (isNarrow) return pullquoteRects;

  for (let index = 0; index < pullquoteSpecs.length; index++) {
    const { prepared, placement } = pullquoteSpecs[index]!;
    if (placement.colIdx >= columnCount) continue;

    const pullquoteWidth = Math.round(columnWidth * placement.wFrac);
    const pullquoteLines = layoutWithLines(
      prepared,
      pullquoteWidth - 20,
      PQ_LINE_HEIGHT
    ).lines;
    const pullquoteHeight = pullquoteLines.length * PQ_LINE_HEIGHT + 16;
    const columnX = contentLeft + placement.colIdx * (columnWidth + colGap);
    const pullquoteX =
      placement.side === 'right'
        ? columnX + columnWidth - pullquoteWidth
        : columnX;
    const pullquoteY = Math.round(bodyTop + bodyHeight * placement.yFrac);
    const positionedLines = pullquoteLines.map(
      (line: any, lineIndex: number) => ({
        x: pullquoteX + 20,
        y: pullquoteY + 8 + lineIndex * PQ_LINE_HEIGHT,
        text: line.text,
        width: line.width,
      })
    );

    pullquoteRects.push({
      x: pullquoteX,
      y: pullquoteY,
      w: pullquoteWidth,
      h: pullquoteHeight,
      lines: positionedLines,
      colIdx: placement.colIdx,
    });
  }

  return pullquoteRects;
}

// 生成文本投影
export function generateTextProjection(
  layout: any,
  circleObstacles: CircleObstacle[],
  pullquoteRects: PullquoteRect[]
): TextProjection {
  const {
    isNarrow,
    gutter,
    colGap,
    bodyTop,
    bodyHeight,
    columnCount,
    columnWidth,
    contentLeft,
    pageHeight,
    headlineWidth,
  } = layout;

  // 计算标题布局
  const maxHeadlineHeight = Math.floor(pageHeight * (isNarrow ? 0.2 : 0.24));
  const { fontSize: headlineSize, lines: headlineLines } = fitHeadline(
    headlineWidth,
    maxHeadlineHeight,
    isNarrow ? 38 : 92
  );
  const headlineLineHeight = Math.round(headlineSize * 0.93);
  const headlineFont = `700 ${headlineSize}px ${HEADLINE_FONT_FAMILY}`;

  // 计算首字母大写矩形
  const dropCapRect = {
    x: contentLeft - 2,
    y: bodyTop - 2,
    w: DROP_CAP_TOTAL_W,
    h: DROP_CAP_LINES * BODY_LINE_HEIGHT + 2,
  };

  // 布局正文
  const allBodyLines: PositionedLine[] = [];
  let cursor = { segmentIndex: 0, graphemeIndex: 1 };
  for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
    const columnX = contentLeft + columnIndex * (columnWidth + colGap);
    const rects = [];
    if (columnIndex === 0) rects.push(dropCapRect);
    for (let rectIndex = 0; rectIndex < pullquoteRects.length; rectIndex++) {
      const pullquote = pullquoteRects[rectIndex]!;
      if (pullquote.colIdx !== columnIndex) continue;
      rects.push({
        x: pullquote.x,
        y: pullquote.y,
        w: pullquote.w,
        h: pullquote.h,
      });
    }

    const result = layoutColumn(
      preparedBody,
      cursor,
      columnX,
      bodyTop,
      columnWidth,
      bodyHeight,
      BODY_LINE_HEIGHT,
      circleObstacles,
      rects,
      isNarrow
    );
    allBodyLines.push(...result.lines);
    cursor = result.cursor;
  }

  // 收集引用文本行
  const pullquoteLines: PositionedLine[] = [];
  for (let index = 0; index < pullquoteRects.length; index++) {
    const pullquote = pullquoteRects[index]!;
    for (let lineIndex = 0; lineIndex < pullquote.lines.length; lineIndex++) {
      pullquoteLines.push(pullquote.lines[lineIndex]!);
    }
  }

  return {
    headlineLeft: gutter,
    headlineTop: gutter,
    headlineFont,
    headlineLineHeight,
    headlineLines,
    bodyFont: BODY_FONT,
    bodyLineHeight: BODY_LINE_HEIGHT,
    bodyLines: allBodyLines,
    pullquoteFont: PQ_FONT,
    pullquoteLineHeight: PQ_LINE_HEIGHT,
    pullquoteLines,
  };
}
