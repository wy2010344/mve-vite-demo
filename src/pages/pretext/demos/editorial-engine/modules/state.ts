import { createSignal } from 'wy-helper';
import {
  orbDefs,
  W0,
  H0,
  Orb,
  InteractionMode,
  PointerState,
  DragState,
  PointerSample,
  TextProjection,
  PositionedLine,
} from './constants';

// 球体状态
export const orbs = createSignal<Orb[]>(
  orbDefs.map(definition => ({
    x: definition.fx * W0,
    y: definition.fy * H0,
    r: definition.r,
    vx: definition.vx,
    vy: definition.vy,
    paused: false,
  }))
);

// 指针状态
export const pointer = createSignal<PointerState>({ x: -9999, y: -9999 });

// 拖拽状态
export const drag = createSignal<DragState | null>(null);

// 交互模式
export const interactionMode = createSignal<InteractionMode>('idle');

// 选择状态
export const selectionActive = createSignal<boolean>(false);

// 事件状态
export const events = createSignal({
  pointerDown: null as PointerSample | null,
  pointerMove: null as PointerSample | null,
  pointerUp: null as PointerSample | null,
});

// 帧时间状态
export const lastFrameTime = createSignal<number | null>(null);

// 文本投影状态
export const committedTextProjection = createSignal<TextProjection | null>(
  null
);

// 缓存状态
export const cachedHeadline = createSignal({
  width: -1,
  height: -1,
  maxSize: -1,
  fontSize: 24,
  lines: [] as PositionedLine[],
});
