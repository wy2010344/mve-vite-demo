// 小球数据类型
export interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  selected: boolean;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

// 物理参数类型
export interface PhysicsParams {
  gravity: number;
  bounce: number;
  containerWidth: number;
  containerHeight: number;
}
