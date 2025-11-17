import { mve } from 'mve-dom-helper';
import { createSignal, GetValue, memo } from 'wy-helper';
import { PriorityType, priorityTypes, TaskType } from '../type';
import { LuPlus } from 'mve-icons/lu';
import { ArrayRender, HookRender, If } from '../xmlRender';
import { renderSizeSvg } from '../../../mve-icon';
import task from './task';
import Indicator from './indicator';
import { renderPortal } from 'mve-dom';
import { faker } from '@faker-js/faker';
import ColumnBase from '../columnBase';
import { ColumnContext, TaskContext } from './context';

function priorityValue(n: PriorityType) {
  if (n == 'high') {
    return 1;
  }
  if (n == 'medium') {
    return 2;
  }
  return 3;
}
export default function ({ title, type }: { title: string; type: TaskType }) {
  const { dragId, tasks } = TaskContext.consume();
  const getTasks = memo(function () {
    return tasks.get().filter(x => x.type == type && x.id != dragId.get());
    // .sort((a, b) => priorityValue(a.priority) - priorityValue(b.priority));
  });

  const activeIndicator = createSignal<string | undefined>(undefined);
  ColumnContext.provide({
    type,
    getActive: activeIndicator.get,
  });
  function handleNearestIndicator(clientY: number) {
    const indicators = Array.from(
      document.querySelectorAll(
        `[data-column="${type}"]`
      ) as unknown as HTMLElement[]
    );
    const DISTANCE_OFFSET = 100; //假设为卡片的高度
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = clientY - (box.top + DISTANCE_OFFSET / 2);
        if (offset < 0 && offset > closest.offset) {
          return {
            offset,
            element: child,
          };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators.at(-1),
      }
    );
    const newId = el.element?.dataset.before;
    const oldId = activeIndicator.get();
    if (oldId != newId) {
      activeIndicator.set(newId);
    }
    return newId;
  }
  return (
    <ColumnBase
      type={type}
      title={title}
      tasks={tasks}
      getTasks={getTasks}
      onDragOver={e => {
        e.preventDefault();
        e.dataTransfer!.dropEffect = 'move';
        handleNearestIndicator(e.clientY);
      }}
      onDragLeave={e => {
        activeIndicator.set(undefined);
      }}
      onDrop={e => {
        const beforeId = handleNearestIndicator(e.clientY);
        const drag = dragId.get();
        if (beforeId != drag) {
          const task = tasks.get().find(v => v.id == drag)!;
          const dragTask =
            task.type == type
              ? task
              : {
                  ...task,
                  type,
                };
          const filteredTasks = tasks.get().filter(v => v.id != drag);
          if (beforeId == '') {
            filteredTasks.push(dragTask);
          } else {
            const insertAtIndex = filteredTasks.findIndex(
              e => e.id == beforeId
            );
            filteredTasks.splice(insertAtIndex, 0, dragTask);
          }
          tasks.set(filteredTasks);
        }
        activeIndicator.set(undefined);
      }}
    >
      <ArrayRender
        getArray={getTasks}
        getKey={v => v.id}
        render={function (getValue, getIndex, key) {
          task({
            getTask: getValue,
            onDelete(id) {
              tasks.set(tasks.get().filter(x => x.id != key));
            },
            onDragStart(e) {
              dragId.set(key);
            },
          });
        }}
      />
      <Indicator />
    </ColumnBase>
  );
}
