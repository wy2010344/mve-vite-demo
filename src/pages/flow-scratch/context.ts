import { createContext } from 'mve-core';
import { StoreRef } from 'wy-helper';

export interface GetPoint {
  x(): number;
  y(): number;
}

export interface NodeType<T = any> {
  render(n: Node<T>): void;
  /**
   * 目标节点上找不到，是不存在的，要删除
   * @param key
   */
  inputLocation(key: string): GetPoint | void;
  outputLocation(key: string): GetPoint | void;
}
export interface NodeArgs<T = any> {
  id: string;
  x: StoreRef<number>;
  y: StoreRef<number>;
  data: T;
  /**入端子线 */
  inputs: StoreRef<{
    //入端参数
    readonly [key in string]: LineFrom;
  }>;
}
export interface LineFrom {
  //值来源端节点
  fromNode: Node<any>;
  //出端的节点值
  fromKey: string;
}

export interface Node<T = any> {
  type: NodeType;
  args: NodeArgs<T>;
}
export const context = createContext<{
  scale: StoreRef<number>;
  selectedNode: StoreRef<NodeArgs | undefined>;
  onPointerDownOutput(e: PointerEvent, node: Node, key: string): void;
  onPointerEnterInput(e: PointerEvent, node: Node, key: string): void;
  onPointerLeaveInput(e: PointerEvent, node: Node, key: string): void;
}>(undefined!);

/**
 * 依电路元件为单位
 * 多输入端，多输出端。
 * 输入端只能连一条线，输出端可以多条线。
 * 就像一个函数一样。
 * 记录组件实例，每个输入端来源于哪个模块、哪个输出端。
 * 当不确定其类型的时候，动态生成
 *
 *
 * 通用节点
 *  通用入端列表
 *    通用入端
 *  通用出端列表
 *    通用出端
 *
 * 还有返回每个端子的计算偏移，这是属于类型的
 * 一方面希望从数据生成模型
 * 另一方面希望手动控制模型
 *  主要是定制模型（非一般map）有一些额外字段
 *
 * 其实列表入参比较普遍，一般不调序。特别是同一类型需要样式相同而不是命名端子相同。
 *
 *
 *
 * 进一步：
 *  端子类型的吸引与抗拒——光标形状
 *  出端子禁止——光标形状
 * 输出端可动态增加，是一种单源的计算属性，可以是一个复杂的表达式或函数，但入参只有原始的输出(it)，只有与当前页面源中相关联，才将计算提取为组件
 *
 * @todo
 *  1. 缩放没有居中缩放
 *  2. 进而光标拖线，在偏移时不正常
 */
