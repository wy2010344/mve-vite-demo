import { createContext } from 'mve-core';
import { AnimateSignal, BatchOptimistic, GetValue, StoreRef } from 'wy-helper';
import { Task, TaskType } from '../type';

export type DragData = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: StoreRef<'move' | 'remove' | 'cancel' | undefined>;
};
export const taskContext = createContext<{
  tasks: BatchOptimistic<Task[]>;
  dragTask: GetValue<Task | undefined>;
  dragData: StoreRef<DragData | undefined>;
  dragX: AnimateSignal;
  dragY: AnimateSignal;
  columns: Map<string, HTMLElement>;
  targetHolder: StoreRef<
    | {
        element: HTMLElement;
        type: TaskType;
        getBeforeId: GetValue<string | undefined>;
        // index: number
      }
    | undefined
  >;
  backHolder: StoreRef<HTMLElement | undefined>;
  activeColumn: StoreRef<string | undefined>;
}>(undefined!);
