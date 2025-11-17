import { createContext } from 'mve-core';
import { AnimateSignal, BatchOptimistic, GetValue, StoreRef } from 'wy-helper';
import { Task, TaskType } from '../type';
import { CreateListContainer, SimpleDragData } from '../pointer-absolute/util';

export type DragData = SimpleDragData<string> & {
  targetPlaceholder?: {
    readonly type: TaskType;
    readonly getBeforeId: GetValue<string | undefined>;
  };
  // type: StoreRef<'move' | 'remove' | 'cancel' | undefined>;
};

export type DragType = 'move' | 'remove';
export const taskContext = createContext<{
  tasks: BatchOptimistic<Task[]>;
  dragTask: GetValue<Task | undefined>;
  dragData: StoreRef<DragData | undefined>;
  onDrop(d: DragData): void;
  getAccept: GetValue<
    | {
        data: DragData;
        container: Element;
        accept: DragType;
      }
    | undefined
  >;
  createListContainer: CreateListContainer<Task, DragData, DragType, string>;
  // backHolder: StoreRef<HTMLElement | undefined>;
}>(undefined!);
