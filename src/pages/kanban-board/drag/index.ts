import { renderStateHolder } from 'mve-core';
import { TaskContext } from './context';
import { mve } from 'mve-dom-helper';

import dragColumn from './column';
import { createSignal, StoreRef } from 'wy-helper';
import { ColumnDef, Task } from '../type';
import { fdom } from 'mve-dom';
export default function ({
  tasks,
  columns,
}: {
  tasks: StoreRef<Task[]>;
  columns: ColumnDef[];
}) {
  fdom.div({
    className:
      'flex gap-6 overflow-x-auto overflow-y-hidden pb-6 flex-1 relative',
    children() {
      const dragId = createSignal<string | undefined>(undefined);
      TaskContext.provide({
        dragId,
        tasks,
      });
      columns.map(c => {
        renderStateHolder(() => {
          mve.renderChild(dragColumn(c));
        });
      });
    },
  });
}
