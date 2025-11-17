import {
  addEffect,
  batchSignalEnd,
  createSignal,
  GetValue,
  memo,
  storeRef,
} from 'wy-helper';
import ColumnBase from '../columnBase';
import { Task, TaskType } from '../type';
import { HookRender } from '../xmlRender';
import { DragData, DragType, taskContext } from './context';
import CardBase from '../cardBase';
import { mve } from 'mve-dom-helper';
import {
  buildContainer,
  getClickPosition,
  simpleDragContainer,
} from '../pointer-absolute/util';
import { animateSignal } from 'wy-dom-helper';

export default function ({ title, type }: { title: string; type: TaskType }) {
  const { tasks, dragData, onDrop, getAccept, dragTask, createListContainer } =
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
                onPointerDown={e => {
                  onPointerDown(e, {
                    createDragData() {
                      return {
                        ...getClickPosition(e),
                        id: key,
                        activeContainer: createSignal(null),
                        dragX: animateSignal(0),
                        dragY: animateSignal(0),
                        onDropEnd: createSignal(false),
                      };
                    },
                    onDragFinish(d) {
                      //这里可以改成
                      const value = getAccept();
                      if (value) {
                        if ((value.accept = 'move')) {
                          //立即调整本地顺序，乐观更新
                          onDrop(d);
                          //先调整顺序，因为先设置dropEnd会导致顺序混乱
                          // batchSignalEnd();
                        }
                      }
                      d.onDropEnd.set(true);
                      batchSignalEnd();
                    },
                  });
                }}
              />
            );
          });
        }}
      />
    </ColumnBase>
  );
}
