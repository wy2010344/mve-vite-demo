import {
  alawaysFalse,
  batchOptimistic,
  batchSignalEnd,
  createSignal,
  emptyFun,
  GetValue,
  memo,
  removeWhere,
  StoreRef,
} from 'wy-helper';
import { ColumnDef, Task } from '../type';
import { renderStateHolder } from 'mve-core';
import { mve, setEdgeScroll } from 'mve-dom-helper';
import pointerColumn from './column';
import { DragData, DragType, taskContext } from './context';
import { renderIf, renderOne } from 'mve-helper';
import CardBase from '../cardBase';
import { fdom } from 'mve-dom';
import { simpleDragContainer } from 'mve-dom-helper';
import { animate } from 'motion';
export default function ({
  tasks: _tasks,
  columns,
}: {
  tasks: StoreRef<Task[]>;
  columns: ColumnDef[];
}) {
  const tasks = batchOptimistic(_tasks);
  const dragData = createSignal<DragData | undefined>(undefined);
  const dragTask = memo(() => {
    const d = dragData.get();
    if (d) {
      return tasks.get().find(x => x.id == d.id);
    }
  });
  const { getAccept, createListContainer } = simpleDragContainer<
    DragData,
    DragType,
    string
  >({
    getDragData: dragData.get,
    setDragData: dragData.set,
    changeIndexAnimate(div, dir, from) {
      animate(div, { [dir]: [from, 0] });
    },
    onDragFinish(d, value) {
      if (value) {
        if (value.accept == 'move') {
          //立即调整本地顺序，乐观更新

          const dtask = dragTask()!;
          const target = d.targetPlaceholder;
          if (!target) {
            throw '';
          }
          const beforeId = target.getBeforeId();
          const out = tasks.set(function (ts) {
            ts = [...ts];
            const row = { ...dtask, type: target.type };
            removeWhere(ts, v => v.id == d.id);
            if (beforeId) {
              for (let i = 0; i < ts.length; i++) {
                const t = ts[i];
                if (t.id == beforeId) {
                  ts.splice(i, 0, row);
                  break;
                }
              }
            } else {
              ts.push(row);
            }
            return ts;
          });
          setTimeout(() => {
            //假设成功了
            out.commit();
          }, 10 * 1000);
          //先调整顺序，因为先设置dropEnd会导致顺序混乱
          // batchSignalEnd();
        }
      }
      d.onDropEnd.set(true);
      batchSignalEnd();
    },
  });
  taskContext.provide({
    tasks,
    dragData,
    dragTask,
    createListContainer,
    getAccept,
  });

  fdom.div({
    plugin(div) {
      setEdgeScroll(div, {
        shouldMeasure: dragData.get,
        direction: 'x',
      });
    },
    className:
      'flex gap-6 overflow-x-auto overflow-y-hidden pb-6 flex-1 relative',
    children() {
      columns.map(c => {
        renderStateHolder(() => {
          mve.renderChild(pointerColumn(c));
        });
      });

      renderOne(dragData.get, d => {
        if (d) {
          renderIf(dragTask, function () {
            mve.renderChild(
              <CardBase
                selected={alawaysFalse}
                onDelete={emptyFun}
                getTask={dragTask as GetValue<Task>}
                className="pointer-events-none opacity-90 fixed"
                s_zIndex={1000}
                s_width={`${d.width}px`}
                s_height={`${d.height}px`}
                s_top={() => `${d.dragY.get() - d.y}px`}
                s_left={() => `${d.dragX.get() - d.x}px`}
                s_transformOrigin={`${d.x}px ${d.y}px`}
                s_rotate={() =>
                  dragData.get()?.onDropEnd.get() ? '0deg' : '-15deg'
                }
              />
            );
          });
        }
      });
    },
  });
}
