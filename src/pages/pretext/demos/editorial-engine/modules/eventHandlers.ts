import { events, selectionActive, drag } from './state';
import {
  hitTestOrbs,
  pointerSampleFromEvent,
  isSelectableTextTarget,
} from './utils';
import {
  NARROW_BREAKPOINT,
  NARROW_ACTIVE_ORBS,
  NARROW_ORB_SCALE,
} from './constants';
import { enterTextSelectionMode, syncSelectionState } from './interaction';

// 处理指针按下事件
export function handlePointerDown(event: PointerEvent, orbs: any[]) {
  if (isSelectableTextTarget(event.target)) {
    if (event.pointerType === 'touch') enterTextSelectionMode();
    return;
  }

  const activeOrbCount =
    window.innerWidth < NARROW_BREAKPOINT ? NARROW_ACTIVE_ORBS : orbs.length;
  const radiusScale =
    window.innerWidth < NARROW_BREAKPOINT ? NARROW_ORB_SCALE : 1;
  const hitOrbIndex = hitTestOrbs(
    orbs,
    event.clientX,
    event.clientY,
    activeOrbCount,
    radiusScale
  );
  if (hitOrbIndex !== -1) {
    event.preventDefault();
  } else if (event.pointerType === 'touch' && selectionActive.get()) {
    enterTextSelectionMode();
    return;
  }
  events.set({
    ...events.get(),
    pointerDown: pointerSampleFromEvent(event),
  });
}

// 处理指针移动事件
export function handlePointerMove(event: PointerEvent) {
  if (
    event.pointerType === 'touch' &&
    (selectionActive.get() || drag.get() === null)
  )
    return;
  events.set({
    ...events.get(),
    pointerMove: pointerSampleFromEvent(event),
  });
}

// 处理指针抬起事件
export function handlePointerUp(event: PointerEvent) {
  if (
    event.pointerType === 'touch' &&
    (selectionActive.get() || drag.get() === null)
  ) {
    syncSelectionState();
    return;
  }
  if (event.pointerType === 'touch') syncSelectionState();
  events.set({
    ...events.get(),
    pointerUp: pointerSampleFromEvent(event),
  });
}

// 处理指针取消事件
export function handlePointerCancel(event: PointerEvent) {
  if (event.pointerType === 'touch') syncSelectionState();
  events.set({
    ...events.get(),
    pointerUp: pointerSampleFromEvent(event),
  });
}
