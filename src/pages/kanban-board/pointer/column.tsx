import { createSignal, GetValue, memo } from 'wy-helper';
import ColumnBase from '../columnBase';
import { Task, TaskType } from '../type';
import { HookRender } from '../xmlRender';
import { taskContext } from './context';
import CardBase from '../cardBase';
import { mve } from 'mve-dom-helper';
import { animateSignal } from 'wy-dom-helper';
import { getClickPosition } from 'mve-dom-helper';

export default function ({ title, type }: { title: string; type: TaskType }) {
  const { tasks, dragData, dragTask, createListContainer } =
    taskContext.consume();

  const getTasks = memo(function () {
    return tasks.get().filter(x => {
      if (x.type != type) {
        return false;
      }
      const d = dragData.get();
      if (d && x.id == d.id && !d.onDropEnd.get()) {
        //=cancel时，才占回位置
        return false;
      }
      return true;
    });
  });
  const { renderChildren, plugin } = createListContainer({
    getList: getTasks,
    getId(n) {
      return n.id;
    },
    accept(n) {
      return 'move';
    },
    createDragData(e, key) {
      return {
        ...getClickPosition(e),
        id: key,
        activeContainer: createSignal(null),
        dragX: animateSignal(0),
        dragY: animateSignal(0),
        onDropEnd: createSignal(false),
      };
    },
    preview(index, d) {
      mve.renderChild(
        <CardBase
          className="opacity-1"
          getTask={dragTask as GetValue<Task>}
          plugin={e => {
            d.targetPlaceholder = {
              element: e,
              type,
              getBeforeId() {
                const task = getTasks()[index()];
                return task?.id;
              },
            };
          }}
        />
      );
    },
  });
  return (
    <ColumnBase
      type={type}
      title={title}
      tasks={tasks.original}
      getTasks={getTasks}
      plugin={plugin}
    >
      <HookRender
        render={() => {
          renderChildren(function ({ key, getData, plugin, onPointerDown }) {
            mve.renderChild(
              <CardBase
                plugin={plugin}
                onDelete={() => {
                  tasks.original.set(
                    tasks.original.get().filter(x => x.id != key)
                  );
                }}
                //拖拽完成的动画，隐藏
                className={() => (dragData.get()?.id == key ? 'opacity-0' : '')}
                getTask={getData}
                onPointerDown={onPointerDown}
              />
            );
          });
        }}
      />
    </ColumnBase>
  );
}
