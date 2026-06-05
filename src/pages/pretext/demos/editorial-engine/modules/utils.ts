import {
  layoutNextLine,
  layoutWithLines,
  prepareWithSegments,
  walkLineRanges,
  type LayoutCursor,
  type PreparedTextWithSegments,
} from '@chenglou/pretext';
import {
  Interval,
  PositionedLine,
  HeadlineFit,
  Orb,
  CircleObstacle,
  RectObstacle,
  TextProjection,
} from './constants';
import { cachedHeadline } from './state';
import { HEADLINE_TEXT, HEADLINE_FONT_FAMILY } from './constants';

// 计算文本行槽位
export function carveTextLineSlots(
  base: Interval,
  blocked: Interval[]
): Interval[] {
  let slots = [base];
  for (let blockedIndex = 0; blockedIndex < blocked.length; blockedIndex++) {
    const interval = blocked[blockedIndex]!;
    const next: Interval[] = [];
    for (let slotIndex = 0; slotIndex < slots.length; slotIndex++) {
      const slot = slots[slotIndex]!;
      if (interval.right <= slot.left || interval.left >= slot.right) {
        next.push(slot);
        continue;
      }
      if (interval.left > slot.left)
        next.push({ left: slot.left, right: interval.left });
      if (interval.right < slot.right)
        next.push({ left: interval.right, right: slot.right });
    }
    slots = next;
  }
  return slots.filter(slot => slot.right - slot.left >= 50); // MIN_SLOT_WIDTH
}

// 计算圆形障碍物的区间
export function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
  hPad: number,
  vPad: number
): Interval | null {
  const top = bandTop - vPad;
  const bottom = bandBottom + vPad;
  if (top >= cy + r || bottom <= cy - r) return null;
  const minDy =
    cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom;
  if (minDy >= r) return null;
  const maxDx = Math.sqrt(r * r - minDy * minDy);
  return { left: cx - maxDx - hPad, right: cx + maxDx + hPad };
}

// 适配标题大小
export function fitHeadline(
  maxWidth: number,
  maxHeight: number,
  maxSize: number = 92
): HeadlineFit {
  const cache = cachedHeadline.get();
  if (
    maxWidth === cache.width &&
    maxHeight === cache.height &&
    maxSize === cache.maxSize
  ) {
    return { fontSize: cache.fontSize, lines: cache.lines };
  }

  let lo = 20;
  let hi = maxSize;
  let best = lo;
  let bestLines: PositionedLine[] = [];

  while (lo <= hi) {
    const size = Math.floor((lo + hi) / 2);
    const font = `700 ${size}px ${HEADLINE_FONT_FAMILY}`;
    const lineHeight = Math.round(size * 0.93);
    const prepared = prepareWithSegments(HEADLINE_TEXT, font);
    let breaksWord = false;
    let lineCount = 0;

    walkLineRanges(prepared, maxWidth, line => {
      lineCount++;
      if (line.end.graphemeIndex !== 0) breaksWord = true;
    });

    const totalHeight = lineCount * lineHeight;
    if (!breaksWord && totalHeight <= maxHeight) {
      best = size;
      const result = layoutWithLines(prepared, maxWidth, lineHeight);
      bestLines = result.lines.map((line, index) => ({
        x: 0,
        y: index * lineHeight,
        text: line.text,
        width: line.width,
      }));
      lo = size + 1;
    } else {
      hi = size - 1;
    }
  }

  cachedHeadline.set({
    width: maxWidth,
    height: maxHeight,
    maxSize: maxSize,
    fontSize: best,
    lines: bestLines,
  });
  return { fontSize: best, lines: bestLines };
}

// 布局列
export function layoutColumn(
  prepared: PreparedTextWithSegments,
  startCursor: LayoutCursor,
  regionX: number,
  regionY: number,
  regionW: number,
  regionH: number,
  lineHeight: number,
  circleObstacles: CircleObstacle[],
  rectObstacles: RectObstacle[],
  singleSlotOnly: boolean = false
): { lines: PositionedLine[]; cursor: LayoutCursor } {
  let cursor: LayoutCursor = startCursor;
  let lineTop = regionY;
  const lines: PositionedLine[] = [];
  let textExhausted = false;

  while (lineTop + lineHeight <= regionY + regionH && !textExhausted) {
    const bandTop = lineTop;
    const bandBottom = lineTop + lineHeight;
    const blocked: Interval[] = [];

    for (
      let obstacleIndex = 0;
      obstacleIndex < circleObstacles.length;
      obstacleIndex++
    ) {
      const obstacle = circleObstacles[obstacleIndex]!;
      const interval = circleIntervalForBand(
        obstacle.cx,
        obstacle.cy,
        obstacle.r,
        bandTop,
        bandBottom,
        obstacle.hPad,
        obstacle.vPad
      );
      if (interval !== null) blocked.push(interval);
    }

    for (let rectIndex = 0; rectIndex < rectObstacles.length; rectIndex++) {
      const rect = rectObstacles[rectIndex]!;
      if (bandBottom <= rect.y || bandTop >= rect.y + rect.h) continue;
      blocked.push({ left: rect.x, right: rect.x + rect.w });
    }

    const slots = carveTextLineSlots(
      { left: regionX, right: regionX + regionW },
      blocked
    );
    if (slots.length === 0) {
      lineTop += lineHeight;
      continue;
    }

    const orderedSlots = singleSlotOnly
      ? [
          slots.reduce((best, slot) => {
            const bestWidth = best.right - best.left;
            const slotWidth = slot.right - slot.left;
            if (slotWidth > bestWidth) return slot;
            if (slotWidth < bestWidth) return best;
            return slot.left < best.left ? slot : best;
          }),
        ]
      : [...slots].sort((a, b) => a.left - b.left);

    for (let slotIndex = 0; slotIndex < orderedSlots.length; slotIndex++) {
      const slot = orderedSlots[slotIndex]!;
      const slotWidth = slot.right - slot.left;
      const line = layoutNextLine(prepared, cursor, slotWidth);
      if (line === null) {
        textExhausted = true;
        break;
      }
      lines.push({
        x: Math.round(slot.left),
        y: Math.round(lineTop),
        text: line.text,
        width: line.width,
      });
      cursor = line.end;
    }

    lineTop += lineHeight;
  }

  return { lines, cursor };
}

// 检测球体碰撞
export function hitTestOrbs(
  orbs: Orb[],
  px: number,
  py: number,
  activeCount: number,
  radiusScale: number
): number {
  for (let index = activeCount - 1; index >= 0; index--) {
    const orb = orbs[index]!;
    const radius = orb.r * radiusScale;
    const dx = px - orb.x;
    const dy = py - orb.y;
    if (dx * dx + dy * dy <= radius * radius) return index;
  }
  return -1;
}

// 从事件创建指针样本
export function pointerSampleFromEvent(event: PointerEvent): {
  x: number;
  y: number;
} {
  return { x: event.clientX, y: event.clientY };
}

// 检查目标是否可选择文本
export function isSelectableTextTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest('.line, .headline-line, .pullquote-line') !== null
  );
}

// 检查是否有活动的文本选择
export function hasActiveTextSelection(): boolean {
  const selection = window.getSelection();
  return (
    selection !== null && !selection.isCollapsed && selection.rangeCount > 0
  );
}

// 比较定位行是否相等
export function positionedLinesEqual(
  a: PositionedLine[],
  b: PositionedLine[]
): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index++) {
    const left = a[index]!;
    const right = b[index]!;
    if (
      left.x !== right.x ||
      left.y !== right.y ||
      left.width !== right.width ||
      left.text !== right.text
    ) {
      return false;
    }
  }
  return true;
}

// 比较文本投影是否相等
export function textProjectionEqual(
  a: TextProjection | null,
  b: TextProjection
): boolean {
  return (
    a !== null &&
    a.headlineLeft === b.headlineLeft &&
    a.headlineTop === b.headlineTop &&
    a.headlineFont === b.headlineFont &&
    a.headlineLineHeight === b.headlineLineHeight &&
    a.bodyFont === b.bodyFont &&
    a.bodyLineHeight === b.bodyLineHeight &&
    a.pullquoteFont === b.pullquoteFont &&
    a.pullquoteLineHeight === b.pullquoteLineHeight &&
    positionedLinesEqual(a.headlineLines, b.headlineLines) &&
    positionedLinesEqual(a.bodyLines, b.bodyLines) &&
    positionedLinesEqual(a.pullquoteLines, b.pullquoteLines)
  );
}
