import {
  interactionMode,
  selectionActive,
  lastFrameTime,
  events,
  drag,
} from './state';
import { hasActiveTextSelection } from './utils';

// 进入文本选择模式
export function enterTextSelectionMode() {
  interactionMode.set('text-select');
  clearQueuedPointerEvents();
  lastFrameTime.set(null);
  const stage = document.querySelector('.stage') as HTMLDivElement;
  if (stage) {
    stage.style.userSelect = '';
    stage.style.webkitUserSelect = '';
  }
  document.body.style.cursor = '';
}

// 同步选择状态
export function syncSelectionState() {
  const hasSelection = hasActiveTextSelection();
  selectionActive.set(hasSelection);
  if (hasSelection) {
    enterTextSelectionMode();
  } else if (interactionMode.get() === 'text-select' && drag.get() === null) {
    interactionMode.set('idle');
  }
}

// 检查文本选择交互是否活跃
export function isTextSelectionInteractionActive() {
  return interactionMode.get() === 'text-select' || selectionActive.get();
}

// 清除队列中的指针事件
export function clearQueuedPointerEvents() {
  events.set({
    pointerDown: null,
    pointerMove: null,
    pointerUp: null,
  });
}
