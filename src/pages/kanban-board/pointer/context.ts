import { createContext } from 'mve-core';
import { BatchOptimistic, GetValue, StoreRef } from 'wy-helper';
import { Task, TaskType } from '../type';
import { CreateListContainer, SimpleDragData } from 'mve-dom-helper';

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
