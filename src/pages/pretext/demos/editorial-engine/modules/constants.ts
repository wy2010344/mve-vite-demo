import { BODY_TEXT, PULLQUOTE_TEXTS } from '../BODY_TEXT';

// 字体和布局常量
export const BODY_FONT =
  '18px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';
export const BODY_LINE_HEIGHT = 30;
export const HEADLINE_FONT_FAMILY =
  '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif';
export const HEADLINE_TEXT = 'THE FUTURE OF TEXT LAYOUT IS NOT CSS';
export const GUTTER = 48;
export const COL_GAP = 40;
export const BOTTOM_GAP = 20;
export const DROP_CAP_LINES = 3;
export const MIN_SLOT_WIDTH = 50;
export const NARROW_BREAKPOINT = 760;
export const NARROW_GUTTER = 20;
export const NARROW_COL_GAP = 20;
export const NARROW_BOTTOM_GAP = 16;
export const NARROW_ORB_SCALE = 0.58;
export const NARROW_ACTIVE_ORBS = 3;

// 窗口尺寸
export const W0 = window.innerWidth;
export const H0 = window.innerHeight;

// 引用文本和字体
export const PQ_FONT = `italic 19px ${HEADLINE_FONT_FAMILY}`;
export const PQ_LINE_HEIGHT = 27;

// 球体定义
export const orbDefs = [
  { fx: 0.52, fy: 0.22, r: 110, vx: 24, vy: 16, color: [196, 163, 90] },
  { fx: 0.18, fy: 0.48, r: 85, vx: -19, vy: 26, color: [100, 140, 255] },
  { fx: 0.74, fy: 0.58, r: 95, vx: 16, vy: -21, color: [232, 100, 130] },
  { fx: 0.38, fy: 0.72, r: 75, vx: -26, vy: -14, color: [80, 200, 140] },
  { fx: 0.86, fy: 0.18, r: 65, vx: -13, vy: 19, color: [150, 100, 220] },
];

// 类型定义
export type Interval = {
  left: number;
  right: number;
};

export type PositionedLine = {
  x: number;
  y: number;
  width: number;
  text: string;
};

export type TextProjection = {
  headlineLeft: number;
  headlineTop: number;
  headlineFont: string;
  headlineLineHeight: number;
  headlineLines: PositionedLine[];
  bodyFont: string;
  bodyLineHeight: number;
  bodyLines: PositionedLine[];
  pullquoteFont: string;
  pullquoteLineHeight: number;
  pullquoteLines: PositionedLine[];
};

export type CircleObstacle = {
  cx: number;
  cy: number;
  r: number;
  hPad: number;
  vPad: number;
};

export type RectObstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type PullquotePlacement = {
  colIdx: number;
  yFrac: number;
  wFrac: number;
  side: 'left' | 'right';
};

export type PullquoteRect = RectObstacle & {
  lines: PositionedLine[];
  colIdx: number;
};

export type OrbColor = [number, number, number];

export type OrbDefinition = {
  fx: number;
  fy: number;
  r: number;
  vx: number;
  vy: number;
  color: OrbColor;
};

export type Orb = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  paused: boolean;
};

export type HeadlineFit = {
  fontSize: number;
  lines: PositionedLine[];
};

export type PullquoteSpec = {
  prepared: any; // PreparedTextWithSegments
  placement: PullquotePlacement;
};

export type PointerSample = {
  x: number;
  y: number;
};

export type PointerState = {
  x: number;
  y: number;
};

export type DragState = {
  orbIndex: number;
  startPointerX: number;
  startPointerY: number;
  startOrbX: number;
  startOrbY: number;
};

export type InteractionMode = 'idle' | 'text-select';
