import { createContext } from 'mve-core';
import { StoreRef } from 'wy-helper';
import { Task, TaskType } from '../type';

export const TaskContext = createContext<{
  tasks: StoreRef<Task[]>;
  dragId: StoreRef<string | undefined>;
}>(undefined!);

export const ColumnContext = createContext<{
  type: TaskType;
  getActive(): string | undefined;
}>(undefined!);
